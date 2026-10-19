import { outputTonnesCO2e } from '@/tools/zod';
import { OUTPUTDESCRIPTIONS } from '@/types/descriptions.schema';
import { object } from '@/types/schemas';
import { z } from 'zod';

/**
 * The keys every calculator's scope 3 output schema declares, regardless of which activity-
 * specific keys it also carries. Calculators extend this via `.safeExtend()` rather than
 * redeclaring the total themselves.
 */
export const Scope3TotalsSchema = object({
  total: outputTonnesCO2e(OUTPUTDESCRIPTIONS.scope3Total),
});

export type Scope3Totals = z.infer<typeof Scope3TotalsSchema>;
