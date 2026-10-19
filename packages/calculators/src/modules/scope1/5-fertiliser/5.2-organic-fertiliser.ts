import { ExecutionContext } from '@/calculators/executionContext';
import { HasClimateZoneInputTransformed } from '@/calculators/types/has-climate-zone.input';
import { ClimateZoneType } from '@/constants/enums';
import { HasConstants } from '@/constants/types';
import { selectConstant } from '@/tools/constants';
import { Container } from '@/tools/containers';
import { sum } from '@/tools/sum';
import { Mass } from '@/tools/units';
import { calculateMassOfNitrogenAppliedToSoils } from '../4-manure-management/calculate';
import { ConstantsForManureManagement } from '../4-manure-management/constants';
import { HasFertiliserInputTransformed } from './fertiliser.input';
import { OrganicFertiliserInputTransformed } from './organic-fertiliser.input';

/**
 * Raw implementation of equation for nitrous oxide emissions *EN2O* from the application
 * of organic fertiliser (5.2.1.1 (1)). This function is used in both the contexts of
 * estimating scope 1 organic fertiliser emissions (Chapter 5.2) and scope 3 waste
 * emissions (Chapter 15.12).
 */
export const calculateDirectN2OFromOrganicFertiliserNitrogen = (
  massOfNitrogen: Container<Mass<'N'>>,
  climateZone: Container<ClimateZoneType>,
  constants: HasConstants<'CROP' | 'COMMON'>,
): Container<Mass<'N2O'>> => {
  /**
   * EN2O = SUM[j,f] (MNSoiljf * EFN2O,i * CN2O) * 10^-3
   */
  const climateZoneEF = selectConstant(
    constants.CROP,
    'EF_RESIDUES_RETURNED_TO_SOIL',
    climateZone,
  ).named('EFN2O,i');

  const CN2O = selectConstant(
    constants.COMMON,
    'ELEMENTAL_TO_MOLECULAR_N2O',
  ).named('CN2O');

  return massOfNitrogen.multiply(climateZoneEF).multiply(CN2O);
};

export const calculateMNSoilForOrganicFertiliser = (
  application: OrganicFertiliserInputTransformed,
  constants: ConstantsForManureManagement,
) => {
  const origin = application.origin;
  if (origin.origin === 'Traced') {
    return calculateMassOfNitrogenAppliedToSoils(origin.details, constants);
  } else {
    const { customNitrogenFraction } = origin;
    const fnOrganicF = selectConstant(
      constants.CROP,
      'ORGANIC_FERTILISER_FRACTIONS',
      origin.organicFertiliserType,
      'N',
    );
    // NOTE: This is definitely method 1, even though it feels like a method 2 input
    const nitrogenFraction = customNitrogenFraction ?? fnOrganicF;
    return origin.massAppliedKg.multiply(nitrogenFraction);
  }
};

export const calculate52OrganicFertiliser = (
  activity: HasFertiliserInputTransformed & HasClimateZoneInputTransformed,
  context: ExecutionContext<ConstantsForManureManagement>,
) => {
  const { constants } = context;
  /*
  5.2.1.1 Method 1 - Organic Fertiliser Application N2O Emissions
  Nitrous oxide emissions for all organic fertiliser types f and all production systems j,
  EN2O (t N2O), are calculated as:
  EN2O = SUMj SUMf (MNSoiljf * EF N2O,i * CN2O * 10^-3)
  Where MNSoiljf = mass of nitrogen in organic fertiliser type f applied to production system j (kg N)
  EF N2O,i = emission factor for direct nitrous oxide emissions from organic fertiliser applied to soils and aquatic systems in climate zone i (kg N2O-N/kg N).
  CN2O = factor to convert elemental mass of nitrous oxide to molecular mass (dimensionless)
  */
  const { organic } = activity.fertiliser;
  const { applications } = organic;
  const emissionRecords = applications.map((organicFertiliser) => {
    const mnSoiljf = calculateMNSoilForOrganicFertiliser(
      organicFertiliser,
      constants,
    )
      .named('MNSoiljf')
      .reference('5.2.1.1 (2)');

    return calculateDirectN2OFromOrganicFertiliserNitrogen(
      mnSoiljf,
      activity.climateZone,
      constants,
    );
  });

  return sum(emissionRecords, {
    name: 'Sum E N2O',
    references: [`5.2.1.1 (1)`],
  });
};
