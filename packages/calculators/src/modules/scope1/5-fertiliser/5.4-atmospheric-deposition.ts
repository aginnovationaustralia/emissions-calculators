import { ExecutionContext } from '@/calculators/executionContext';
import { ExtendedCropProductionSystem } from '@/constants/enums';
import { convertToBasicProductionSystem } from '@/constants/translations';
import { HasConstants } from '@/constants/types';
import { selectConstant } from '@/tools/constants';
import { Container } from '@/tools/containers';
import { zeroN2O } from '@/tools/sentinels';
import { sum } from '@/tools/sum';
import { Mass } from '@/tools/units';
import { ConstantsForManureManagement } from '../4-manure-management/constants';
import { massNitrogenFromInorganicFertiliserAppliedMNjf } from './5.1-inorganic-fertiliser';
import { calculateMNSoilForOrganicFertiliser } from './5.2-organic-fertiliser';
import { ConstantsForFertiliser } from './constants';
import {
  FertiliserInputTransformed,
  HasFertiliserInputTransformed,
} from './fertiliser.input';
import { isInorganicFertiliserTypeOther } from './inorganic-fertiliser.input';

/**
 * Raw implementation of equation for nitrous oxide emissions from atmospheric deposition
 * *Ead* from the application of organic fertiliser (5.4.1.1 (1) and 5.4.1.1 (2)).
 * This function is used in both the contexts of estimating scope 1 organic fertiliser
 * emissions (Chapter 5.4) and scope 3 waste emissions (Chapter 15.12).
 */
export const calculateAtmosphericDepositionFromOrganicFertiliserNitrogen = (
  massOfNitrogen: Container<Mass<'N'>>,
  productionSystem: Container<ExtendedCropProductionSystem>,
  constants: HasConstants<'CROP' | 'COMMON'>,
): Container<Mass<'N2O'>> => {
  const fracGASMsoil = selectConstant(
    constants.CROP,
    'FRACTION_N_VOLATILISED_ORGANIC_FERTILISER',
  ).named('FracGASMsoil');
  /**
   * Mvol,organic,jf = MNSoiljf * FracGASMsoil
   */
  const volatisedNitrogen = massOfNitrogen
    .multiply(fracGASMsoil)
    .reference('5.4.1.3 (2)');

  const baseProductionSystem = convertToBasicProductionSystem(productionSystem);
  const productionSystemEF = selectConstant(
    constants.CROP,
    'EF_N2O_ATMOSPHERIC_DEPOSITION_PRODUCTION_SYSTEM',
    baseProductionSystem,
  ).named('EFN2Oj');

  const CN2O = selectConstant(
    constants.COMMON,
    'ELEMENTAL_TO_MOLECULAR_N2O',
  ).named('CN2O');

  /**
   * Ead,organic = SUM[j,f] (Mvol,organic,jf * EFN2O,j) * CN2O * 10^-3
   */
  return volatisedNitrogen.multiply(productionSystemEF).multiply(CN2O);
};

export const calculateInorganicFertiliserAtmosphericDepositionN2O = (
  activity: FertiliserInputTransformed,
  context: ExecutionContext<ConstantsForFertiliser>,
) => {
  const { constants } = context;
  /*
    5.4.1.1 Method 1 - Inorganic Fertiliser Atmospheric Deposition N2O Emissions
    Nitrous oxide emissions from atmospheric deposition from all inorganic fertiliser
    types f and all production systems j, Ead,inorganic (t N2O), is calculated as:
      Ead,inorganic = SUMj SUMf (Mvol,inorganic,jf * EFdepositionN2O,j * CN2O * 10^-3)
    Where Mvol,inorganic,jf = mass of nitrogen volatised from inorganic fertiliser applied to production system (kg N)
    EFdepositionN2O,j = emission factor for atmospheric deposition (kg N2O-N/kg N)
    CN2O = factor to convert elemental mass of nitrous oxide to molecular mass (dimensionless)
    (2) Mass of nitrogen volatilised from inorganic fertiliser, Mvol,inorganic,jf, is calculated as:
      Mvol,inorganic,jf = MN jf * FracGASF f
    Where MN jf= mass of nitrogen in inorganic fertiliser applied (kg N) (calculated in Section 5.1.1)
    FracGASF f= fraction of inorganic fertiliser that volatilises ((kg NH3-N + NOx-N)/kg N)
    */
  const { inorganic, productionSystem } = activity;
  const { applications } = inorganic;
  const baseProductionSystem = convertToBasicProductionSystem(productionSystem);
  const emissionRecords = applications.map((inorganicFertiliser) => {
    const mnjf = massNitrogenFromInorganicFertiliserAppliedMNjf(
      inorganicFertiliser,
      constants,
    );
    const fracGASFf = isInorganicFertiliserTypeOther(inorganicFertiliser)
      ? selectConstant(constants.CROP, 'INORGANIC_FERTILISER_OTHER_VOLATILISES')
      : selectConstant(
          constants.CROP,
          'INORGANIC_FERTILISER_FRACTIONS',
          inorganicFertiliser.fertiliserType,
          'Volatilises',
        );
    const mVolInorganic = mnjf.multiply(fracGASFf).reference('5.4.1.1 (2)');
    const efN2Oj = selectConstant(
      constants.CROP,
      'EF_N2O_ATMOSPHERIC_DEPOSITION_PRODUCTION_SYSTEM',
      baseProductionSystem,
    );
    const cn2o = selectConstant(constants.COMMON, 'ELEMENTAL_TO_MOLECULAR_N2O');
    return mVolInorganic.multiply(efN2Oj).multiply(cn2o);
  });

  return sum(emissionRecords, zeroN2O, {
    name: 'E ad,inorganic',
    references: [`5.4.1.1 (1)`],
  });
};

export const calculateOrganicFertiliserAtmosphericDepositionN2O = (
  input: HasFertiliserInputTransformed,
  context: ExecutionContext<ConstantsForManureManagement>,
) => {
  /*
  5.4.1.3 Method 1 - Organic Fertiliser Atmospheric Deposition N 2O Emissions
  (1) Nitrous oxide emissions from atmospheric deposition of all organic fertiliser types f
  and all production systems j, Ead,organic (t N2O), is calculated as:
  Ead,organic = SUMj SUMf (Mvol,organic,jf * EFdepositionN2O,j * CN2O * 10^-3)
  Where Mvol,organic,jf = mass of nitrogen volatilised from organic fertiliser applied to production system (kg N)
  EFdepositionN2O,j = emission factor for atmospheric deposition in production system j (kg N2O-N/(kg N))
  (2) Mass of nitrogen volatilised from organic fertiliser applied to production systems
  Mvol,organic,jf (kg N), is calculated as:
  Mvol,organic,jf = MNSoiljf * FracGASMsoil
  Where MNSoiljf = mass of nitrogen in organic fertiliser type f applied to production system j (kg N) (calculated in Section 5.1.2)
  FracGASMsoil = fraction of organic fertiliser N that volatilises ((kg NH3-N + NOx-N)/kg N)
    */
  const { organic, productionSystem } = input.fertiliser;
  const { applications } = organic;
  const { constants } = context;

  const emissionRecords = applications.map((organicFertiliser) => {
    const mnSoiljf = calculateMNSoilForOrganicFertiliser(
      organicFertiliser,
      constants,
    );

    return calculateAtmosphericDepositionFromOrganicFertiliserNitrogen(
      mnSoiljf,
      productionSystem,
      constants,
    );
  });
  return sum(emissionRecords, zeroN2O, {
    name: 'E ad,organic',
    references: [`5.4.1.3 (1)`],
  });
};

export const calculate54AtmosphericDeposition = (
  input: HasFertiliserInputTransformed,
  context: ExecutionContext<ConstantsForManureManagement>,
) => {
  return {
    inorganicFertiliserAtmosphericDepositionN2O:
      calculateInorganicFertiliserAtmosphericDepositionN2O(
        input.fertiliser,
        context,
      ),
    organicFertiliserAtmosphericDepositionN2O:
      calculateOrganicFertiliserAtmosphericDepositionN2O(input, context),
  };
};
