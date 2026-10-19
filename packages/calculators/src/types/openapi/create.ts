import {
  BeefInputSchema,
  CottonInputSchema,
  CroppingInputSchema,
  DairyInputSchema,
  FeedlotInputSchema,
  HorticultureInputSchema,
  OtherLivestockInputSchema,
  PigsInputSchema,
  PoultryInputSchema,
  RiceInputSchema,
  SheepInputSchema,
  SugarInputSchema,
  ViticultureInputSchema,
} from '@/browser';
import {
  AllModulesInputSchema,
  AllModulesOutputSchema,
} from '@/calculators/AllModules/types';
import { AquacultureInputSchema } from '@/calculators/Aquaculture/types/input';
import { AquacultureOutputSchema } from '@/calculators/Aquaculture/types/output';
import { BeefOutputSchema } from '@/calculators/Beef/types/output';
import {
  entriesFromObject,
  ObjectEntry,
  objectFromEntries,
} from '@/calculators/common/tools/object';
import { CottonOutputSchema } from '@/calculators/Cotton/types/output';
import { CroppingOutputSchema } from '@/calculators/Cropping/types/output';
import { DairyOutputSchema } from '@/calculators/Dairy/types/output';
import { packageVersion } from '@/calculators/execution/version';
import { FeedlotOutputSchema } from '@/calculators/Feedlot/types/output';
import { ForestryInputSchema } from '@/calculators/Forestry/types/input';
import { ForestryOutputSchema } from '@/calculators/Forestry/types/output';
import {
  GrainsInputSchema,
  GrainsOutputSchema,
} from '@/calculators/Grains/types';
import { HorticultureOutputSchema } from '@/calculators/Horticulture/types/output';
import { OtherLivestockOutputSchema } from '@/calculators/OtherLivestock/types/output';
import { PigsOutputSchema } from '@/calculators/Pigs/types/output';
import { PostProductionInputSchema } from '@/calculators/PostProduction/types/input';
import { PostProductionOutputSchema } from '@/calculators/PostProduction/types/output';
import { PoultryOutputSchema } from '@/calculators/Poultry/types/output';
import { RiceOutputSchema } from '@/calculators/Rice/types/output';
import { SheepOutputSchema } from '@/calculators/Sheep/types/output';
import { CalculatorNames } from '@/calculators/strings';
import { SugarOutputSchema } from '@/calculators/Sugar/types/output';
import { ViticultureOutputSchema } from '@/calculators/Viticulture/types/output';
import { WildCatchFisheriesInputSchema } from '@/calculators/WildCatchFisheries/types/input';
import { WildCatchFisheriesOutputSchema } from '@/calculators/WildCatchFisheries/types/output';
import { FullCAMInputsSchema } from '@/fullcam/input';
import { LULUCFInputSchema } from '@/modules';

import { OpenAPIObject } from 'openapi3-ts/oas31';
import * as z from 'zod';
import {
  createDocument,
  createSchema,
  ZodOpenApiPathsObject,
} from 'zod-openapi';

type Endpoint = {
  inputSchema: z.ZodType;
  outputSchema: z.ZodType;
  /** Render the response in 'input' mode, for endpoints that return data shaped as calculator input */
  outputIO?: 'input' | 'output';
};

const endpoints: Record<CalculatorNames | 'fullcam', Endpoint> = {
  'all-modules': {
    inputSchema: AllModulesInputSchema,
    outputSchema: AllModulesOutputSchema,
  },
  aquaculture: {
    inputSchema: AquacultureInputSchema,
    outputSchema: AquacultureOutputSchema,
  },
  beef: {
    inputSchema: BeefInputSchema,
    outputSchema: BeefOutputSchema,
  },
  cotton: {
    inputSchema: CottonInputSchema,
    outputSchema: CottonOutputSchema,
  },
  cropping: {
    inputSchema: CroppingInputSchema,
    outputSchema: CroppingOutputSchema,
  },
  dairy: {
    inputSchema: DairyInputSchema,
    outputSchema: DairyOutputSchema,
  },
  feedlot: {
    inputSchema: FeedlotInputSchema,
    outputSchema: FeedlotOutputSchema,
  },
  forestry: {
    inputSchema: ForestryInputSchema,
    outputSchema: ForestryOutputSchema,
  },
  fullcam: {
    inputSchema: FullCAMInputsSchema,
    outputSchema: LULUCFInputSchema,
    outputIO: 'input',
  },
  grains: {
    inputSchema: GrainsInputSchema,
    outputSchema: GrainsOutputSchema,
  },
  horticulture: {
    inputSchema: HorticultureInputSchema,
    outputSchema: HorticultureOutputSchema,
  },
  'other-livestock': {
    inputSchema: OtherLivestockInputSchema,
    outputSchema: OtherLivestockOutputSchema,
  },
  pigs: {
    inputSchema: PigsInputSchema,
    outputSchema: PigsOutputSchema,
  },
  'post-production': {
    inputSchema: PostProductionInputSchema,
    outputSchema: PostProductionOutputSchema,
  },
  poultry: {
    inputSchema: PoultryInputSchema,
    outputSchema: PoultryOutputSchema,
  },
  rice: {
    inputSchema: RiceInputSchema,
    outputSchema: RiceOutputSchema,
  },
  sheep: {
    inputSchema: SheepInputSchema,
    outputSchema: SheepOutputSchema,
  },
  sugar: {
    inputSchema: SugarInputSchema,
    outputSchema: SugarOutputSchema,
  },
  viticulture: {
    inputSchema: ViticultureInputSchema,
    outputSchema: ViticultureOutputSchema,
  },
  'wild-catch-fisheries': {
    inputSchema: WildCatchFisheriesInputSchema,
    outputSchema: WildCatchFisheriesOutputSchema,
  },
};

const deprecatedPaths = ['wildseafisheries'];

type EndpointEntry = ObjectEntry<typeof endpoints>;

type SchemaComponents = ReturnType<typeof createSchema>['components'];

const createPaths = (
  selected: EndpointEntry[],
  outputComponents: SchemaComponents,
): ZodOpenApiPathsObject =>
  objectFromEntries(
    selected.map(([name, endpoint]): ObjectEntry<ZodOpenApiPathsObject> => [
      // NOTE: This API uses the CalculatorNames enum as the API paths for each calculator
      `/${name}`,
      {
        post: {
          summary: `Perform ${name} calculation`,
          description: 'Retrieve a simple JSON response',
          operationId: `post-${name}`,
          deprecated: deprecatedPaths.includes(name),
          requestBody: {
            required: true,
            content: {
              'application/json': {
                // Pass Zod schemas directly so zod-openapi can emit $ref components
                schema: endpoint.inputSchema,
              },
            },
          },
          responses: {
            200: {
              description: 'Executes a calculation',
              content: {
                'application/json': {
                  schema: createOutputSchema(endpoint, outputComponents),
                },
              },
            },
            401: {
              description: 'Unauthorized',
            },
          },
          tags: ['emissions-calculators'],
        },
      },
    ]),
  );

// zod-openapi always renders response schemas in 'output' mode, which fails on transforms,
// so 'input' mode responses are rendered separately and their components merged in afterwards
const createOutputSchema = (
  endpoint: Endpoint,
  outputComponents: SchemaComponents,
) => {
  if (endpoint.outputIO !== 'input') {
    return endpoint.outputSchema;
  }

  const { schema, components } = createSchema(endpoint.outputSchema, {
    io: 'input',
  });
  Object.assign(outputComponents, components);
  return schema;
};

const createOpenApiDocument = (
  selected: EndpointEntry[],
  version: string,
  titleSuffix?: string,
): OpenAPIObject => {
  const title = titleSuffix
    ? `AIA Calculator API - ${titleSuffix}`
    : 'AIA Calculator API';

  const outputComponents: SchemaComponents = {};
  const document = createDocument(
    {
      openapi: '3.1.0',
      info: {
        title,
        version,
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
          url: `https://emissionscalculator-mtls.production.aiaapi.com/calculator/${version}`,
          description: 'Production Server',
        },
      ],
      tags: [
        {
          name: 'AIA emissions calculators',
          description: title,
        },
      ],
      paths: createPaths(selected, outputComponents),
    },
    {
      // reused: 'ref', // Enable to trigger all schema references to be pulled out as components with generic names
    },
  );

  if (Object.keys(outputComponents).length > 0) {
    document.components = {
      ...document.components,
      schemas: { ...outputComponents, ...document.components?.schemas },
    };
  }

  return document;
};

export type OpenApiSchemaBundle = {
  /** Combined OpenAPI document covering every calculator endpoint. */
  combined: OpenAPIObject;
  /** Per-calculator documents, each with only that calculator's paths and components. */
  calculators: Record<string, OpenAPIObject>;
};

/** Build the combined OpenAPI document and a single optimised document per calculator.
 * NOTE: We don't want external users to be able to specify the version of the API to create the schema for. This is just for the local script.
 * @param version - The version of the API to create the schema for.
 * @returns A bundle of the combined OpenAPI document and a single optimised document per calculator.
 */
export const createOpenApiSchemaBundleInternal = (
  version: string,
): OpenApiSchemaBundle => {
  const allEntries = entriesFromObject(endpoints);

  const calculators = objectFromEntries(
    allEntries.map((entry) => {
      const [name] = entry;
      return [
        name,
        createOpenApiDocument([entry], version, name),
      ] as ObjectEntry<Record<string, OpenAPIObject>>;
    }),
  );

  return {
    combined: createOpenApiDocument(allEntries, version),
    calculators,
  };
};

export const createOpenApiSchemaBundle = (): OpenApiSchemaBundle => {
  const version = packageVersion();
  return createOpenApiSchemaBundleInternal(version);
};

/** Combined OpenAPI document covering every calculator endpoint. */
export const createOpenApiSchemaFile = (): OpenAPIObject =>
  createOpenApiSchemaBundle().combined;
