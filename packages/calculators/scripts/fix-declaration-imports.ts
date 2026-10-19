import { existsSync, readdirSync, readFileSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';

// tsc-alias rewrites `@/foo` to the first matching file it finds in dist,
// which is `foo.cjs`. TypeScript resolves `./foo.cjs` to `./foo.d.cts`, which
// we don't emit, so those imports silently become `any` for consumers.
// Strip the extension so `./foo` resolves to `./foo.d.ts`, then verify that
// every relative specifier in the declarations resolves to a declaration file.

const distDir = 'dist';

const specifierRegex =
  /(\bfrom\s*|\bimport\s*\(\s*|\bimport\s+)(['"])([^'"\r\n]+)\2/g;

function getDeclarationFiles(dir: string, files: string[] = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      getDeclarationFiles(fullPath, files);
    } else if (entry.name.endsWith('.d.ts')) {
      files.push(fullPath);
    }
  }
  return files;
}

function resolvesToDeclaration(file: string, specifier: string) {
  const target = join(dirname(file), specifier);
  return (
    existsSync(`${target}.d.ts`) || existsSync(join(target, 'index.d.ts'))
  );
}

export function fixDeclarationImports() {
  const problems: string[] = [];
  let rewrittenFiles = 0;

  for (const file of getDeclarationFiles(distDir)) {
    const content = readFileSync(file, 'utf8');
    const updated = content.replace(
      specifierRegex,
      (orig, prefix: string, quote: string, specifier: string) => {
        if (specifier.startsWith('node_modules/')) {
          problems.push(`${file}: non-portable import '${specifier}'`);
          return orig;
        }
        if (!specifier.startsWith('./') && !specifier.startsWith('../')) {
          return orig;
        }
        const stripped = specifier.replace(/\.(c|m)?js$/, '');
        if (!resolvesToDeclaration(file, stripped)) {
          problems.push(`${file}: cannot resolve '${specifier}'`);
          return orig;
        }
        return `${prefix}${quote}${stripped}${quote}`;
      },
    );

    if (updated !== content) {
      writeFileSync(file, updated);
      rewrittenFiles++;
    }
  }

  console.log(`Fixed declaration imports in ${rewrittenFiles} files`);

  if (problems.length > 0) {
    const unique = [...new Set(problems)];
    console.error(
      `Found ${unique.length} broken declaration imports:\n` +
        unique.map((p) => `  ${p}`).join('\n'),
    );
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  fixDeclarationImports();
}
