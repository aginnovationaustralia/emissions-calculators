import { PigsClass } from '@/constants/enums';
import {
  pigsEntericAndManureModules,
  pigsManureModules,
} from '@/modules/scope1/shared/pigs/modules';
import { numberInput, numberInputOptional } from '@/tools/inputs';
import {
  ENTERIC_PIGS_3_5,
  LivestockLocation,
  MANURE_PIGS_4_5,
} from '@/tools/modules';
import { days, head, massPerHeadPerDay } from '@/tools/units';
import { object } from '@/types/schemas';
import { z } from 'zod';
import {
  PigsClassManureAllocationLivestockInputSchema,
  pigsClassManureAllocationSharedInputSchema,
} from './manure-allocations.input';

type PigsClassNumber = '1' | '2' | '3' | '4';

/**
 * Keys of a pigs class read both by the livestock modules (3.5, 4.5) and the chapter 5
 * nitrogen calculation. `manureAllocations` is left out because the livestock scenario
 * reads more of it, so each scenario adds its own.
 */
const pigsClassSharedShape = (
  number: PigsClassNumber,
  location: LivestockLocation,
) => ({
  head: numberInput(
    (val) => head(val),
    {
      name: `Nj=${number}`,
      description: 'Number of animals in this class',
      modules: pigsEntericAndManureModules(location),
    },
    (s) => s.min(0),
  ),
  days: numberInput(
    (val) => days(val),
    {
      name: `Dj=${number}`,
      description: 'Average duration on farm for this class',
      modules: pigsEntericAndManureModules(location),
    },
    (s) => s.min(0),
  ),
  method2NitrogenWasteProductionRate: numberInputOptional(
    (val) => massPerHeadPerDay('N', val),
    {
      name: `NWj=${number}`,
      method: '2',
      description:
        'Method 2: Average nitrogen waste production, including both animal and feed waste. PigBal may be used to calculate this value.',
      modules: pigsManureModules(location),
    },
    (s) => s.min(0),
  ),
});

const withPigsClassName = <
  S extends z.ZodRawShape,
  N extends PigsClass,
  J extends PigsClassNumber,
>(
  fields: z.ZodObject<S, z.core.$strict>,
  name: N,
  number: J,
) => fields.transform((val) => ({ ...val, name, number }));

/**
 * A pigs class as read by both the livestock modules (3.5, 4.5) and the chapter 5
 * nitrogen calculation. Used directly for the fertiliser scenario.
 */
const createPigsClassSharedInputSchema =
  <N extends PigsClass, J extends PigsClassNumber>(name: N, number: J) =>
  (location: LivestockLocation) =>
    withPigsClassName(
      object({
        ...pigsClassSharedShape(number, location),
        manureAllocations: pigsClassManureAllocationSharedInputSchema(location),
      }),
      name,
      number,
    );

/**
 * A pigs class as read by pigs enteric methane (3.5) and manure management (4.5). Adds
 * the keys that only affect methane.
 */
const createPigsClassLivestockInputSchema = <
  N extends PigsClass,
  J extends PigsClassNumber,
>(
  name: N,
  number: J,
) =>
  withPigsClassName(
    object({
      ...pigsClassSharedShape(number, 'livestock'),
      method2AverageFeedIntake: numberInputOptional(
        (val) => massPerHeadPerDay('DryMatter', val),
        {
          name: `Ij=${number}`,
          method: '2',
          description: 'Average feed intake for this class',
          modules: [ENTERIC_PIGS_3_5],
        },
        (s) => s.min(0),
      ),
      method2VolatileSolidProductionRate: numberInputOptional(
        (val) => massPerHeadPerDay('Volatile Solids', val),
        {
          name: `VSj=${number}`,
          method: '2',
          description:
            'Method 2: Volatile solid production, including both animal and feed waste. PigBal may be used to calculate this value.',
          modules: [MANURE_PIGS_4_5],
        },
        (s) => s.min(0),
      ),
      manureAllocations: PigsClassManureAllocationLivestockInputSchema,
    }),
    name,
    number,
  );
export type PigsClassSharedInput = z.input<
  ReturnType<typeof createPigsClassSharedInputSchema>
>;
export const pigsBoarsSharedInputSchema = createPigsClassSharedInputSchema(
  'boars',
  '1',
);
export const pigsSowsSharedInputSchema = createPigsClassSharedInputSchema(
  'sows',
  '2',
);
export const pigsGiltsSharedInputSchema = createPigsClassSharedInputSchema(
  'gilts',
  '3',
);
export const pigsSlaughterPigsSharedInputSchema =
  createPigsClassSharedInputSchema('slaughterPigs', '4');

export const PigsBoarsLivestockInputSchema =
  createPigsClassLivestockInputSchema('boars', '1');
export const PigsSowsLivestockInputSchema = createPigsClassLivestockInputSchema(
  'sows',
  '2',
);
export const PigsGiltsLivestockInputSchema =
  createPigsClassLivestockInputSchema('gilts', '3');
export const PigsSlaughterPigsLivestockInputSchema =
  createPigsClassLivestockInputSchema('slaughterPigs', '4');

export type PigsClassSharedInputTransformed =
  | z.output<ReturnType<typeof pigsBoarsSharedInputSchema>>
  | z.output<ReturnType<typeof pigsSowsSharedInputSchema>>
  | z.output<ReturnType<typeof pigsGiltsSharedInputSchema>>
  | z.output<ReturnType<typeof pigsSlaughterPigsSharedInputSchema>>;

export type PigsClassLivestockInput = z.input<
  ReturnType<typeof createPigsClassLivestockInputSchema>
>;
export type PigsClassLivestockInputTransformed =
  | z.output<typeof PigsBoarsLivestockInputSchema>
  | z.output<typeof PigsSowsLivestockInputSchema>
  | z.output<typeof PigsGiltsLivestockInputSchema>
  | z.output<typeof PigsSlaughterPigsLivestockInputSchema>;
