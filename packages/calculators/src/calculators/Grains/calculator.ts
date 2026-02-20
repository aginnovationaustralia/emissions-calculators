import {
  calculate51InorganicFertiliser,
  calculate52OrganicFertiliser,
  calculate53Lime,
  calculate54AtmosphericDeposition,
  calculate55LeachingAndRunoff,
} from '@/modules/scope1/5-fertiliser';
import {
  calculate61CropResidueN2O,
  calculate63ResidueLeachingAndRunoffN2O,
  calculate64FieldBurning,
} from '@/modules/scope1/6-residue-mgmt';
import { calculate62PastureResidueN2O } from '@/modules/scope1/6-residue-mgmt/6.2-residues-pasture';
import {
  calculate81TransportFuel,
  calculate82StationaryFuel,
} from '@/modules/scope1/8-fuel-use';
import { calculateScope1RefrigerantUse } from '@/modules/scope1/9-refrigerant-use';
import { calculateElectricityScope2 } from '@/modules/scope2/14-electricity';
import { calculateScope3EmissionsFromFuel } from '@/modules/scope3/15.10-fuel';
import { calculateElectricityScope3 } from '@/modules/scope3/15.11-electricity';
import { calculateScope3Waste } from '@/modules/scope3/15.13-waste';
import { calculateScope3Fertiliser } from '@/modules/scope3/15.4-fertiliser';
import { calculateScope3Agrichemicals } from '@/modules/scope3/15.5-agrichemicals';
import { calculateScope3Lime } from '@/modules/scope3/15.6-lime';
import { calculateScope3Services } from '@/modules/scope3/15.7-services';
import { mergeScopeOutputs, wrapScopesAsOutputs } from '@/tools/calculators';
import { Container } from '@/tools/containers';
import { sum } from '@/tools/sum';
import { addScope1Totals, addScope23Totals } from '@/tools/totals';
import { massInTonnes } from '@/tools/unit-conversion';
import { Mass } from '@/tools/units';
import { divideBySafeFromZero } from '../common/tools';
import { ConstantsForGrainsCalculator } from './constants';
import { ExecutionContext } from './constants/executionContext';
import { GrainsOutput, GrainsOutputSchema } from './types';
import { GrainsCropTransformed } from './types/crop.input';
import { GrainsInputTransformed } from './types/input';

const valueObject = (value: number) => ({
  value,
});

function getIntensities(
  netTotal: number,
  carbonSequestration: number,
  grainProduced: Container<Mass<'DryMatter'>>,
) {
  const grainProducedTonnes = valueObject(
    massInTonnes(grainProduced).toNumber(),
  );
  const grainsExcludingSequestration = valueObject(
    divideBySafeFromZero(
      netTotal + carbonSequestration,
      grainProducedTonnes.value,
    ),
  );
  const grainsIncludingSequestration = valueObject(
    divideBySafeFromZero(netTotal, grainProducedTonnes.value),
  );
  return {
    grainsExcludingSequestration,
    grainsIncludingSequestration,
    grainProducedTonnes,
  };
}

const calculateScope1Grains = (
  crop: GrainsCropTransformed,
  context: ExecutionContext<ConstantsForGrainsCalculator>,
) => {
  // 6.3 refrigerants
  // new outputs

  // 8.1 Transport fuel
  // 8.2 Stationary combustion fuel
  const { fuelTransportCO2, fuelTransportCH4, fuelTransportN2O } =
    calculate81TransportFuel(crop, context);
  const { fuelStationaryCO2, fuelStationaryCH4, fuelStationaryN2O } =
    calculate82StationaryFuel(crop, context);

  // 5 Fertiliser use
  const { inorganicFertiliserN2O } = calculate51InorganicFertiliser(
    crop,
    context,
  );
  const organicFertiliserN2O = calculate52OrganicFertiliser(crop, context);
  const limeCO2 = calculate53Lime(crop, context);
  const {
    inorganicFertiliserAtmosphericDepositionN2O,
    organicFertiliserAtmosphericDepositionN2O,
  } = calculate54AtmosphericDeposition(crop, context);
  const { fertiliserLeachingAndRunoffN2O } = calculate55LeachingAndRunoff(
    crop,
    context,
  );

  // 6 residue management
  const cropResidueN2O = calculate61CropResidueN2O(crop, context);
  const pastureResidueN2O = calculate62PastureResidueN2O(crop, context);
  const residueLeachingAndRunoffN2O = calculate63ResidueLeachingAndRunoffN2O(
    crop,
    context,
  );
  const { fieldBurningN2O, fieldBurningCH4 } = calculate64FieldBurning(
    crop,
    context,
  );

  // 6.3 refrigerants
  const refrigerantHFCs = calculateScope1RefrigerantUse(crop, context);

  return {
    fuelTransportCO2,
    fuelTransportCH4,
    fuelTransportN2O,
    fuelStationaryCO2,
    fuelStationaryCH4,
    fuelStationaryN2O,
    limeCO2,
    inorganicFertiliserN2O,
    organicFertiliserN2O,
    inorganicFertiliserAtmosphericDepositionN2O,
    organicFertiliserAtmosphericDepositionN2O,
    fertiliserLeachingAndRunoffN2O,
    cropResidueN2O,
    pastureResidueN2O,
    residueLeachingAndRunoffN2O,
    fieldBurningN2O,
    fieldBurningCH4,
    refrigerantHFCs,
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
  const fertiliser = calculateScope3Fertiliser(crop, context);

  // 7.6 Purchased herbicides / pesticides
  // herbicide
  const { agrichemicals } = calculateScope3Agrichemicals(crop, context);

  // 7.7 Purchased lime
  // lime
  const lime = calculateScope3Lime(crop, context);

  // 7.8 well to tank emissions from fuel
  // fuel
  const fuel = calculateScope3EmissionsFromFuel(crop, context);

  // 7.10 management of waste
  // new outputs
  const services = calculateScope3Services(crop, context);
  const { offsiteManure, solidWaste } = calculateScope3Waste(crop, context);

  return {
    electricity,
    fertiliser,
    agrichemicals,
    fuel,
    lime,
    services,
    offsiteManure,
    solidWaste,
  };
};

export function calculateGrains(
  input: GrainsInputTransformed,
  context: ExecutionContext<ConstantsForGrainsCalculator>,
): GrainsOutput {
  const cropResults = input.crops.map((crop, ix) => {
    return {
      scope1: calculateScope1Grains(crop, context),
      scope2: calculateScope2Grains(crop, input, context),
      scope3: calculateScope3Grains(crop, input, context),
      meta: {
        id: crop.id || 'crop' + ix.toString(),
        amountProduced: crop.averageYield.multiply(crop.areaSown),
      },
    };
  });

  const merged = mergeScopeOutputs(cropResults, GrainsOutputSchema.shape);

  const mergedScopes = wrapScopesAsOutputs(merged);

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
      const cropOutputs = wrapScopesAsOutputs<GrainsOutput>(crop);
      const scope1 = addScope1Totals(cropOutputs.scope1);
      const scope2 = addScope23Totals(cropOutputs.scope2);
      const scope3 = addScope23Totals(cropOutputs.scope3);
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
        carbonSequestration: {
          total: 0,
        },
        intensities: getIntensities(
          net.total.value,
          0,
          crop.meta.amountProduced,
        ),
      };
    }),
    intensities: getIntensities(
      net.total.value,
      0,
      sum(cropResults.map((crop) => crop.meta.amountProduced)),
    ),
  };
}
