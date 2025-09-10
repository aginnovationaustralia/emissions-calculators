// As this is a utility script we'll exclude it from eslint checks
import * as fs from 'fs';
import { schema as schemaAquacultureInput } from '../types/Aquaculture/input';
import { schema as schemaAquacultureOutput } from '../types/Aquaculture/output';
import { schema as schemaBeef } from '../types/Beef/input';
import { schema as schemaBeefOutput } from '../types/Beef/output';
import { schema as schemaBuffaloInput } from '../types/Buffalo/input';
import { schema as schemaBuffaloOutput } from '../types/Buffalo/output';
import { schema as schemaCotton } from '../types/Cotton/input';
import { schema as schemaCottonOutput } from '../types/Cotton/output';
import { schema as schemaDairy } from '../types/Dairy/input';
import { schema as schemaDairyOutput } from '../types/Dairy/output';
import { schema as schemaDeerInput } from '../types/Deer/input';
import { schema as schemaDeerOutput } from '../types/Deer/output';
import { schema as schemaFeedlot } from '../types/Feedlot/input';
import { schema as schemaFeedlotOutput } from '../types/Feedlot/output';
import { schema as schemaGoat } from '../types/Goat/input';
import { schema as schemaGoatOutput } from '../types/Goat/output';
import { schema as schemaGrains } from '../types/Grains/input';
import { schema as schemaGrainsOutput } from '../types/Grains/output';
import { schema as schemaHorticultureInput } from '../types/Horticulture/input';
import { schema as schemaHorticultureOutput } from '../types/Horticulture/output';
import { schema as schemaPork } from '../types/Pork/input';
import { schema as schemaPorkOutput } from '../types/Pork/output';
import { schema as schemaPoultry } from '../types/Poultry/input';
import { schema as schemaPoultryOutput } from '../types/Poultry/output';
import { schema as schemaProcessingInput } from '../types/Processing/input';
import { schema as schemaProcessingOutput } from '../types/Processing/output';
import { schema as schemaRiceInput } from '../types/Rice/input';
import { schema as schemaRiceOutput } from '../types/Rice/output';
import { schema as schemaSheep } from '../types/Sheep/input';
import { schema as schemaSheepOutput } from '../types/Sheep/output';
import { schema as schemaSheepBeef } from '../types/SheepBeef/input';
import { schema as schemaSheepBeefOutput } from '../types/SheepBeef/output';
import { schema as schemaSugar } from '../types/Sugar/input';
import { schema as schemaSugarOutput } from '../types/Sugar/output';
import { schema as schemaVineyardInput } from '../types/Vineyard/input';
import { schema as schemaVineyardOutput } from '../types/Vineyard/output';
import { schema as schemaWildCatchFisheryInput } from '../types/WildCatchFishery/input';
import { schema as schemaWildCatchFisheryOutput } from '../types/WildCatchFishery/output';
import { schema as schemaWildSeaFisheriesInput } from '../types/WildSeaFisheries/input';
import { schema as schemaWildSeaFisheriesOutput } from '../types/WildSeaFisheries/output';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
function replaceRefs(obj: unknown): unknown {
  if (typeof obj !== 'object' || obj === null) {
    return obj;
  }

  if ('$ref' in obj && typeof obj.$ref === 'string') {
    // eslint-disable-next-line no-param-reassign
    obj.$ref = `${obj.$ref.replace(/^#\/definitions\//, './')}.json`;
  }

  // eslint-disable-next-line no-restricted-syntax
  for (const key in obj) {
    // eslint-disable-next-line no-prototype-builtins
    if (obj.hasOwnProperty(key)) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      // eslint-disable-next-line no-param-reassign
      obj[key] = replaceRefs(obj[key]);
    }
  }

  return obj;
}

const schema = {
  ...schemaAquacultureInput,
  ...schemaAquacultureOutput,
  ...schemaBeef,
  ...schemaBeefOutput,
  ...schemaBuffaloInput,
  ...schemaBuffaloOutput,
  ...schemaCotton,
  ...schemaCottonOutput,
  ...schemaDairy,
  ...schemaDairyOutput,
  ...schemaDeerInput,
  ...schemaDeerOutput,
  ...schemaFeedlot,
  ...schemaFeedlot,
  ...schemaFeedlotOutput,
  ...schemaGoat,
  ...schemaGoat,
  ...schemaGoatOutput,
  ...schemaGrains,
  ...schemaGrains,
  ...schemaGrainsOutput,
  ...schemaPork,
  ...schemaPorkOutput,
  ...schemaPoultry,
  ...schemaPoultryOutput,
  ...schemaSheep,
  ...schemaSheepBeef,
  ...schemaSheepBeefOutput,
  ...schemaSheepOutput,
  ...schemaSugar,
  ...schemaSugarOutput,
  ...schemaWildSeaFisheriesInput,
  ...schemaWildSeaFisheriesOutput,
  ...schemaHorticultureInput,
  ...schemaHorticultureOutput,
  ...schemaRiceInput,
  ...schemaRiceOutput,
  ...schemaProcessingInput,
  ...schemaProcessingOutput,
  ...schemaVineyardInput,
  ...schemaVineyardOutput,
  ...schemaWildCatchFisheryInput,
  ...schemaWildCatchFisheryOutput,
};

// Write
// eslint-disable-next-line no-restricted-syntax
for (const key of Object.keys(schema)) {
  schema[key].title = key;
}

const versionFromCurrentPath = __dirname.split('/').slice(-2, -1)[0];

// TODO: make this an absolute path
const path = `./fern/apis/${versionFromCurrentPath}/openapi/schemas/`;

if (!fs.existsSync(path)) {
  fs.mkdirSync(path, { recursive: true });
}

fs.rmSync(path, { recursive: true });
fs.mkdirSync(path, { recursive: true });

// eslint-disable-next-line no-restricted-syntax
for (const key of Object.keys(schema)) {
  fs.writeFileSync(
    `${path}${key}.json`,
    JSON.stringify(replaceRefs(schema[key]), null, 2),
  );
}
