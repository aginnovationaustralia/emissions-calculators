import { readdirSync, readFileSync, statSync, writeFileSync } from 'fs';
import { join } from 'path';

function getAllTypeFiles(dir, typeFiles = []) {
  const files = readdirSync(dir);
  
  for (const file of files) {
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

function extractExports(filePath) {
  const content = readFileSync(filePath, 'utf8');
  const exports = [];
  
  // Match export statements
  const exportRegex = /export\s+(?:class|interface|type|enum)\s+(\w+)/g;
  let match;
  
  while ((match = exportRegex.exec(content)) !== null) {
    exports.push(match[1]);
  }
  
  return exports;
}

export function generateTypeExports() {
  const typesDir = 'src/versions/3.0.0/types';
  const typeFiles = getAllTypeFiles(typesDir);
  
  const allExports = [];
  const seenExports = new Set();
  
  for (const file of typeFiles) {
    const relativePath = file.replace('src/versions/3.0.0/types/', './');
    const exports = extractExports(file);
    
    for (const exportName of exports) {
      if (!seenExports.has(exportName)) {
        allExports.push(`export { ${exportName} } from '${relativePath.replace('.ts', '')}';`);
        seenExports.add(exportName);
      }
    }
  }
  
  // Sort exports alphabetically
  allExports.sort();
  
  const indexContent = allExports.join('\n') + '\n';
  
  writeFileSync('src/versions/3.0.0/types/index.ts', indexContent);
  console.log(`Generated ${allExports.length} type exports`);
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  generateTypeExports();
}
