import { ConstantsForGrainsCalculator } from '@/calculators/Grains/constants';
import { ExecutionContext } from '@/calculators/Grains/constants/executionContext';
import { BaseGrainsCropTransformed } from '@/calculators/Grains/types/base-crop.input';
import { selectConstant } from '@/tools/constants';
import { sum } from '@/tools/sum';
import { calculateMassOfNitrogenAppliedToSoils } from '../4-manure-management/calculate';
import { CropResidueInputTransformed } from '../6-residue-mgmt/crop-residue.input';
import { FertiliserInputTransformed } from './fertiliser.input';
import { OrganicFertiliserInputTransformed } from './organic-fertiliser.input';

export const calculateMNSoilForOrganicFertiliser = (
  application: OrganicFertiliserInputTransformed,
  crop: BaseGrainsCropTransformed,
  constants: ConstantsForGrainsCalculator,
) => {
  const origin = application.origin;
  if (origin.origin === 'Local') {
    return calculateMassOfNitrogenAppliedToSoils(
      origin.details,
      crop,
      constants,
    ).scope1;
  } else if (origin.origin === 'Purchased_Traced') {
    return calculateMassOfNitrogenAppliedToSoils(
      origin.details,
      crop,
      constants,
    ).scope3;
  } else {
    const { customNitrogenFraction } = origin;
    const fnOrganicF = selectConstant(
      constants.CROP,
      'ORGANIC_FERTILISER_FRACTIONS',
      origin.organicFertiliserType,
      'N',
    );
    const nitrogenFraction = customNitrogenFraction ?? fnOrganicF;
    // REVISIT: If massAppliedKg is only used here, for purchased generic fertiliser, the input key should be moved into details
    return application.massAppliedKg.multiply(nitrogenFraction);
  }
};

export const calculate52OrganicFertiliser = (
  input: FertiliserInputTransformed &
    CropResidueInputTransformed &
    BaseGrainsCropTransformed,
  context: ExecutionContext<ConstantsForGrainsCalculator>,
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
  const { applications } = input.organicFertilisers;
  const emissionRecords = applications.map((organicFertiliser) => {
    const mnSoiljf = calculateMNSoilForOrganicFertiliser(
      organicFertiliser,
      input,
      constants,
    ).named('MNSoiljf');
    const efN2Oi = selectConstant(
      constants.CROP,
      'EF_RESIDUES_RETURNED_TO_SOIL',
      input.rainfallAbove600,
    ).named('EF N2O,i');
    const cn2o = selectConstant(constants.COMMON, 'GWP_FACTORSC15').named(
      'CN2O',
    );
    return mnSoiljf.multiply(efN2Oi).multiply(cn2o, { name: 'E N2O' });
  });

  return sum(emissionRecords, {
    name: 'Sum E N2O',
    references: [`5.2.1.1 (238)`],
  });
};
