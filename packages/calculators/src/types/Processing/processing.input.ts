import { ElectricitySources } from '@/types/types';
import { z } from 'zod';
import { FluidWasteInputSchema } from '../common/fluid-waste.input';
import { SolidWasteInputSchema } from '../common/solid-waste.input';
import { DESCRIPTIONS } from '../descriptions.schema';
import { FuelInputSchema } from '../fuel.input';
import { RefrigerantInputSchema } from '../refrigerant.input';
import { proportion } from '../schemas';
import { ProcessingProductSchema } from './product.input';

export const ProductProcessingInputSchema = z
  .object({
    id: z.string().optional().meta({ description: DESCRIPTIONS.ACTIVITY_ID }),
    product: ProcessingProductSchema.meta({
      description: DESCRIPTIONS.PROCESSING_PRODUCT,
    }),
    electricityRenewable: proportion(DESCRIPTIONS.ELECTRICITY_RENEWABLE),
    electricityUse: z
      .number()
      .meta({ description: DESCRIPTIONS.ELECTRICITY_USE }),
    electricitySource: z
      .enum(ElectricitySources)
      .meta({ description: DESCRIPTIONS.ELECTRICITY_SOURCE }),
    fuel: FuelInputSchema.meta({ description: DESCRIPTIONS.FUEL }),
    refrigerants: z
      .array(RefrigerantInputSchema)
      .meta({ description: DESCRIPTIONS.REFRIGERANT }),
    fluidWaste: z
      .array(FluidWasteInputSchema)
      .meta({ description: DESCRIPTIONS.FLUID_WASTE }),
    solidWaste: SolidWasteInputSchema.meta({
      description: DESCRIPTIONS.SOLID_WASTE,
    }),
    purchasedCO2: z.number().meta({ description: DESCRIPTIONS.PURCHASED_CO2 }),
    carbonOffsets: z
      .number()
      .optional()
      .meta({ description: DESCRIPTIONS.CARBON_OFFSETS }),
  })
  .meta({
    description: 'Input data required for processing a specific product',
  });

export type ProductProcessingInput = z.infer<
  typeof ProductProcessingInputSchema
>;
