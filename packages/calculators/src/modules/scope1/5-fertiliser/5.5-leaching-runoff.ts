import { ConstantsForGrainsCalculator } from '@/calculators/Grains/constants';
import { ExecutionContext } from '@/calculators/Grains/constants/executionContext';
import { BaseGrainsCropTransformed } from '@/calculators/Grains/types/base-crop.input';
import { selectConstant } from '@/tools/constants';
import { one, zero } from '@/tools/sentinels';
import { sum } from '@/tools/sum';
import { massNitrogenFromInorganicFertiliserApplied } from './5.1-inorganic-fertiliser';
import { calculateMNSoilForOrganicFertiliser } from './5.2-organic-fertiliser';
import { FertiliserInputTransformed } from './fertiliser.input';

const calculateLeachingAndRunoffN2O = (
  input: FertiliserInputTransformed & BaseGrainsCropTransformed,
  constants: ConstantsForGrainsCalculator,
) => {
  /*
    5.5.1.1 Method 1 -- Fertiliser Leaching and Runoff N2O
    (1) Nitrous oxide emissions from nitrogen leaching and runoff from the application of all
    fertilisers (both organic and inorganic) across all production systems j, E fert,leach (tN2O), is calculated as:
    E fert,leach = SUMj (Mleach,inorganic,j + Mleach,organic,j * EF leach * CN2O * 10^-3)
    Where Mleach,inorganic,j = mass of nitrogen lost through leaching and runoff from inorganic fertiliser application in production system j (kg N)
    Mleach,organic,j = mass of nitrogen lost through leaching and runoff from organic fertiliser application (kg N)
    EF leach = emission factor for nitrogen leaching and runoff (kg N2O-N / kg N)
    CN2O = factor to convert elemental mass of nitrous oxide to molecular mass (dimensionless)
    */
  const { organicFertilisers, inorganicFertilisers } = input;
  const inorganicEmissions = inorganicFertilisers.applications.map(
    (inorganicFertiliser) => {
      const mnjf = massNitrogenFromInorganicFertiliserApplied(
        inorganicFertiliser,
        constants,
      );
      const fracWetj = input.isInLeachingZone ? one : zero;
      const fracLeach = selectConstant(
        constants.CROP,
        'FRACTION_N_LOST_THROUGH_LEACHING_AND_RUNOFF',
      );
      return mnjf.multiply(fracWetj).multiply(fracLeach);
    },
  );

  const inorganicMass = sum(inorganicEmissions);

  const organicEmissions = organicFertilisers.applications.map(
    (organicFertiliser) => {
      const mnsoiljf = calculateMNSoilForOrganicFertiliser(
        organicFertiliser,
        constants,
      );
      const fracWetj = input.isInLeachingZone ? one : zero;
      const fracLeach = selectConstant(
        constants.CROP,
        'FRACTION_N_LOST_THROUGH_LEACHING_AND_RUNOFF',
      );
      return mnsoiljf.multiply(fracWetj).multiply(fracLeach);
    },
  );
  const organicMass = sum(organicEmissions);

  const massLeached = inorganicMass.plus(organicMass);

  const efLeach = selectConstant(constants.CROP, 'EF_N2O_LEACHING_AND_RUNOFF');
  const cn2o = selectConstant(constants.COMMON, 'GWP_FACTORSC15');
  const eFertLeach = massLeached.multiply(efLeach).multiply(cn2o, {
    name: 'E fert,leach',
    references: [`5.5.1.1 (378)`],
  });

  return eFertLeach;
};

export const calculate55LeachingAndRunoff = (
  input: FertiliserInputTransformed & BaseGrainsCropTransformed,
  context: ExecutionContext<ConstantsForGrainsCalculator>,
) => {
  const { constants } = context;

  return {
    fertiliserLeachingAndRunoffN2O: calculateLeachingAndRunoffN2O(
      input,
      constants,
    ),
  };
};
