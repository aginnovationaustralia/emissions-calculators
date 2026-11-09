import { ExecutionContext } from '@/calculators/executionContext';
import { HasIsInLeachingZoneInputTransformed } from '@/calculators/types/has-is-in-leaching.input';
import { isInLeachingZoneToFracWET } from '@/constants/translations';
import { HasConstants } from '@/constants/types';
import { selectConstant } from '@/tools/constants';
import { Container } from '@/tools/containers';
import { zeroN } from '@/tools/sentinels';
import { sum } from '@/tools/sum';
import { Mass } from '@/tools/units';
import { ConstantsForManureManagement } from '../4-manure-management/constants';
import { massNitrogenFromInorganicFertiliserAppliedMNjf } from './5.1-inorganic-fertiliser';
import { calculateMNSoilForOrganicFertiliser } from './5.2-organic-fertiliser';
import { HasFertiliserInputTransformed } from './fertiliser.input';

/**
 * Raw implementation of equation for nitrous oxide emissions from leaching and runoff
 * *Eleach* from the application of fertiliser (5.5.1.1 (1) - 5.5.1.1 (3)).
 * This function is used in both the contexts of estimating scope 1 inorganic and organic
 * fertiliser emissions (Chapter 5.5) and scope 3 waste emissions (Chapter 15.12).
 */
export const calculateLeachingAndRunoffFromNitrogen = (
  massOfNitrogen: Container<Mass<'N'>>,
  isInLeachingZone: Container<boolean>,
  constants: HasConstants<'CROP' | 'COMMON'>,
): Container<Mass<'N2O'>> => {
  const fracWET = isInLeachingZoneToFracWET(isInLeachingZone);
  const fracLeach = selectConstant(
    constants.CROP,
    'FRACTION_N_LOST_THROUGH_LEACHING_AND_RUNOFF',
  ).named(`FracLEACH`);

  /**
   *
   * 5.5.1.1 (2):
   * > Mleach,inorganic,j = SUMf (MNjf * FracWET,j * FracLEACH)
   *
   * 5.5.1.1 (3):
   * > Mleach,organic,j = SUMf (MNSoiljf * FracWET,j * FracLEACH)
   */
  const lostNitrogen = massOfNitrogen
    .multiply(fracWET)
    .multiply(fracLeach)
    .attach({ references: ['5.5.1.1 (2)', '5.5.1.1 (3)'] });

  const leachingEF = selectConstant(
    constants.CROP,
    'EF_N2O_LEACHING_AND_RUNOFF',
  ).named('EFleach');
  const CN2O = selectConstant(
    constants.COMMON,
    'ELEMENTAL_TO_MOLECULAR_N2O',
  ).named('CN2O');

  /**
   * Efert,leach = SUM (Mleach,inorganic,j + Mleach,organic,j) * EFleach * CN2O * 10^-3
   */
  return lostNitrogen.multiply(leachingEF).multiply(CN2O);
};

export const calculateLeachingAndRunoffN2O = (
  activity: HasFertiliserInputTransformed & HasIsInLeachingZoneInputTransformed,
  context: ExecutionContext<ConstantsForManureManagement>,
) => {
  const { constants } = context;
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
  const { organic, inorganic } = activity.fertiliser;
  const inorganicNitrogen = inorganic.applications.map((inorganicFertiliser) =>
    massNitrogenFromInorganicFertiliserAppliedMNjf(
      inorganicFertiliser,
      constants,
    ),
  );

  const inorganicMass = sum(inorganicNitrogen, zeroN);

  const organicNitrogen = organic.applications.map((organicFertiliser) =>
    calculateMNSoilForOrganicFertiliser(organicFertiliser, constants),
  );
  const organicMass = sum(organicNitrogen, zeroN);

  /**
   * NOTE: The calculation of mass of nitrogen lost through leaching is the same for a
   * given mass of nitrogen, regardless of whether it came from inorganic or organic
   * fertiliser.
   */
  const totalNitrogen = inorganicMass.plus(organicMass);

  return calculateLeachingAndRunoffFromNitrogen(
    totalNitrogen,
    activity.isInLeachingZone,
    constants,
  ).attach({
    name: 'E fert,leach',
    references: [`5.5.1.1 (1)`],
  });
};

export const calculate55LeachingAndRunoff = (
  input: HasFertiliserInputTransformed & HasIsInLeachingZoneInputTransformed,
  context: ExecutionContext<ConstantsForManureManagement>,
) => {
  return {
    fertiliserLeachingAndRunoffN2O: calculateLeachingAndRunoffN2O(
      input,
      context,
    ),
  };
};
