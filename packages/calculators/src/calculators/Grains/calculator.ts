import { calculateScope1FertiliserUse } from '@/modules/scope1FertiliserUse';
import { calculateScope1Fuel } from '@/modules/scope1fuel';
import { calculateScope1ResidueManagement } from '@/modules/scope1ResidueManagement';
import { calculateElectricityScope2 } from '@/modules/scope2Electricity';
import { calculateElectricityScope3 } from '@/modules/scope3Electricity';
import { calculateScope3EmissionsFromFuel } from '@/modules/scope3EmissionsFromFuel';
import { calculateScope3Fertiliser } from '@/modules/scope3PurchasedFertiliser';
import { calculateScope3Herbicide } from '@/modules/scope3PurchasedHerbicidesPesticides';
import { calculateScope3Lime } from '@/modules/scope3PurchasedLime';
import { TypedContainer } from '@/tools/origins';
import { output, scope1Output } from '@/tools/outputs';
import { sum } from '@/tools/sum';
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
  // 6.3 refrigerants
  // new outputs

  // 6.1 Transport fuel
  // 6.2 Stationary combustion fuel
  //   fuelCO2, fuelCH4, fuelN2O
  const { fuelCO2, fuelCH4, fuelN2O } = calculateScope1Fuel(crop, context);

  // 5.1 Fertiliser use
  // ureaCO2, limeCO2,  fertiliserN2O, atmosphericDepositionN2O,leachingAndRunoffN2O
  const {
    ureaCO2,
    limeCO2,
    fertiliserN2O,
    atmosphericDepositionN2O,
    leachingAndRunoffN2O,
  } = calculateScope1FertiliserUse(crop, context);

  // 5.2 residue management
  // cropResidueN2O, fieldBurningN2O, fieldBurningCH4
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
  input: GrainsInputTransformed,
  context: ExecutionContext<ConstantsForGrainsCalculator>,
) => {
  // Scope 2
  // 7.1 -electricity scope 2 and 3
  // electricity (s2), electricity (s3)
  const electricity = calculateElectricityScope2(crop, input, context);
  const allocatedElectricity = electricity.multiply(crop.electricityAllocation);

  return {
    electricity: allocatedElectricity,
  };
};

const calculateScope3Grains = (
  crop: GrainsCropTransformed,
  input: GrainsInputTransformed,
  context: ExecutionContext<ConstantsForGrainsCalculator>,
) => {
  // 7.1 -electricity scope 2 and 3
  // electricity (s2), electricity (s3)
  const electricity = calculateElectricityScope3(crop, input, context);
  // 7.5 Purchased fertiliser
  // fertiliser
  const { fertiliser } = calculateScope3Fertiliser(crop, context);

  // 7.6 Purchased herbicides / pesticides
  // herbicide
  const { herbicide } = calculateScope3Herbicide(crop, context);

  // 7.7 Purchased lime
  // lime
  const { lime } = calculateScope3Lime(crop, context);

  // 7.8 well to tank emissions from fuel
  // fuel
  const { fuel } = calculateScope3EmissionsFromFuel(crop, context);

  // 7.10 management of waste
  // new outputs

  return {
    electricity,
    fertiliser,
    herbicide,
    fuel,
    lime,
  };
};

type Scope1Values = {
  fuelCO2: TypedContainer<Mass<'CO2'>>;
  fuelCH4: TypedContainer<Mass<'CH4'>>;
  fuelN2O: TypedContainer<Mass<'N2O'>>;
  ureaCO2: TypedContainer<Mass<'CO2'>>;
  limeCO2: TypedContainer<Mass<'CO2'>>;
  fertiliserN2O: TypedContainer<Mass<'N2O'>>;
  atmosphericDepositionN2O: TypedContainer<Mass<'N2O'>>;
  leachingAndRunoffN2O: TypedContainer<Mass<'N2O'>>;
  cropResidueN2O: TypedContainer<Mass<'N2O'>>;
  fieldBurningN2O: TypedContainer<Mass<'N2O'>>;
  fieldBurningCH4: TypedContainer<Mass<'CH4'>>;
};

type Scope2Values = {
  electricity: TypedContainer<Mass<'CO2e'>>;
};

type Scope3Values = {
  electricity: TypedContainer<Mass<'CO2e'>>;
  fertiliser: TypedContainer<Mass<'CO2e'>>;
  herbicide: TypedContainer<Mass<'CO2e'>>;
  fuel: TypedContainer<Mass<'CO2e'>>;
  lime: TypedContainer<Mass<'CO2e'>>;
};

type ScopeValues = {
  scope1: Scope1Values;
  scope2: Scope2Values;
  scope3: Scope3Values;
};

// TODO: Implement this using an output schema object that lets us know the names of all the keys to traverse
function createScopeOutputs({ scope1, scope2, scope3 }: ScopeValues) {
  return {
    scope1: {
      fuelCO2: scope1Output('fuelCO2', scope1.fuelCO2),
      fuelCH4: scope1Output('fuelCH4', scope1.fuelCH4),
      fuelN2O: scope1Output('fuelN2O', scope1.fuelN2O),
      ureaCO2: scope1Output('ureaCO2', scope1.ureaCO2),
      limeCO2: scope1Output('limeCO2', scope1.limeCO2),
      fertiliserN2O: scope1Output('fertiliserN2O', scope1.fertiliserN2O),
      atmosphericDepositionN2O: scope1Output(
        'atmosphericDepositionN2O',
        scope1.atmosphericDepositionN2O,
      ),
      leachingAndRunoffN2O: scope1Output(
        'leachingAndRunoffN2O',
        scope1.leachingAndRunoffN2O,
      ),
      cropResidueN2O: scope1Output('cropResidueN2O', scope1.cropResidueN2O),
      fieldBurningN2O: scope1Output('fieldBurningN2O', scope1.fieldBurningN2O),
      fieldBurningCH4: scope1Output('fieldBurningCH4', scope1.fieldBurningCH4),
    },
    scope2: {
      electricity: output('electricity', 2, scope2.electricity),
    },
    scope3: {
      electricity: output('electricity', 3, scope3.electricity),
      fertiliser: output('fertiliser', 3, scope3.fertiliser),
      herbicide: output('herbicide', 3, scope3.herbicide),
      fuel: output('fuel', 3, scope3.fuel),
      lime: output('lime', 3, scope3.lime),
    },
  };
}

// TODO: Implement this using an output schema object that lets us know the names of all the keys to traverse
function mergeScopeOutputs(scopeOutputs: ScopeValues[]) {
  return {
    scope1: {
      fuelCO2: sum(scopeOutputs.map((s) => s.scope1.fuelCO2)),
      fuelCH4: sum(scopeOutputs.map((s) => s.scope1.fuelCH4)),
      fuelN2O: sum(scopeOutputs.map((s) => s.scope1.fuelN2O)),
      ureaCO2: sum(scopeOutputs.map((s) => s.scope1.ureaCO2)),
      limeCO2: sum(scopeOutputs.map((s) => s.scope1.limeCO2)),
      fertiliserN2O: sum(scopeOutputs.map((s) => s.scope1.fertiliserN2O)),
      atmosphericDepositionN2O: sum(
        scopeOutputs.map((s) => s.scope1.atmosphericDepositionN2O),
      ),
      leachingAndRunoffN2O: sum(
        scopeOutputs.map((s) => s.scope1.leachingAndRunoffN2O),
      ),
      cropResidueN2O: sum(scopeOutputs.map((s) => s.scope1.cropResidueN2O)),
      fieldBurningN2O: sum(scopeOutputs.map((s) => s.scope1.fieldBurningN2O)),
      fieldBurningCH4: sum(scopeOutputs.map((s) => s.scope1.fieldBurningCH4)),
    },
    scope2: {
      electricity: sum(scopeOutputs.map((s) => s.scope2.electricity)),
    },
    scope3: {
      electricity: sum(scopeOutputs.map((s) => s.scope3.electricity)),
      fertiliser: sum(scopeOutputs.map((s) => s.scope3.fertiliser)),
      herbicide: sum(scopeOutputs.map((s) => s.scope3.herbicide)),
      fuel: sum(scopeOutputs.map((s) => s.scope3.fuel)),
      lime: sum(scopeOutputs.map((s) => s.scope3.lime)),
    },
  };
}

export function calculateGrains(
  input: GrainsInputTransformed,
  context: ExecutionContext<ConstantsForGrainsCalculator>,
): GrainsOutput {
  // tranche 1 modules for grains

  const cropResults = input.crops.map((crop, ix) => {
    return {
      scope1: calculateScope1Grains(crop, context),
      scope2: calculateScope2Grains(crop, input, context),
      scope3: calculateScope3Grains(crop, input, context),
      meta: {
        id: crop.id || 'crop' + ix.toString(),
      },
    };
  });

  // console.dir(
  //   cropResults.map((c) => c.scope1.fuelCO2),
  //   { depth: 4 },
  // );

  const mergedScopes = createScopeOutputs(mergeScopeOutputs(cropResults));

  const scope1WithTotals = addScope1Totals(mergedScopes.scope1);
  const scope2WithTotals = addScope23Totals(mergedScopes.scope2);
  const scope3WithTotals = addScope23Totals(mergedScopes.scope3);

  const net = {
    total: {
      value:
        scope1WithTotals.total.value +
        scope2WithTotals.total.value +
        scope3WithTotals.total.value,
    },
  };

  // Carbon sequestration is covered by LULUCF guidance

  return {
    scope1: scope1WithTotals,
    scope2: scope2WithTotals,
    scope3: scope3WithTotals,
    net,
    intermediate: cropResults.map((crop) => {
      const cropOutputs = createScopeOutputs(crop);
      const scope1 = addScope1Totals(cropOutputs.scope1);
      const scope2 = addScope23Totals(cropOutputs.scope2);
      const scope3 = addScope23Totals(cropOutputs.scope3);
      const net = {
        total: scope1.total.value + scope2.total.value + scope3.total.value,
      };
      return {
        id: crop.meta.id,
        scope1,
        scope2,
        scope3,
        net,
        carbonSequestration: {
          total: 0,
        },
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
