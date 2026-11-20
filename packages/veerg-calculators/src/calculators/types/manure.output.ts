import { Container } from '@/tools/containers';
import { Mass } from '@/tools/units';
import { outputValue } from '@/tools/zod';
import { z } from 'zod';

/**
 * Outputs of a livestock calculator whose manure can be reused (feedlot, dairy, pigs,
 * poultry). Unlike the scope keys these are not gases or emissions: they are quantities the
 * calculation produces that other calculations, or the user, can act on.
 */
export const ManureOutputsSchema = z
  .strictObject({
    massOfNitrogenInManureApplicableToSoilsKilograms: outputValue(
      'Mass of nitrogen in manure applicable to soils, in kg N: the nitrogen left in the manure after its management (the mass of nitrogen applied to soils, MNSoil, before the fraction applied within the activity boundary), which can be applied to soils locally in a mixed operation, sold to another enterprise, or disposed of as waste',
    ),
  })
  .meta({
    description:
      'Quantities produced by the calculation that are not emissions, such as the nitrogen in manure available for reuse',
  });

export type ManureNitrogenOutputs = z.infer<typeof ManureOutputsSchema>;

/** The containers behind `ManureNitrogenOutputs`, as each livestock calculator's `calculateOutputs` returns them */
export type ManureNitrogenOutputContainers = Record<
  keyof ManureNitrogenOutputs,
  Container<Mass<'N'>>
>;
