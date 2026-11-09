import { MeanAnnualTemperatures } from '@/constants/enums';
import { enumInputOptional } from '@/tools/inputs';
import { ManureModules } from '@/tools/modules';
import { object } from '@/types/schemas';
import { z } from 'zod';

export const hasMethod2MeanAnnualTemperatureInputSchema = (
  module: ManureModules,
) =>
  object({
    method2MeanAnnualTemperature: enumInputOptional(MeanAnnualTemperatures, {
      name: 'Mean annual temperature',
      description: `What is the mean annual temperature of the herd's location? See chapter 1.8.2 for more information on temperature zones.`,
      method: '2',
      modules: [module],
    }),
  });
export type HasMethod2MeanAnnualTemperatureInput = z.input<
  ReturnType<typeof hasMethod2MeanAnnualTemperatureInputSchema>
>;
export type HasMethod2MeanAnnualTemperatureInputTransformed = z.output<
  ReturnType<typeof hasMethod2MeanAnnualTemperatureInputSchema>
>;
