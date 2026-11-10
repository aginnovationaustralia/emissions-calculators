import { outputTonnesCO2e } from '@/tools/zod';
import { OUTPUTDESCRIPTIONS } from '@/types/descriptions.schema';
import { z } from 'zod';

/**
 * The keys every calculator's scope 1 output schema declares, regardless of which activity-
 * specific keys it also carries. Calculators extend this via `.safeExtend()` rather than
 * redeclaring these four keys themselves.
 */
export const Scope1TotalsSchema = z.object({
  totalCO2: outputTonnesCO2e(OUTPUTDESCRIPTIONS.scope1TotalCO2),
  totalCH4: outputTonnesCO2e(OUTPUTDESCRIPTIONS.scope1TotalCH4),
  totalN2O: outputTonnesCO2e(OUTPUTDESCRIPTIONS.scope1TotalN2O),
  totalOtherGases: outputTonnesCO2e(OUTPUTDESCRIPTIONS.scope1TotalOtherGases),
  total: outputTonnesCO2e(OUTPUTDESCRIPTIONS.scope1Total),
});

export type Scope1Totals = z.infer<typeof Scope1TotalsSchema>;
