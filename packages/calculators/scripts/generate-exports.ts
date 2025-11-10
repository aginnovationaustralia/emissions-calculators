import { readdirSync, readFileSync, statSync, writeFileSync } from 'fs';
import { join } from 'path';

const filesToSkip = [
  'types.ts',
  'descriptions.schema.ts',
  'decorator.schema.ts',
  'schemas.ts',
];

function getAllTypeFiles(dir: string, typeFiles: string[] = []) {
  const files = readdirSync(dir);

  for (const file of files.filter((file) => !filesToSkip.includes(file))) {
    const fullPath = join(dir, file);
    const stat = statSync(fullPath);

    if (stat.isDirectory()) {
      getAllTypeFiles(fullPath, typeFiles);
    } else if (file.endsWith('.ts') && !file.endsWith('.test.ts')) {
      typeFiles.push(fullPath);
    }
  }

  return typeFiles;
}

function extractExports(filePath: string) {
  const content = readFileSync(filePath, 'utf8');
  const exports = [];

  // Match export statements
  const exportRegex = /export\s+(?:class|interface|type|enum|const)\s+(\w+)/g;
  let match;

  while ((match = exportRegex.exec(content)) !== null) {
    exports.push(match[1]);
  }

  return exports;
}

export function generateTypeExports() {
  const typesDir = 'src/types';
  const typeFiles = getAllTypeFiles(typesDir);

  const allExports = [];
  const seenExports = new Set();

  for (const file of typeFiles) {
    const relativePath = file.replace('src/types/', './');
    const exports = extractExports(file);

    for (const exportName of exports) {
      if (
        exportName.endsWith('Schema') &&
        !exportName.endsWith('OutputSchema') &&
        !exportName.endsWith('InputSchema')
      ) {
        continue;
      }
      if (!seenExports.has(exportName)) {
        allExports.push(
          `export { ${exportName} } from '${relativePath.replace('.ts', '')}';`,
        );
        seenExports.add(exportName);
      } else {
        throw new Error(`Duplicate export: ${exportName}`);
      }
    }
  }

  // Sort exports alphabetically
  allExports.sort();

  const indexContent = allExports.join('\n') + '\n';

  writeFileSync('src/types/index.ts', indexContent);
  console.log(`Generated ${allExports.length} type exports`);
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  generateTypeExports();
}
