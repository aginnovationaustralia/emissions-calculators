import { calculateElectricityScope2And3 } from '../common-legacy/electricity';
import {
  calculateFuelScope1CH4LPG,
  calculateFuelScope1CO2LPG,
  calculateFuelScope1N2OLPG,
  calculateScope3FuelWithLPGAverage,
} from '../common-legacy/fuel';
import { calculateScope3Herbicide } from '../common/herbicide';
import { calculateScope1Lime, calculateScope3Lime } from '../common/lime';
import { addTotalValue } from '../common/tools';
import { sumIntermediateResults } from '../common/tools/intermediate-results';
import { calculateAllCarbonSequestrationWithKeyProportion } from '../common/trees';
import { ExecutionContext } from '../executionContext';
import { CottonCrop } from '../types/Cotton/cotton.input';
import { CottonInput } from '../types/Cotton/input';
import { CottonOutput } from '../types/Cotton/output';
import { CottonVegetation } from '../types/Cotton/vegetation.input';
import { State } from '../types/types';
import { calculateScope1N2O } from './Scope1';
import { calculateScope1Urea } from './Scope1Urea';
import { calculateScope3Fertiliser } from './Scope3Fertiliser';
import { ConstantsForCottonCalculator } from './constants';
import { getIntensityDenominators } from './functions';

const generateIntensities = (
  context: ExecutionContext<ConstantsForCottonCalculator>,
  crops: CottonCrop[],
  carbonSequestrations: number[],
) => {
  const { constants } = context;

  return (n: number, i: number) => {
    const versionedDenominators = getIntensityDenominators(crops[i]);
    return {
      tonnesCropIncludingSequestration:
        n / (crops[i].averageCottonYield * crops[i].areaSown),
      tonnesCropExcludingSequestration:
        (n + carbonSequestrations[i]) /
        (crops[i].averageCottonYield * crops[i].areaSown),
      balesIncludingSequestration: n / versionedDenominators.bales,
      balesExcludingSequestration:
        (n + carbonSequestrations[i]) / versionedDenominators.bales,
      lintIncludingSequestration: n / versionedDenominators.lintMassTonnes,
      lintExcludingSequestration:
        (n + carbonSequestrations[i]) / versionedDenominators.lintMassTonnes,
      seedIncludingSequestration: n / versionedDenominators.seedMassTonnes,
      seedExcludingSequestration:
        (n + carbonSequestrations[i]) / versionedDenominators.seedMassTonnes,
      lintEconomicAllocation:
        (n + carbonSequestrations[i]) *
        constants.COTTON.COTTON_INTENSITY_ECONOMIC_ALLOCATION.LINT,
      seedEconomicAllocation:
        (n + carbonSequestrations[i]) *
        constants.COTTON.COTTON_INTENSITY_ECONOMIC_ALLOCATION.SEED,
      cottonYieldProducedTonnes:
        crops[i].averageCottonYield * crops[i].areaSown,
      balesProduced: versionedDenominators.bales,
      lintProducedTonnes: versionedDenominators.lintMassTonnes,
      seedProducedTonnes: versionedDenominators.seedMassTonnes,
    };
  };
};

const calculateSingleCotton = (
  crop: CottonCrop,
  context: ExecutionContext<ConstantsForCottonCalculator>,
  scope2Electricity: number,
  scope3Electricity: number,
  carbonSequestration: number,
  id: string,
) => {
  const scope1N2O = calculateScope1N2O(crop, context);

  const scope1Urea = calculateScope1Urea(crop, context);

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

  const scope3Fertiliser = calculateScope3Fertiliser(crop, context);

  const res = {
    scope1: addTotalValue({
      atmosphericDepositionN2O: scope1N2O.atmosphericN2O,
      fertiliserN2O: scope1N2O.fertiliserN2O,
      leachingAndRunoffN2O: scope1N2O.leechingN2O,
      cropResidueN2O: scope1N2O.cropResiduesN2O,
      limeCO2: scope1Limestone,
      fuelN2O: scope1FuelN2O,
      fuelCH4: scope1FuelCH4,
      fuelCO2: scope1FuelCO2,
      ureaCO2: scope1Urea,
      fieldBurningN2O: scope1N2O.burningN2O,
      fieldBurningCH4: scope1N2O.burningCH4,
      totalCH4: scope1FuelCH4 + scope1N2O.burningCH4,
      totalCO2: scope1FuelCO2 + scope1Limestone + scope1Urea,
      totalN2O:
        scope1N2O.atmosphericN2O +
        scope1N2O.fertiliserN2O +
        scope1N2O.leechingN2O +
        scope1N2O.cropResiduesN2O +
        scope1FuelN2O +
        scope1N2O.burningN2O,
    }),
    scope2: addTotalValue({
      electricity: scope2Electricity * crop.electricityAllocation,
    }),
    scope3: addTotalValue({
      fertiliser: scope3Fertiliser,
      herbicide: scope3Herbicide.total,
      electricity: scope3Electricity * crop.electricityAllocation,
      lime: scope3Lime,
      fuel: scope3Fuel,
    }),
  };

  return {
    output: res,
    extensions: {
      carbonSequestration,
    },
    net: {
      total:
        res.scope1.total +
        res.scope2.total +
        res.scope3.total -
        carbonSequestration,
    },
    meta: {
      id,
    },
  };
};

export function calculateEntireCotton(
  crops: CottonCrop[],
  electricityUse: number,
  electricityRenewablePercentage: number,
  state: State,
  vegetation: CottonVegetation[],
  context: ExecutionContext<ConstantsForCottonCalculator>,
): CottonOutput {
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

  const allCrops = crops.map((crop, ix) =>
    calculateSingleCotton(
      crop,
      context,
      electricity.scope2,
      electricity.scope3,
      carbonSequestration.intermediate[ix],
      crop.id ?? ix.toString(),
    ),
  );

  const totals = sumIntermediateResults(
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

  const emissionsTotal =
    totals.output.scope1.total +
    totals.output.scope2.total +
    totals.output.scope3.total;

  const netTotal = emissionsTotal - totals.extensions.carbonSequestration;

  const baseEmissions = {
    ...totals.output,
    net: {
      total: netTotal,
    },
  };

  return {
    ...baseEmissions,
    intensities: allCrops.map((crop, ix) =>
      generateIntensities(
        context,
        crops,
        carbonSequestration.intermediate,
      )(crop.net.total, ix),
    ),
    net: {
      total: netTotal,
      crops: allCrops.map((crop) => crop.net.total),
    },
    carbonSequestration: {
      total: carbonSequestration.total,
      intermediate: carbonSequestration.intermediate,
    },
    intermediate: allCrops.map((crop, ix) => {
      return {
        ...crop.output,
        carbonSequestration: {
          total: crop.extensions.carbonSequestration,
        },
        net: {
          total: crop.net.total,
        },
        intensities: generateIntensities(
          context,
          crops,
          carbonSequestration.intermediate,
        )(crop.net.total, ix),
        id: crop.meta.id,
      };
    }),
  };
}

export function calculateCotton(
  input: CottonInput,
  context: ExecutionContext<ConstantsForCottonCalculator>,
) {
  return calculateEntireCotton(
    input.crops,
    input.electricityUse,
    input.electricityRenewable,
    input.state,
    input.vegetation,
    context,
  );
}
