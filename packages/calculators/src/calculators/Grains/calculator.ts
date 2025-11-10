import { CropVegetation } from '@/types/common/crop-vegetation.input';
import { State } from '@/types/enums';
import { GrainsCrop } from '@/types/Grains/crop.input';
import { GrainsInput } from '@/types/Grains/input';
import { GrainsOutput } from '@/types/Grains/output';
import { calculateAllCarbonSequestrationWithKeyProportion } from '../../calculators/common/trees';
import { calculateElectricityScope2And3 } from '../common-legacy/electricity';
import {
  calculateFuelScope1CH4LPG,
  calculateFuelScope1CO2LPG,
  calculateFuelScope1N2OLPG,
  calculateScope3FuelWithLPGAverage,
} from '../common-legacy/fuel';
import { calculateScope3Herbicide } from '../common/herbicide';
import { calculateScope1Lime, calculateScope3Lime } from '../common/lime';
import { addTotalValue, divideBySafeFromZero } from '../common/tools';
import { sumIntermediateResults } from '../common/tools/intermediate-results';
import { ExecutionContext } from '../executionContext';
import { ConstantsForGrainsCalculator } from './constants';
import { calculateScope1N2O } from './Scope1';
import { calculateScope1FieldBurning } from './Scope1FieldBurningCH4';
import { calculateScope1Urea } from './Scope1Urea';
import { calculateScope3Fertiliser } from './Scope3Fertiliser';

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

export function calculateEntireGrains(
  crops: GrainsCrop[],
  electricityUse: number,
  electricityRenewablePercentage: number,
  state: State,
  vegetation: CropVegetation[],
  context: ExecutionContext<ConstantsForGrainsCalculator>,
): GrainsOutput {
  const electricity = calculateElectricityScope2And3(
    state,
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

export function calculateGrains(
  input: GrainsInput,
  context: ExecutionContext<ConstantsForGrainsCalculator>,
) {
  return calculateEntireGrains(
    input.crops,
    input.electricityUse,
    input.electricityRenewable,
    input.state,
    input.vegetation,
    context,
  );
}
