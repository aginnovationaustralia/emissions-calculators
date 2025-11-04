import * as z from 'zod';
import { createSchema } from 'zod-openapi';
import {
  AquacultureOutputSchema,
  BeefInputSchema,
  BeefOutputSchema,
  BuffaloInputSchema,
  BuffaloOutputSchema,
  CottonInputSchema,
  CottonOutputSchema,
  DairyInputSchema,
  DairyOutputSchema,
  DeerInputSchema,
  DeerOutputSchema,
  FeedlotInputSchema,
  FeedlotOutputSchema,
  GoatInputSchema,
  GoatOutputSchema,
  GrainsInputSchema,
  GrainsOutputSchema,
  HorticultureInputSchema,
  HorticultureOutputSchema,
  PorkInputSchema,
  PorkOutputSchema,
  PoultryInputSchema,
  PoultryOutputSchema,
  ProcessingInputSchema,
  ProcessingOutputSchema,
  RiceInputSchema,
  RiceOutputSchema,
  SheepBeefInputSchema,
  SheepBeefOutputSchema,
  SheepInputSchema,
  SheepOutputSchema,
  SugarInputSchema,
  SugarOutputSchema,
  VineyardInputSchema,
  VineyardOutputSchema,
  WildCatchFisheryInputSchema,
  WildCatchFisheryOutputSchema,
  WildSeaFisheriesInputSchema,
  WildSeaFisheriesOutputSchema,
} from '.';
import { CalculatorNames } from '../strings';
import { AquacultureInputSchema } from './Aquaculture/input';

type Endpoint<
  TI extends z.core.$ZodLooseShape,
  TO extends z.core.$ZodLooseShape,
> = {
  name: CalculatorNames;
  inputSchema: z.ZodObject<TI>;
  outputSchema: z.ZodObject<TO>;
};

const endpoints: Endpoint<z.core.$ZodLooseShape, z.core.$ZodLooseShape>[] = [
  {
    name: CalculatorNames.Aquaculture,
    inputSchema: AquacultureInputSchema,
    outputSchema: AquacultureOutputSchema,
  },
  {
    name: CalculatorNames.Beef,
    inputSchema: BeefInputSchema,
    outputSchema: BeefOutputSchema,
  },
  {
    name: CalculatorNames.Buffalo,
    inputSchema: BuffaloInputSchema,
    outputSchema: BuffaloOutputSchema,
  },
  {
    name: CalculatorNames.Cotton,
    inputSchema: CottonInputSchema,
    outputSchema: CottonOutputSchema,
  },
  {
    name: CalculatorNames.Dairy,
    inputSchema: DairyInputSchema,
    outputSchema: DairyOutputSchema,
  },
  {
    name: CalculatorNames.Deer,
    inputSchema: DeerInputSchema,
    outputSchema: DeerOutputSchema,
  },
  {
    name: CalculatorNames.Feedlot,
    inputSchema: FeedlotInputSchema,
    outputSchema: FeedlotOutputSchema,
  },
  {
    name: CalculatorNames.Goat,
    inputSchema: GoatInputSchema,
    outputSchema: GoatOutputSchema,
  },
  {
    name: CalculatorNames.Grains,
    inputSchema: GrainsInputSchema,
    outputSchema: GrainsOutputSchema,
  },
  {
    name: CalculatorNames.Horticulture,
    inputSchema: HorticultureInputSchema,
    outputSchema: HorticultureOutputSchema,
  },
  {
    name: CalculatorNames.Rice,
    inputSchema: RiceInputSchema,
    outputSchema: RiceOutputSchema,
  },
  {
    name: CalculatorNames.Processing,
    inputSchema: ProcessingInputSchema,
    outputSchema: ProcessingOutputSchema,
  },
  {
    name: CalculatorNames.Pork,
    inputSchema: PorkInputSchema,
    outputSchema: PorkOutputSchema,
  },
  {
    name: CalculatorNames.Poultry,
    inputSchema: PoultryInputSchema,
    outputSchema: PoultryOutputSchema,
  },
  {
    name: CalculatorNames.Sheep,
    inputSchema: SheepInputSchema,
    outputSchema: SheepOutputSchema,
  },
  {
    name: CalculatorNames.SheepBeef,
    inputSchema: SheepBeefInputSchema,
    outputSchema: SheepBeefOutputSchema,
  },
  {
    name: CalculatorNames.Sugar,
    inputSchema: SugarInputSchema,
    outputSchema: SugarOutputSchema,
  },
  {
    name: CalculatorNames.Vineyard,
    inputSchema: VineyardInputSchema,
    outputSchema: VineyardOutputSchema,
  },
  {
    name: CalculatorNames.WildCatchFishery,
    inputSchema: WildCatchFisheryInputSchema,
    outputSchema: WildCatchFisheryOutputSchema,
  },
  {
    name: CalculatorNames.WildSeaFisheries,
    inputSchema: WildSeaFisheriesInputSchema,
    outputSchema: WildSeaFisheriesOutputSchema,
  },
];

/* NOTE: The zod meta tag content is collected in a global registry object that is not accessible outside the library boundary at runtime.
 * This is why we need to create the schemas manually here.
 */
export const openapiSchemas = () =>
  endpoints.map((endpoint) => ({
    name: endpoint.name,
    inputSchema: createSchema(endpoint.inputSchema).schema,
    outputSchema: createSchema(endpoint.outputSchema).schema,
  }));
