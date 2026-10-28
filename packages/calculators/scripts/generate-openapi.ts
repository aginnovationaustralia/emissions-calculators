import { createOpenApiSchemaBundleInternal } from '@/types/openapi/create';
import fs, { readFileSync } from 'fs';
import { join } from 'path';
import semver from 'semver';

/**
 * Every `oneOf` branch in the generated OpenAPI output is expected to carry a
 * `title` (set via `.meta({ title: '...' })` on the originating Zod schema) so
 * API consumers can distinguish variants without inspecting the schema body.
 *
 * This checker walks a generated OpenAPI document looking for any `oneOf`
 * whose branches are missing a title, resolving `$ref`s into
 * `components/schemas` along the way, and reports enough context (JSON path,
 * discriminator literal if one is present, required/property field names) to
 * make it easy to find the Zod schema that needs `.meta({ title: ... })`
 * added, without needing a live mapping back to source.
 */
interface OneOfTitleIssue {
  source: string;
  path: string;
  fieldName?: string;
  discriminators: { key: string; value: unknown }[];
  requiredFields: string[];
  propertyNames: string[];
}

const resolveJsonPointerRef = (ref: string, root: unknown): unknown => {
  if (!ref.startsWith('#/')) return undefined;
  return ref
    .slice(2)
    .split('/')
    .reduce<unknown>((node, part) => {
      if (node && typeof node === 'object') {
        return (node as Record<string, unknown>)[part];
      }
      return undefined;
    }, root);
};

const describeOneOfBranch = (branch: Record<string, unknown>) => {
  const properties = (branch.properties ?? {}) as Record<string, unknown>;
  const propertyNames = Object.keys(properties);
  const requiredFields = Array.isArray(branch.required)
    ? (branch.required as string[])
    : [];
  const discriminators: { key: string; value: unknown }[] = [];
  for (const [key, value] of Object.entries(properties)) {
    if (!value || typeof value !== 'object') continue;
    const v = value as Record<string, unknown>;
    if ('const' in v) {
      discriminators.push({ key, value: v.const });
    } else if (Array.isArray(v.enum) && v.enum.length === 1) {
      discriminators.push({ key, value: v.enum[0] });
    }
  }
  return { propertyNames, requiredFields, discriminators };
};

/**
 * Recursively walks a generated OpenAPI document (one calculator's schema)
 * looking for `oneOf` arrays with untitled branches. `$ref`s are resolved
 * against `root` so branches referenced via `components/schemas` (e.g. a
 * shared, `.meta({ id })`-tagged schema) are still checked; each distinct
 * `$ref` is only walked once per document to avoid duplicate reports.
 */
const findOneOfTitleIssues = (
  root: unknown,
  source: string,
): OneOfTitleIssue[] => {
  const issues: OneOfTitleIssue[] = [];
  const visitedRefs = new Set<string>();

  const walk = (node: unknown, path: string, fieldName?: string) => {
    if (node === null || typeof node !== 'object') return;

    if (Array.isArray(node)) {
      node.forEach((item, i) => walk(item, `${path}[${i}]`, fieldName));
      return;
    }

    const obj = node as Record<string, unknown>;

    if (typeof obj.$ref === 'string') {
      if (visitedRefs.has(obj.$ref)) return;
      visitedRefs.add(obj.$ref);
      const resolved = resolveJsonPointerRef(obj.$ref, root);
      if (resolved) {
        walk(resolved, `${path} -> ${obj.$ref}`, fieldName);
      }
      return;
    }

    if (Array.isArray(obj.oneOf)) {
      obj.oneOf.forEach((branch, i) => {
        if (!branch || typeof branch !== 'object') return;
        // A $ref branch carries its title alongside the $ref or on the referenced component
        const rawBranch = branch as Record<string, unknown>;
        if (typeof rawBranch.title === 'string' && rawBranch.title.length > 0) {
          return;
        }
        const resolvedBranch =
          typeof rawBranch.$ref === 'string'
            ? resolveJsonPointerRef(rawBranch.$ref, root)
            : rawBranch;
        if (!resolvedBranch || typeof resolvedBranch !== 'object') return;
        const branchObj = resolvedBranch as Record<string, unknown>;
        if (typeof branchObj.title === 'string' && branchObj.title.length > 0) {
          return;
        }
        issues.push({
          source,
          path: `${path}.oneOf[${i}]`,
          fieldName,
          ...describeOneOfBranch(branchObj),
        });
      });
    }

    for (const [key, value] of Object.entries(obj)) {
      walk(value, `${path}.${key}`, key);
    }
  };

  walk(root, '$');
  return issues;
};

const formatOneOfTitleIssue = (issue: OneOfTitleIssue): string => {
  const lines = [
    `❌ [${issue.source}] oneOf branch missing "title"`,
    `   Field: ${issue.fieldName ?? '(root)'}`,
    `   Path:  ${issue.path}`,
  ];
  if (issue.discriminators.length > 0) {
    lines.push(
      `   Discriminator: ${issue.discriminators
        .map(({ key, value }) => `${key} = ${JSON.stringify(value)}`)
        .join(', ')}`,
    );
  }
  if (issue.requiredFields.length > 0) {
    lines.push(`   Required fields: ${issue.requiredFields.join(', ')}`);
  }
  if (issue.propertyNames.length > 0) {
    lines.push(`   Properties: ${issue.propertyNames.join(', ')}`);
  }

  // Prefer a distinctive discriminator literal (skip short generic ones like "1"/"2",
  // which match too much to be a useful grep target) or a less-generic field name -
  // the last required/property field is often the one unique to this specific branch,
  // since shared base fields tend to be listed first.
  const isGeneric = (value: unknown) =>
    typeof value !== 'string' || value.length <= 3;
  const grepTarget =
    issue.discriminators.find((d) => !isGeneric(d.value))?.value ??
    [...issue.requiredFields].reverse().find((f) => !isGeneric(f)) ??
    [...issue.propertyNames].reverse().find((f) => !isGeneric(f)) ??
    issue.discriminators[0]?.value ??
    issue.requiredFields[0] ??
    issue.propertyNames[0];
  const grepHint =
    typeof grepTarget === 'string'
      ? `grep -rn ${JSON.stringify(grepTarget)} src/`
      : `search src/ for the Zod schema with these fields`;
  lines.push(
    `   → Likely fix: find the Zod object schema that produces these fields (try: ${grepHint}) ` +
      `and add \`.meta({ title: '<label>' })\` to it (or to the union/xor branch itself if it's ` +
      `built from a shared factory), matching the pattern in ` +
      `src/modules/scope2/14-electricity/location-based.input.ts.`,
  );
  return lines.join('\n');
};

const packageJson = JSON.parse(readFileSync('./package.json', 'utf8'));

// Strip prerelease tags (e.g. 4.0.1-beta.4 → 4.0.1) for stable file/folder names
const currentVersion = semver.coerce(packageJson.version)?.version;
if (!currentVersion) {
  throw new Error(
    `Could not parse version from package.json: ${packageJson.version}`,
  );
}

const versionDir = join('openapi', currentVersion);
fs.mkdirSync(versionDir, { recursive: true });

const { combined, calculators } =
  createOpenApiSchemaBundleInternal(currentVersion);

fs.writeFileSync(
  join(versionDir, `openapi-${currentVersion}.json`),
  JSON.stringify(combined, null, 2),
);

const oneOfTitleIssues: OneOfTitleIssue[] = [];

for (const [name, schema] of Object.entries(calculators)) {
  fs.writeFileSync(
    join(versionDir, `openapi-${name}-${currentVersion}.json`),
    JSON.stringify(schema, null, 2),
  );
  oneOfTitleIssues.push(...findOneOfTitleIssues(schema, name));
}

console.log(`Wrote OpenAPI specs to ${versionDir}/`);
console.log(`  openapi-${currentVersion}.json (combined)`);
for (const name of Object.keys(calculators)) {
  console.log(`  openapi-${name}-${currentVersion}.json`);
}

if (oneOfTitleIssues.length > 0) {
  console.error(
    `\n✖ ${oneOfTitleIssues.length} oneOf branch(es) missing a "title":\n`,
  );
  for (const issue of oneOfTitleIssues) {
    console.error(formatOneOfTitleIssue(issue));
    console.error('');
  }
  console.error(
    "Fix: add .meta({ title: '...' }) to each Zod schema listed above (see " +
      'src/modules/scope2/14-electricity/location-based.input.ts / market-based.input.ts ' +
      'for the reference pattern), then re-run generate:openapi.',
  );
  process.exitCode = 1;
} else {
  console.log('\n✓ Every oneOf branch has a title.');
}
