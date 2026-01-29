import { FertiliserInputSchema } from '@/modules/scope1FertiliserUse/fertiliser.input';
import { FuelInputSchema } from '@/modules/scope1fuel/fuel.input';
import { CropResidueInputSchema } from '@/modules/scope1ResidueManagement/crop-residue.input';
import { input } from '@/tools/inputs';
import { realNumber } from '@/tools/units';
import { ProductionSystems, States } from '@/types/enums';
import Decimal from 'decimal.js-light';
import { z } from 'zod';
import { DESCRIPTIONS } from '../descriptions.schema';
import { proportion, singleEnterpriseInput } from '../schemas';

export const GrainsCropSchema = singleEnterpriseInput('Grains', {
  state: z.enum(States).meta({ description: DESCRIPTIONS.STATE }),
  productionSystem: z.enum(ProductionSystems).meta({
    description:
      "Production system of this crop. Note that the following production systems are now deprecated, the relevant full calculator should be used instead: 'Cotton', 'Rice', 'Sugar cane'",
  }),
  nonUreaNitrogen: z.number().min(0).meta({
    description:
      'Non-urea nitrogen application, in kg N/ha (kilograms of nitrogen per hectare)',
  }),
  ureaAmmoniumNitrate: z.number().min(0).meta({
    description:
      'Urea-Ammonium nitrate application, in kg product/ha (kilograms of product per hectare)',
  }),
  phosphorusApplication: z.number().min(0).meta({
    description:
      'Phosphorus application, in kg P/ha (kilograms of phosphorus per hectare)',
  }),
  potassiumApplication: z.number().min(0).meta({
    description:
      'Potassium application, in kg K/ha (kilograms of potassium per hectare)',
  }),
  sulfurApplication: z.number().min(0).meta({
    description:
      'Sulfur application, in kg S/ha (kilograms of sulfur per hectare)',
  }),
  fractionOfAnnualCropBurnt: proportion(
    'Fraction of annual production of crop that is burnt, from 0 to 1',
  ),
  herbicideUse: z.number().min(0).meta({
    description:
      'Total amount of active ingredients from general herbicide/pesticide use, in kg (kilogram)',
  }),
  glyphosateOtherHerbicideUse: z.number().min(0).meta({
    description:
      'Total amount of active ingredients from other herbicide use (Paraquat, Diquat, Glyphosate), in kg (kilogram)',
  }),
  electricityAllocation: proportion(
    'Percentage of electricity use to allocate to this crop, from 0 to 1',
  ).transform((val) =>
    input('electricityAllocation', realNumber(new Decimal(val))),
  ),
  limestone: z.number().min(0).meta({ description: DESCRIPTIONS.LIMESTONE }),
  limestoneFraction: proportion(DESCRIPTIONS.LIMESTONEFRACTION),
  ...CropResidueInputSchema.shape,
  ...FuelInputSchema.shape,
  ...FertiliserInputSchema.shape,
});

export type GrainsCrop = z.input<typeof GrainsCropSchema>;
export type GrainsCropTransformed = z.output<typeof GrainsCropSchema>;
