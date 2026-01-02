import {
  entriesFromObject,
  ObjectEntry,
  objectFromEntries,
} from '@/calculators/common/tools/object';
import { packageVersion } from '@/calculators/execution/version';
import { OpenAPIObject } from 'openapi3-ts/oas31';
import * as z from 'zod';
import {
  createDocument,
  createSchema,
  ZodOpenApiPathsObject,
} from 'zod-openapi';
import { CalculatorNames } from '../calculators/strings';
import { AquacultureInputSchema, AquacultureOutputSchema } from './Aquaculture';
import { BeefInputSchema, BeefOutputSchema } from './Beef';
import { BuffaloInputSchema, BuffaloOutputSchema } from './Buffalo';
import { CottonInputSchema, CottonOutputSchema } from './Cotton';
import { DairyInputSchema, DairyOutputSchema } from './Dairy';
import { DeerInputSchema, DeerOutputSchema } from './Deer';
import { FeedlotInputSchema, FeedlotOutputSchema } from './Feedlot';
import { GoatInputSchema, GoatOutputSchema } from './Goat';
import { GrainsInputSchema, GrainsOutputSchema } from './Grains';
import {
  HorticultureInputSchema,
  HorticultureOutputSchema,
} from './Horticulture';
import { PorkInputSchema, PorkOutputSchema } from './Pork';
import { PoultryInputSchema, PoultryOutputSchema } from './Poultry';
import { ProcessingInputSchema, ProcessingOutputSchema } from './Processing';
import { RiceInputSchema, RiceOutputSchema } from './Rice';
import { SheepInputSchema, SheepOutputSchema } from './Sheep';
import { SheepBeefInputSchema, SheepBeefOutputSchema } from './SheepBeef';
import { SugarInputSchema, SugarOutputSchema } from './Sugar';
import { VineyardInputSchema, VineyardOutputSchema } from './Vineyard';
import {
  WildCatchFisheryInputSchema,
  WildCatchFisheryOutputSchema,
} from './WildCatchFishery';
import {
  WildSeaFisheriesInputSchema,
  WildSeaFisheriesOutputSchema,
} from './WildSeaFisheries';

type Endpoint<
  TI extends z.core.$ZodLooseShape,
  TO extends z.core.$ZodLooseShape,
> = {
  inputSchema: z.ZodObject<TI>;
  outputSchema: z.ZodObject<TO>;
};

const endpoints: Record<
  Omit<CalculatorNames, 'feedlotbeef'> & string,
  Endpoint<z.core.$ZodLooseShape, z.core.$ZodLooseShape>
> = {
  aquaculture: {
    inputSchema: AquacultureInputSchema,
    outputSchema: AquacultureOutputSchema,
  },
  beef: {
    inputSchema: BeefInputSchema,
    outputSchema: BeefOutputSchema,
  },
  buffalo: {
    inputSchema: BuffaloInputSchema,
    outputSchema: BuffaloOutputSchema,
  },
  cotton: {
    inputSchema: CottonInputSchema,
    outputSchema: CottonOutputSchema,
  },
  dairy: {
    inputSchema: DairyInputSchema,
    outputSchema: DairyOutputSchema,
  },
  deer: {
    inputSchema: DeerInputSchema,
    outputSchema: DeerOutputSchema,
  },
  feedlot: {
    inputSchema: FeedlotInputSchema,
    outputSchema: FeedlotOutputSchema,
  },
  goat: {
    inputSchema: GoatInputSchema,
    outputSchema: GoatOutputSchema,
  },
  grains: {
    inputSchema: GrainsInputSchema,
    outputSchema: GrainsOutputSchema,
  },
  horticulture: {
    inputSchema: HorticultureInputSchema,
    outputSchema: HorticultureOutputSchema,
  },
  rice: {
    inputSchema: RiceInputSchema,
    outputSchema: RiceOutputSchema,
  },
  processing: {
    inputSchema: ProcessingInputSchema,
    outputSchema: ProcessingOutputSchema,
  },
  pork: {
    inputSchema: PorkInputSchema,
    outputSchema: PorkOutputSchema,
  },
  poultry: {
    inputSchema: PoultryInputSchema,
    outputSchema: PoultryOutputSchema,
  },
  sheep: {
    inputSchema: SheepInputSchema,
    outputSchema: SheepOutputSchema,
  },
  sheepbeef: {
    inputSchema: SheepBeefInputSchema,
    outputSchema: SheepBeefOutputSchema,
  },
  sugar: {
    inputSchema: SugarInputSchema,
    outputSchema: SugarOutputSchema,
  },
  vineyard: {
    inputSchema: VineyardInputSchema,
    outputSchema: VineyardOutputSchema,
  },
  wildcatchfishery: {
    inputSchema: WildCatchFisheryInputSchema,
    outputSchema: WildCatchFisheryOutputSchema,
  },
  wildseafisheries: {
    inputSchema: WildSeaFisheriesInputSchema,
    outputSchema: WildSeaFisheriesOutputSchema,
  },
};

/* NOTE: The zod meta tag content is collected in a global registry object that is not accessible outside the library boundary at runtime.
 * This is why we need to create the schemas manually here.
 */
export const openapiSchemas = () =>
  entriesFromObject(endpoints).map(([name, endpoint]) => ({
    name,
    inputSchema: createSchema(endpoint.inputSchema).schema,
    outputSchema: createSchema(endpoint.outputSchema).schema,
  }));

export const createOpenApiSchema = (): OpenAPIObject => {
  const deprecatedPaths = ['wildseafisheries'];

  const endpoints = openapiSchemas().map((schema) => ({
    // NOTE: This API uses the CalculatorNames enum as the API paths for each calculator
    path: schema.name,
    inputSchema: schema.inputSchema,
    outputSchema: schema.outputSchema,
  }));

  const paths = objectFromEntries(
    endpoints.map(
      ({
        path,
        inputSchema,
        outputSchema,
      }): ObjectEntry<ZodOpenApiPathsObject> => [
        `/${path}`,
        {
          post: {
            summary: `Perform ${path} calculation`,
            description: 'Retrieve a simple JSON response',
            operationId: `post-${path}`,
            deprecated: deprecatedPaths.includes(path),
            requestBody: {
              required: true,
              content: {
                'application/json': {
                  schema: inputSchema,
                },
              },
            },
            responses: {
              200: {
                description: 'Executes a calculation',
                content: {
                  'application/json': {
                    schema: outputSchema,
                  },
                },
              },
              401: {
                description: 'Unauthorized',
              },
            },
            tags: ['GAF'],
          },
        },
      ],
    ),
  );

  const schema = createDocument({
    openapi: '3.1.0',
    info: {
      title: 'AIA Calculator API',
      version: packageVersion(),
      description: 'Emissions Calculators for various farming activities',
      contact: {
        name: 'AIA',
        url: 'https://aginnovationaustralia.com.au/contact-us/',
        email: 'contact@aginnovationaustralia.com.au',
      },
      license: {
        name: 'CC-BY-4.0',
        identifier: 'CC-BY-4.0',
      },
    },
    servers: [
      {
        url: `https://emissionscalculator-mtls.production.aiaapi.com/calculator/${packageVersion()}`,
        description: 'Production Server',
      },
    ],
    tags: [
      {
        name: 'GAF',
        description: 'GAF spreadsheet-based calculator',
      },
    ],
    paths,
  });

  return schema;
};
