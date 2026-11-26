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

import * as z from 'zod';
import {
  createDocument,
  createSchema,
  type oas31,
  ZodOpenApiPathsObject,
} from 'zod-openapi';

// zod-openapi v6 bundles its own OpenAPI types. We generate OpenAPI 3.1 documents.
type OpenAPIObject = oas31.OpenAPIObject;

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
    ? `AIA VEERG Emissions Calculator API - ${titleSuffix}`
    : 'AIA VEERG Emissions Calculator API';

  const outputComponents: SchemaComponents = {};
  const document = createDocument(
    {
      openapi: '3.1.0',
      info: {
        title,
        version,
        description:
          'Emissions Calculators for various farming activities, implementing the VEERG guidance and methodology',
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
          url: `https://emissionscalculator-mtls.production.aiaapi.com/veerg/${version}`,
          description: 'Production Server',
        },
      ],
      tags: [
        {
          name: 'AIA VEERG Emissions Calculators',
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

  return asOpenApi31(document);
};

/** createDocument is typed as the OpenAPI 3.2 superset regardless of the requested version.
 * The document is rendered as 3.1 (driven by the `openapi` field), so narrow the type,
 * guarding against 3.2-only output sneaking in. */
const asOpenApi31 = (
  document: ReturnType<typeof createDocument>,
): OpenAPIObject => {
  if (!document.openapi.startsWith('3.1.')) {
    throw new Error(
      `Expected an OpenAPI 3.1 document, received ${document.openapi}`,
    );
  }
  const usesQuerystring = Object.values(document.paths ?? {}).some(
    (pathItem) =>
      [pathItem, ...Object.values(pathItem)].some(
        (item) =>
          typeof item === 'object' &&
          item !== null &&
          'parameters' in item &&
          Array.isArray(item.parameters) &&
          item.parameters.some(
            (p: unknown) =>
              typeof p === 'object' &&
              p !== null &&
              'in' in p &&
              p.in === 'querystring',
          ),
      ),
  );
  if (usesQuerystring) {
    throw new Error(
      "OpenAPI 3.1 does not support 'querystring' parameters (3.2 only)",
    );
  }
  return document as OpenAPIObject;
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
