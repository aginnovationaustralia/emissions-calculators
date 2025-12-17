import { readdirSync, readFileSync, statSync, writeFileSync } from 'fs';
import path, { join } from 'path';

const filesToSkip = [
  'types.ts',
  'descriptions.schema.ts',
  'decorator.schema.ts',
  'schemas.ts',
];

function isDeepSchema(exportName: string): boolean {
  return (
    exportName.endsWith('Schema') &&
    !exportName.endsWith('OutputSchema') &&
    !exportName.endsWith('InputSchema')
  );
}

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

const typesFoldersToSkip = ['common'];

function generatePerFolderTypeExports() {
  // Get all folders in src/types
  const typesFolders = readdirSync('src/types', { withFileTypes: true });
  for (const folder of typesFolders.filter((entry) => entry.isDirectory())) {
    if (typesFoldersToSkip.includes(folder.name)) {
      continue;
    }
    const folderPath = join('src/types', folder.name);
    const folderFiles = getAllTypeFiles(folderPath);

    // For each file in the folder, extract the exports
    // Collect them in a list just for this folder
    const folderExports = [];
    for (const file of folderFiles) {
      const exports = extractExports(file);
      for (const exportName of exports) {
        if (isDeepSchema(exportName)) {
          continue;
        }
        folderExports.push(
          `export { ${exportName} } from './${path
            .basename(file)
            .replace('.ts', '')}';`,
        );
      }
    }

    // Now dump the exports for this folder into the folder's index.ts
    const indexContent = folderExports.join('\n') + '\n';
    writeFileSync(join('src/types', folder.name, 'index.ts'), indexContent);
  }
}

function generateRootTypeExports() {
  const typesDir = 'src/types';
  const typeFiles = getAllTypeFiles(typesDir);

  const allExports = [];
  const seenExports = new Set();

  for (const file of typeFiles) {
    const relativePath = file.replace('src/types/', './');
    const exports = extractExports(file);

    for (const exportName of exports) {
      if (isDeepSchema(exportName)) {
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

export function generateTypeExports() {
  generateRootTypeExports();
  generatePerFolderTypeExports();
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  generateTypeExports();
}
