import { ExecutionContext } from '@/calculators/executionContext';
import { ConstantsForGrainsCalculator } from '@/calculators/Grains/constants';
import { BaseGrainsCropTransformed } from '@/calculators/Grains/types/base-crop.input';
import {
  BasicCropProductionSystem,
  ExtendedCropProductionSystem,
} from '@/constants/enums';
import { selectConstant } from '@/tools/constants';
import { sum } from '@/tools/sum';
import { CropResidueInputTransformed } from '../6-residue-mgmt/crop-residue.input';
import { massNitrogenFromInorganicFertiliserApplied } from './5.1-inorganic-fertiliser';
import { calculateMNSoilForOrganicFertiliser } from './5.2-organic-fertiliser';
import { FertiliserInputTransformed } from './fertiliser.input';

export const extendedToBaseProductionSystem = (
  productionSystem: ExtendedCropProductionSystem,
): BasicCropProductionSystem => {
  // REVISIT: These assumptions need to be validated
  if (productionSystem === 'Irrigated crop (maize)') {
    return 'Irrigated crop (high rainfall)';
  } else if (productionSystem === 'Non-irrigated crop (high rainfall zone)') {
    return 'Non-irrigated crops';
  }
  return productionSystem;
};

export const calculateInorganicFertiliserAtmosphericDepositionN2O = (
  input: FertiliserInputTransformed,
  context: ExecutionContext<ConstantsForGrainsCalculator>,
) => {
  const { constants } = context;
  /*
    5.4.1.1 Method 1 - Inorganic Fertiliser Atmospheric Deposition N2O Emissions
    Nitrous oxide emissions from atmospheric deposition from all inorganic fertiliser
    types f and all production systems j, Ead,inorganic (t N2O), is calculated as:
      Ead,inorganic = SUMj SUMf (Mvol,inorganic,jf * EF N2O,j * CN2O * 10^-3)
    Where Mvol,inorganic,jf = mass of nitrogen volatised from inorganic fertiliser applied to production system (kg N)
    EF N2O,j = emission factor for atmospheric deposition (kg N2O-N/kg N)
    CN2O = factor to convert elemental mass of nitrous oxide to molecular mass (dimensionless)
    (2) Mass of nitrogen volatilised from inorganic fertiliser, Mvol,inorganic,jf, is calculated as:
      Mvol,inorganic,jf = MN jf * FracGASF f
    Where MN jf= mass of nitrogen in inorganic fertiliser applied (kg N) (calculated in Section 5.1.1)
    FracGASF f= fraction of inorganic fertiliser that volatilises ((kg NH3-N + NOx-N)/kg N)
    */
  const { applications } = input.inorganicFertilisers;
  const baseProductionSystem = extendedToBaseProductionSystem(
    input.inorganicFertilisers.productionSystem,
  );
  const emissionRecords = applications.map((inorganicFertiliser) => {
    const mnjf = massNitrogenFromInorganicFertiliserApplied(
      inorganicFertiliser,
      constants,
    );
    const fracGASFf = selectConstant(
      constants.CROP,
      'INORGANIC_FERTILISER_FRACTIONS',
      inorganicFertiliser.fertiliserType,
      'Volatilises',
    );
    const mVolInorganic = mnjf.multiply(fracGASFf);
    const efN2Oj = selectConstant(
      constants.CROP,
      'EF_N2O_PRODUCTION_SYSTEM',
      baseProductionSystem,
    );
    const cn2o = selectConstant(constants.COMMON, 'GWP_FACTORSC15');
    return mVolInorganic.multiply(efN2Oj).multiply(cn2o);
  });

  return sum(emissionRecords, {
    name: 'E ad,inorganic',
    references: [`5.4.1.1 (319)`],
  });
};

const calculateOrganicFertiliserAtmosphericDepositionN2O = (
  input: FertiliserInputTransformed &
    CropResidueInputTransformed &
    BaseGrainsCropTransformed,
  constants: ConstantsForGrainsCalculator,
) => {
  /*
  5.4.1.3 Method 1 - Organic Fertiliser Atmospheric Deposition N 2O Emissions
  (1) Nitrous oxide emissions from atmospheric deposition of all organic fertiliser types f
  and all production systems j, Ead,organic (t N2O), is calculated as:
  Ead,organic = SUMj SUMf (Mvol,organic,jf * EF N2O,j * CN2O * 10^-3)
  Where Mvol,organic,jf = mass of nitrogen volatilised from organic fertiliser applied to production system (kg N)
  EF N2O,j= emission factor for atmospheric deposition in production system j (kg N2O-N/(kg N)
  (2) Mass of nitrogen volatilised from organic fertiliser applied to production systems
  Mvol,organic,jf (kg N), is calculated as:
  Mvol,organic,jf = MNSoiljf * FracGASMsoil
  Where MNSoiljf = mass of nitrogen in organic fertiliser type f applied to production system j (kg N) (calculated in Section 5.1.2)
  FracGASMsoil = fraction of organic fertiliser N that volatilises ((kg NH3-N + NOx-N)/kg N)
    */
  const { applications } = input.organicFertilisers;
  const baseProductionSystem = extendedToBaseProductionSystem(
    input.inorganicFertilisers.productionSystem,
  );

  const emissionRecords = applications.map((organicFertiliser) => {
    const mnSoiljf = calculateMNSoilForOrganicFertiliser(
      organicFertiliser,
      input,
      constants,
    );
    const fracGASMsoil = selectConstant(
      constants.CROP,
      'FRACTION_N_VOLATILISED_ORGANIC_FERTILISER',
    );
    const mVolOrganic = mnSoiljf.multiply(fracGASMsoil);
    const efN2Oj = selectConstant(
      constants.CROP,
      'EF_N2O_PRODUCTION_SYSTEM',
      baseProductionSystem,
    );
    const cn2o = selectConstant(constants.COMMON, 'GWP_FACTORSC15');
    return mVolOrganic.multiply(efN2Oj).multiply(cn2o);
  });
  return sum(emissionRecords, {
    name: 'E ad,organic',
    references: [`5.4.1.3 (339)`],
  });
};

export const calculate54AtmosphericDeposition = (
  input: FertiliserInputTransformed &
    CropResidueInputTransformed &
    BaseGrainsCropTransformed,
  context: ExecutionContext<ConstantsForGrainsCalculator>,
) => {
  const { constants } = context;

  return {
    inorganicFertiliserAtmosphericDepositionN2O:
      calculateInorganicFertiliserAtmosphericDepositionN2O(input, context),
    organicFertiliserAtmosphericDepositionN2O:
      calculateOrganicFertiliserAtmosphericDepositionN2O(input, constants),
  };
};
