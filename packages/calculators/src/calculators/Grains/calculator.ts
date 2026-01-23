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
import { Mass } from '@/tools/units';
import { GrainsCropTransformed } from '@/types/Grains/crop.input';
import { GrainsInputTransformed } from '@/types/Grains/input';
import { GrainsOutput } from '@/types/Grains/output';
import { calculateAllCarbonSequestrationWithKeyProportion } from '../../calculators/common/trees';
import {
  calculateFuelScope1CH4LPG,
  calculateFuelScope1CO2LPG,
  calculateFuelScope1N2OLPG,
  calculateScope3FuelWithLPGAverage,
} from '../common-legacy/fuel';
import { calculateScope1Lime } from '../common/lime';
import { addTotalValue, divideBySafeFromZero } from '../common/tools';
import { sumIntermediateResults } from '../common/tools/intermediate-results';
import { ExecutionContext } from '../executionContext';
import { ConstantsForGrainsCalculator } from './constants';
import { calculateScope1N2O } from './Scope1';
import { calculateScope1FieldBurning } from './Scope1FieldBurningCH4';
import { calculateScope1Urea } from './Scope1Urea';

function getIntensities(
  netTotal: number,
  carbonSequestration: number,
  grainProducedTonnes: number,
) {
  return {
    grainsExcludingSequestration: divideBySafeFromZero(
      netTotal + carbonSequestration,
      grainProducedTonnes,
    ),
    grainsIncludingSequestration: divideBySafeFromZero(
      netTotal,
      grainProducedTonnes,
    ),
    grainProducedTonnes,
  };
}

const calculateScope1Grains = (crop: GrainsCropTransformed, context: ExecutionContext<ConstantsForGrainsCalculator>) => {
  const { fuelCO2, fuelCH4, fuelN2O } = calculateScope1Fuel(crop, context);
  const { ureaCO2, limeCO2, fertiliserN2O, atmosphericDepositionN2O, leachingAndRunoffN2O } = calculateScope1FertiliserUse(crop, context);
  const { cropResidueN2O, fieldBurningN2O, fieldBurningCH4 } = calculateScope1ResidueManagement(crop, context);

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
  }
}

const calculateScope2Grains = (crop: GrainsCropTransformed, totalElectricity: TypedOrigin<Mass<'CO2e'>>) => {
  return {
    electricity: multiply(totalElectricity, crop.electricityAllocation),
  }
}

const calculateScope3Grains = (crop: GrainsCropTransformed, totalElectricity: TypedOrigin<Mass<'CO2e'>>, context: ExecutionContext<ConstantsForGrainsCalculator>) => {

  const { fertiliser } = calculateScope3Fertiliser(crop, context);
  const { herbicide } = calculateScope3Herbicide(crop, context);
  const { fuel } = calculateScope3EmissionsFromFuel(crop, context);
  const { lime } = calculateScope3Lime(crop, context);

  return {
    electricity: multiply(totalElectricity, crop.electricityAllocation),
    fertiliser,
    herbicide,
    fuel,
    lime,
  }
}

export function calculateGrains(
  input: GrainsInputTransformed,
  context: ExecutionContext<ConstantsForGrainsCalculator>,
): GrainsOutput {
  // tranche 1 modules for grains

  // Scope 1

  const electricity = calculateElectricityScope2And3(
    input,
    context,
  );

  const cropResults = input.crops.map((crop) => {
    return {
      scope1: calculateScope1Grains(crop, context),
      scope2: calculateScope2Grains(crop, electricity.scope2),
      scope3: calculateScope3Grains(crop, electricity.scope3, context),
    }
  })

  // 6.1 Transport fuel
  // 6.2 Stationary combustion fuel
  //   fuelCO2, fuelCH4, fuelN2O

  // 6.3 refrigerants
  // new outputs


  // 5.1 Fertiliser use
  // ureaCO2, limeCO2,  fertiliserN2O, atmosphericDepositionN2O,leachingAndRunoffN2O

  // 5.2 residue management
  // cropResidueN2O, fieldBurningN2O, fieldBurningCH4

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

  // Carbon sequestration is covered by LULUCF guidance



  const electricity = calculateElectricityScope2And3(
    input.state,
    'State Grid',
    electricityRenewablePercentage,
    electricityUse,
    context,
  );

  const carbonSequestration = calculateAllCarbonSequestrationWithKeyProportion(
    vegetation,
    'allocationToCrops',
    crops,
    context,
  );

  const allCrops = crops.map((crop, i) => {
    const scope1N2O = calculateScope1N2O(crop, context);
    const scope1Limestone = calculateScope1Lime(
      crop.limestone,
      crop.limestoneFraction,
      context,
    );

    const { lpg } = crop;

    const scope1FuelN2O = calculateFuelScope1N2OLPG(
      crop.dieselUse,
      crop.petrolUse,
      lpg,
      context,
      true,
    );
    const scope1FuelCH4 = calculateFuelScope1CH4LPG(
      crop.dieselUse,
      crop.petrolUse,
      lpg,
      context,
      true,
    );
    const scope1FuelCO2 = calculateFuelScope1CO2LPG(
      crop.dieselUse,
      crop.petrolUse,
      lpg,
      context,
      true,
    );
    const scope1Urea = calculateScope1Urea(crop, context);
    const scope1Burning = calculateScope1FieldBurning(crop, context);

    const scope3Fertiliser = calculateScope3Fertiliser(crop, context);
    const scope3Herbicide = calculateScope3Herbicide(
      crop.glyphosateOtherHerbicideUse,
      crop.herbicideUse,
      context,
    );
    const scope3Lime = calculateScope3Lime(crop.limestone, context);
    const scope3Fuel = calculateScope3FuelWithLPGAverage(
      crop.dieselUse,
      crop.petrolUse,
      lpg,
      context,
    );

    const res = {
      scope1: addTotalValue({
        atmosphericDepositionN2O: scope1N2O.atmosphericDepositionN2O,
        fertiliserN2O: scope1N2O.fertiliserN2O,
        leachingAndRunoffN2O: scope1N2O.leachingAndRunoffN2O,
        cropResidueN2O: scope1N2O.cropResidueN2O,
        limeCO2: scope1Limestone,
        fuelN2O: scope1FuelN2O,
        fuelCH4: scope1FuelCH4,
        fuelCO2: scope1FuelCO2,
        ureaCO2: scope1Urea,
        fieldBurningN2O: scope1Burning.N2O,
        fieldBurningCH4: scope1Burning.CH4,
        totalCH4: scope1FuelCH4 + scope1Burning.CH4,
        totalCO2: scope1FuelCO2 + scope1Limestone + scope1Urea,
        totalN2O:
          scope1N2O.atmosphericDepositionN2O +
          scope1N2O.fertiliserN2O +
          scope1N2O.leachingAndRunoffN2O +
          scope1N2O.cropResidueN2O +
          scope1FuelN2O +
          scope1Burning.N2O,
      }),
      scope2: addTotalValue({
        electricity: electricity.scope2 * crop.electricityAllocation,
      }),
      scope3: addTotalValue({
        fertiliser: scope3Fertiliser.total,
        herbicide: scope3Herbicide.total,
        electricity: electricity.scope3 * crop.electricityAllocation,
        lime: scope3Lime,
        fuel: scope3Fuel,
      }),
    };

    return {
      output: res,
      extensions: {
        carbonSequestration: carbonSequestration.intermediate[i],
        amountProduced: crop.averageGrainYield * crop.areaSown,
      },
      meta: {
        id: crop.id ?? i.toString(),
      },
      net: {
        total:
          res.scope1.total +
          res.scope2.total +
          res.scope3.total -
          carbonSequestration.intermediate[i],
      },
    };
  });

  const total = sumIntermediateResults(
    {
      output: {
        scope1: {
          atmosphericDepositionN2O: 0,
          fertiliserN2O: 0,
          leachingAndRunoffN2O: 0,
          cropResidueN2O: 0,
          limeCO2: 0,
          fuelN2O: 0,
          fuelCH4: 0,
          fuelCO2: 0,
          ureaCO2: 0,
          totalCH4: 0,
          totalCO2: 0,
          totalN2O: 0,
          fieldBurningN2O: 0,
          fieldBurningCH4: 0,
          total: 0,
        },
        scope2: { electricity: 0, total: 0 },
        scope3: {
          fertiliser: 0,
          herbicide: 0,
          electricity: 0,
          lime: 0,
          fuel: 0,
          total: 0,
        },
      },
      extensions: {
        carbonSequestration: 0,
        amountProduced: 0,
      },
      net: {
        total: 0,
      },
      meta: {
        id: '',
      },
    },
    allCrops,
  );

  return {
    scope1: total.output.scope1,
    scope2: total.output.scope2,
    scope3: total.output.scope3,
    carbonSequestration,
    intermediate: allCrops.map((crop) => ({
      id: crop.meta.id,
      scope1: crop.output.scope1,
      scope2: crop.output.scope2,
      scope3: crop.output.scope3,
      carbonSequestration: {
        total: crop.extensions.carbonSequestration,
      },
      net: crop.net,
      intensitiesWithSequestration: getIntensities(
        crop.net.total,
        crop.extensions.carbonSequestration,
        crop.extensions.amountProduced,
      ),
    })),
    intensities: allCrops.map((crop) =>
      divideBySafeFromZero(crop.net.total, crop.extensions.amountProduced),
    ),
    intensitiesWithSequestration: allCrops.map((crop) =>
      getIntensities(
        crop.net.total,
        crop.extensions.carbonSequestration,
        crop.extensions.amountProduced,
      ),
    ),
    net: {
      total:
        total.output.scope1.total +
        total.output.scope2.total +
        total.output.scope3.total -
        carbonSequestration.total,
      crops: allCrops.map((crop) => crop.net.total),
    },
  };
}
