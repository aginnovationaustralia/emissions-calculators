import { calculateElectricityScope2And3 } from '@/modules/electricity';
import { calculateScope1FertiliserUse } from '@/modules/scope1FertiliserUse';
import { calculateScope1Fuel } from '@/modules/scope1fuel';
import { calculateScope1ResidueManagement } from '@/modules/scope1ResidueManagement';
import { calculateScope3EmissionsFromFuel } from '@/modules/scope3EmissionsFromFuel';
import { calculateScope3Fertiliser } from '@/modules/scope3PurchasedFertiliser';
import { calculateScope3Herbicide } from '@/modules/scope3PurchasedHerbicidesPesticides';
import { calculateScope3Lime } from '@/modules/scope3PurchasedLime';
import { multiply } from '@/tools/multiply';
import { TypedOrigin } from '@/tools/origins';
import { output } from '@/tools/outputs';
import { addScope1Totals, addScope23Totals } from '@/tools/totals';
import { Mass } from '@/tools/units';
import { GrainsCropTransformed } from '@/types/Grains/crop.input';
import { GrainsInputTransformed } from '@/types/Grains/input';
import { GrainsOutput } from '@/types/Grains/output';
import { ExecutionContext } from '../executionContext';
import { ConstantsForGrainsCalculator } from './constants';

// function getIntensities(
//   netTotal: number,
//   carbonSequestration: number,
//   grainProducedTonnes: number,
// ) {
//   return {
//     grainsExcludingSequestration: divideBySafeFromZero(
//       netTotal + carbonSequestration,
//       grainProducedTonnes,
//     ),
//     grainsIncludingSequestration: divideBySafeFromZero(
//       netTotal,
//       grainProducedTonnes,
//     ),
//     grainProducedTonnes,
//   };
// }

const calculateScope1Grains = (
  crop: GrainsCropTransformed,
  context: ExecutionContext<ConstantsForGrainsCalculator>,
) => {
  // Scope 1

  // 6.1 Transport fuel
  // 6.2 Stationary combustion fuel
  //   fuelCO2, fuelCH4, fuelN2O

  // 6.3 refrigerants
  // new outputs

  // 5.1 Fertiliser use
  // ureaCO2, limeCO2,  fertiliserN2O, atmosphericDepositionN2O,leachingAndRunoffN2O

  // 5.2 residue management
  // cropResidueN2O, fieldBurningN2O, fieldBurningCH4

  const { fuelCO2, fuelCH4, fuelN2O } = calculateScope1Fuel(crop, context);
  const {
    ureaCO2,
    limeCO2,
    fertiliserN2O,
    atmosphericDepositionN2O,
    leachingAndRunoffN2O,
  } = calculateScope1FertiliserUse(crop, context);
  const { cropResidueN2O, fieldBurningN2O, fieldBurningCH4 } =
    calculateScope1ResidueManagement(crop, context);

  return {
    fuelCO2,
    fuelCH4,
    fuelN2O,
    ureaCO2,
    limeCO2,
    fertiliserN2O,
    atmosphericDepositionN2O,
    leachingAndRunoffN2O,
    cropResidueN2O,
    fieldBurningN2O,
    fieldBurningCH4,
  };
};

const calculateScope2Grains = (
  crop: GrainsCropTransformed,
  totalElectricity: TypedOrigin<Mass<'CO2e'>>,
) => {
  // Scope 2
  // 7.1 -electricity scope 2 and 3
  // electricity (s2), electricity (s3)
  const allocatedElectricity = multiply(
    totalElectricity,
    crop.electricityAllocation,
  );
  return {
    electricity: output('electricity', 2, allocatedElectricity),
  };
};

const calculateScope3Grains = (
  crop: GrainsCropTransformed,
  totalElectricity: TypedOrigin<Mass<'CO2e'>>,
  context: ExecutionContext<ConstantsForGrainsCalculator>,
) => {
  // Scope 2
  // 7.1 -electricity scope 2 and 3
  // electricity (s2), electricity (s3)

  // Scope 3

  // 7.5 Purchased fertiliser
  // fertiliser

  // 7.6 Purchased herbicides / pesticides
  // herbicide

  // 7.7 Purchased lime
  // lime

  // 7.8 well to tank emissions from fuel
  // fuel

  // 7.10 management of waste
  // new outputs
  const { fertiliser } = calculateScope3Fertiliser(crop, context);
  const { herbicide } = calculateScope3Herbicide(crop, context);
  const { fuel } = calculateScope3EmissionsFromFuel(crop, context);
  const { lime } = calculateScope3Lime(crop, context);

  return {
    electricity: output(
      'electricity',
      3,
      multiply(totalElectricity, crop.electricityAllocation),
    ),
    fertiliser,
    herbicide,
    fuel,
    lime,
  };
};

export function calculateGrains(
  input: GrainsInputTransformed,
  context: ExecutionContext<ConstantsForGrainsCalculator>,
): GrainsOutput {
  // tranche 1 modules for grains

  const electricity = calculateElectricityScope2And3(input, context);

  const cropResults = input.crops.map((crop, ix) => {
    return {
      scope1: calculateScope1Grains(crop, context),
      scope2: calculateScope2Grains(crop, electricity.scope2),
      scope3: calculateScope3Grains(crop, electricity.scope3, context),
      meta: {
        id: crop.id || 'crop' + ix.toString(),
      },
    };
  });

  // Carbon sequestration is covered by LULUCF guidance

  return {
    // scope1: total.output.scope1,
    // scope2: total.output.scope2,
    // scope3: total.output.scope3,
    intermediate: cropResults.map((crop) => {
      const scope1 = addScope1Totals(crop.scope1);
      const scope2 = addScope23Totals(crop.scope2);
      const scope3 = addScope23Totals(crop.scope3);
      const net = {
        total: {
          value: scope1.total.value + scope2.total.value + scope3.total.value,
        },
      };
      return {
        id: crop.meta.id,
        scope1,
        scope2,
        scope3,
        net,
        // net: crop.net,
      };
    }),
    // intensities: allCrops.map((crop) =>
    //   divideBySafeFromZero(crop.net.total, crop.extensions.amountProduced),
    // ),
    // intensitiesWithSequestration: allCrops.map((crop) =>
    //   getIntensities(
    //     crop.net.total,
    //     crop.extensions.carbonSequestration,
    //     crop.extensions.amountProduced,
    //   ),
    // ),
    // net: {
    //   total:
    //     total.output.scope1.total +
    //     total.output.scope2.total +
    //     total.output.scope3.total -
    //     carbonSequestration.total,
    //   crops: allCrops.map((crop) => crop.net.total),
    // },
  };
}
