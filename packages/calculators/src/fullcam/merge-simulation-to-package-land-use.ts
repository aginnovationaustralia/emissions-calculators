import { LandUseChangeActivityInput } from '@/modules/lulucf';
import {
  FarmForestryInput,
  HumanInducedNationalRegenerationInput,
  LandClearingForestToCroplandInput,
  LandClearingForestToGrasslandInput,
  LandClearingForestToSettlementsInput,
} from '@/modules/lulucf/land-use-change-activity-input';
import { nv } from '@/tools/inputs';
import { FullCAMResults, isAreaClearable } from './input';
import type {
  FullCAMOutputKeyFields,
  InputAreaWithOutputKeyFields,
} from './types';

const carbonMassFields = (keyFields: FullCAMOutputKeyFields) => ({
  carbonMassInDebrisCurrentYear: nv(keyFields.carbonMassInDebrisPerHectare),
  carbonMassInDebrisPreviousYear: nv(
    keyFields.carbonMassInDebrisPerHectarePrevYear,
  ),
  carbonMassInTreesCurrentYear: nv(keyFields.carbonMassInTreesPerHectare),
  carbonMassInTreesPreviousYear: nv(
    keyFields.carbonMassInTreesPerHectarePrevYear,
  ),
});
/**
 * Maps FullCAM simulation output into the emissions package `landUse` shape. The key values that can be extracted from the
 * FullCAM simulation results are inserted into a representative 'token' activity of the right type, for the calculator to consume and inject into the
 * appropriate chapters of the guidelines.
 */
export function generateLulucfInput(
  pairs: InputAreaWithOutputKeyFields[],
): FullCAMResults {
  // Create activities that can receive the interesting values extracted from a simulation output
  const activities: LandUseChangeActivityInput[] = pairs.flatMap(
    ({ area, keyFields }) => {
      const { input } = area;

      const baseActivities: LandUseChangeActivityInput[] = [];
      if (isAreaClearable(input)) {
        const { clearingEvent } = input;

        if (clearingEvent) {
          // This is a special case if harvesting occurred, we need a special activity instance to accept it
          if (clearingEvent.percentMassRecoveredAsProducts) {
            const farmForestryEvent: FarmForestryInput = {
              type: 'farmForestry',
              activityAreaHectares: nv(input.areaHectares),
              carbonMassInDebrisCurrentYear: nv(0),
              carbonMassInDebrisPreviousYear: nv(0),
              carbonMassInTreesCurrentYear: nv(0),
              carbonMassInTreesPreviousYear: nv(0),
              carbonMassOfWoodProducts: {
                carbonMassPerHectareFromFullCAM: nv(
                  keyFields.carbonMassInForestProductsPerHectare,
                ),
                calculationMethod: '1',
              },
            };

            baseActivities.push(farmForestryEvent);
          }

          if (clearingEvent.useAfterClearing === 'crops') {
            const clearedToCrops: LandClearingForestToCroplandInput = {
              type: 'landClearingForestToCropland',
              ...carbonMassFields(keyFields),
              activityAreaHectares: nv(input.areaHectares),
              areaBurnt: nv(input.areaHectares),
              cropProductionSystem: clearingEvent.cropProductionSystem,
              isInLeachingZone: input.isInLeachingZone,
              massCH4FromBiomassBurningPerHectare: nv(
                keyFields.ch4FromBiomassBurningPerHectare,
              ),
              massN2OFromBiomassBurningPerHectare: nv(
                keyFields.n2oFromBiomassBurningPerHectare,
              ),
              region: input.region,
            };

            baseActivities.push(clearedToCrops);
          } else if (clearingEvent.useAfterClearing === 'pasture') {
            const clearedToPasture: LandClearingForestToGrasslandInput = {
              type: 'landClearingForestToGrassland',
              ...carbonMassFields(keyFields),
              activityAreaHectares: nv(input.areaHectares),
              areaBurnt: nv(input.areaHectares),
              pastureProductionSystem: clearingEvent.pastureProductionSystem,
              isInLeachingZone: input.isInLeachingZone,
              massCH4FromBiomassBurningPerHectare: nv(
                keyFields.ch4FromBiomassBurningPerHectare,
              ),
              massN2OFromBiomassBurningPerHectare: nv(
                keyFields.n2oFromBiomassBurningPerHectare,
              ),
              region: input.region,
            };

            baseActivities.push(clearedToPasture);
          } else {
            const clearedToSettlement: LandClearingForestToSettlementsInput = {
              type: 'landClearingForestToSettlements',
              ...carbonMassFields(keyFields),
              activityAreaHectares: nv(input.areaHectares),
              areaBurnt: nv(input.areaHectares),
              pastureProductionSystem: 'Non-irrigated pasture',
              isInLeachingZone: input.isInLeachingZone,
              massCH4FromBiomassBurningPerHectare: nv(
                keyFields.ch4FromBiomassBurningPerHectare,
              ),
              massN2OFromBiomassBurningPerHectare: nv(
                keyFields.n2oFromBiomassBurningPerHectare,
              ),
              region: input.region,
            };

            baseActivities.push(clearedToSettlement);
          }
        } else {
          // No clearing took place
          const regenEvent: HumanInducedNationalRegenerationInput = {
            type: 'humanInducedNaturalRegeneration',
            activityAreaHectares: nv(input.areaHectares),
            ...carbonMassFields(keyFields),
          };

          baseActivities.push(regenEvent);
        }
      } else {
        // Area has no initial trees
        const regenEvent: HumanInducedNationalRegenerationInput = {
          type: 'humanInducedNaturalRegeneration',
          activityAreaHectares: nv(input.areaHectares),
          ...carbonMassFields(keyFields),
        };

        baseActivities.push(regenEvent);
      }

      return baseActivities;
    },
  );

  const result: FullCAMResults = {
    activities,
  };

  return result;
}
