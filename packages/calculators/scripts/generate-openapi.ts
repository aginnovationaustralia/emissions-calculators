import fs, { readFileSync } from 'fs';
import { createOpenApiSchemaFile } from '../src/types/openapi';
const packageJson = JSON.parse(readFileSync('./package.json', 'utf8'));

fs.mkdirSync('openapi', { recursive: true });

const currentVersion = packageJson.version;

const schema = createOpenApiSchemaFile();

fs.writeFileSync(
  `openapi/openapi-${currentVersion}.json`,
  JSON.stringify(schema, null, 2),
);
