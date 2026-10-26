import { PoultryClass } from '@/constants/enums';
import { poultryManureModules } from '@/modules/scope1/shared/poultry/modules';
import { isProportion, numberInput, numberInputOptional } from '@/tools/inputs';
import { LivestockLocation, MANURE_POULTRY_4_6 } from '@/tools/modules';
import {
  days,
  head,
  massPerHeadPerDay,
  massPerMass,
  realNumber,
} from '@/tools/units';
import { object } from '@/types/schemas';
import z from 'zod';
import { poultryMMSAllocationInputSchema } from './mms-allocation.input';

const classNumbers = {
  layers: '1',
  meatChickenGrowers: '2a',
  meatChickenBreeders: '2b',
  meatOther: '2c',
} as const;

const createPoultryClassSharedFieldsSchema = (
  className: PoultryClass,
  location: LivestockLocation,
) =>
  object({
    head: numberInput(
      (val) => head(val),
      {
        name: `Nj=${classNumbers[className]}`,
        description: 'Number of animals',
        modules: poultryManureModules(location),
      },
      (s) => s.min(0),
    ),
    days: numberInput(
      (val) => days(val),
      {
        name: `Dj=${classNumbers[className]}`,
        description: 'Duration of this class in the reporting period',
        modules: poultryManureModules(location),
      },
      (s) => s.min(0),
    ),
    method2DryMatterIntake: numberInputOptional(
      (val) => massPerHeadPerDay('DryMatter', val),
      {
        name: `Ij=${classNumbers[className]}`,
        method: '2',
        description: 'Dry matter intake',
        modules: poultryManureModules(location),
      },
      (s) => s.gt(0),
    ),
    method2CrudeProtein: numberInputOptional(
      (val) => massPerMass('CrudeProtein', 'DryMatter', val),
      {
        name: `CPj=${classNumbers[className]}`,
        method: '2',
        description: 'Crude protein content of the diet for this class',
        modules: poultryManureModules(location),
      },
      isProportion,
    ),

    manureAllocations: poultryMMSAllocationInputSchema(location),
  });

const withPoultryClassName = <S extends z.ZodRawShape, P extends PoultryClass>(
  fields: z.ZodObject<S, z.core.$strict>,
  className: P,
) =>
  fields.transform((val) => ({
    ...val,
    classNumber: classNumbers[className],
    className,
  }));

/**
 * Keys of a poultry class read both by poultry manure management (4.6) and the chapter 5
 * nitrogen calculation. Used directly for the fertiliser scenario.
 */
const createPoultryClassSharedInputSchema =
  <P extends PoultryClass>(className: P) =>
  (location: LivestockLocation) =>
    withPoultryClassName(
      createPoultryClassSharedFieldsSchema(className, location),
      className,
    );

/**
 * A poultry class as read by poultry manure management (4.6). Adds the keys that only
 * affect methane.
 */
const createPoultryClassLivestockInputSchema = <P extends PoultryClass>(
  className: P,
) =>
  withPoultryClassName(
    createPoultryClassSharedFieldsSchema(className, 'livestock').extend({
      method2DryMatterDigestibility: numberInputOptional(
        (val) => realNumber(val),
        {
          name: `DMDj=${classNumbers[className]}`,
          method: '2',
          description: 'Dry matter digestibility of the feed for this class',
          modules: [MANURE_POULTRY_4_6],
        },
        isProportion,
      ),
    }),
    className,
  );

export type PoultryClassSharedInput = z.input<
  ReturnType<typeof createPoultryClassSharedInputSchema>
>;

export const poultryLayersSharedInputSchema =
  createPoultryClassSharedInputSchema('layers');
export const poultryMeatChickenGrowersSharedInputSchema =
  createPoultryClassSharedInputSchema('meatChickenGrowers');
export const poultryMeatChickenBreedersSharedInputSchema =
  createPoultryClassSharedInputSchema('meatChickenBreeders');
export const poultryMeatOtherSharedInputSchema =
  createPoultryClassSharedInputSchema('meatOther');

export type PoultryClassLivestockInput = z.input<
  ReturnType<typeof createPoultryClassLivestockInputSchema>
>;

export const PoultryLayersLivestockInputSchema =
  createPoultryClassLivestockInputSchema('layers');
export const PoultryMeatChickenGrowersLivestockInputSchema =
  createPoultryClassLivestockInputSchema('meatChickenGrowers');
export const PoultryMeatChickenBreedersLivestockInputSchema =
  createPoultryClassLivestockInputSchema('meatChickenBreeders');
export const PoultryMeatOtherLivestockInputSchema =
  createPoultryClassLivestockInputSchema('meatOther');

export type PoultryClassSharedInputTransformed =
  | z.output<ReturnType<typeof poultryLayersSharedInputSchema>>
  | z.output<ReturnType<typeof poultryMeatChickenGrowersSharedInputSchema>>
  | z.output<ReturnType<typeof poultryMeatChickenBreedersSharedInputSchema>>
  | z.output<ReturnType<typeof poultryMeatOtherSharedInputSchema>>;

export type PoultryClassLivestockInputTransformed =
  | z.output<typeof PoultryLayersLivestockInputSchema>
  | z.output<typeof PoultryMeatChickenGrowersLivestockInputSchema>
  | z.output<typeof PoultryMeatChickenBreedersLivestockInputSchema>
  | z.output<typeof PoultryMeatOtherLivestockInputSchema>;
