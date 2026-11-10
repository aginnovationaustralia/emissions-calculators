import { existsSync, mkdirSync, writeFileSync } from 'fs';
import path from 'path';
import { exit } from 'process';
import { mappings2026 } from './mappings';
import { generateExtract } from './table';

const outDir = path.join(path.resolve(__dirname), '../../src/constants/ngaf');

const main = async () => {
  const extract = await generateExtract(process.argv[2], mappings2026);

  if (!existsSync(outDir)) {
    mkdirSync(outDir);
  }

  const filename = extract.year + '.json';

  writeFileSync(path.join(outDir, filename), JSON.stringify(extract));

  console.log(outDir);
};

main()
  .then(() => exit(0))
  .catch((err) => {
    console.error(err);
    exit(1);
  });
