import { readFileSync } from 'fs';
import { join } from 'path';

// Read package.json and set PACKAGE_VERSION as a global
const packageJsonPath = join(__dirname, 'package.json');
const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));

// Set it on the global object so it's available in all tests
(global as unknown as { PACKAGE_VERSION: string }).PACKAGE_VERSION =
  packageJson.version;
