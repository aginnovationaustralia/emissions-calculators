import { ConstantsForGrainsCalculator } from '@/calculators/Grains/constants';
import { ExecutionContext } from '@/calculators/Grains/constants/executionContext';
import { BaseGrainsCropTransformed } from '@/calculators/Grains/types/base-crop.input';
import { constant, selectConstant } from '@/tools/constants';
import { Container } from '@/tools/containers';
import { input } from '@/tools/inputs';
import { sum } from '@/tools/sum';
import { MassPerMass, massPerMass, realNumber } from '@/tools/units';
import Decimal from 'decimal.js-light';
import { CropResidueInputTransformed } from '../6-residue-mgmt/crop-residue.input';
import { FertiliserInputTransformed } from './fertiliser.input';
import { isInorganicFertiliserKnownComponent } from './inorganic-fertiliser-components.input';
import {
  InorganicFertiliserInputTransformed,
  isInorganicFertiliserInputScope3Method1,
} from './inorganic-fertiliser.input';

const getEFjN20ForFertiliser = (
  inorganicFertiliser: InorganicFertiliserInputTransformed,
  baseCrop: BaseGrainsCropTransformed & FertiliserInputTransformed,
  constants: ConstantsForGrainsCalculator,
) => {
  const system = baseCrop.inorganicFertilisers.productionSystem;

  const applicationRate = inorganicFertiliser.massAppliedKg.divide(
    baseCrop.areaSown,
  );

  // NOTE: These special cases implement 5.1.1.2 method 2
  if (system === 'Irrigated crop (maize)') {
    // REVISIT: This is jumping down to raw numbers instead of using containers. We won't track that the applicationRate input was used, for example
    // The problem in this case is that a linear regression is used, and it is leapfrogging across units
    /* For irrigated maize, the emission factor EF j=irrigatedmaize,N2O can be estimated based
      on the linear regression developed by [2] as:
        EF fj=irrigatedmaize,N2O = -0.1474 + (0.0061 * N fj=irrigatedmaize )
    */
    const ef = -0.1474 + applicationRate.unit.value.mul(0.0061).toNumber();
    // const ef =  value(massPerMass('N2O', 'N', -0.1474).plus(applicationRate.multiply(num(0.0061)));
    return constant('EF jN20 (irrigated maize)', massPerMass('N2O', 'N', ef), {
      references: [`5.1.1.2 (150)`],
    });
  } else if (system === 'Non-irrigated crop (high rainfall zone)') {
    // EF fj=nonirrigatedgrains,N2O = -0.0781 + (0.0075 * N fj=nonirrigatedgrains)
    const ef = -0.0781 + applicationRate.unit.value.mul(0.0075).toNumber();
    return constant(
      'EF jN20 (non-irrigated high rainfall zone)',
      massPerMass('N2O', 'N', ef),
      { references: [`5.1.1.2 (157)`] },
    );
  } else if (
    system === 'Cotton' &&
    baseCrop.inorganicFertilisers.calculationMethodScope1 === '2'
  ) {
    // EF fj=cotton,N2O = 0.01 * (0.29 + (0.007(e0.037*Nfj=cotton- 1)N fj=cotton ))
    const ef =
      0.01 *
      (0.29 +
        (0.007 *
          (Math.exp(0.037 * applicationRate.unit.value.toNumber()) - 1)) /
          applicationRate.unit.value.toNumber());
    return constant('EF jN20 (cotton)', massPerMass('N2O', 'N', ef), {
      references: [`5.1.1.2 (163)`],
    });
  }
  return selectConstant(
    constants.CROP,
    (value) => massPerMass('N2O', 'N', value),
    'EF_N2O_PRODUCTION_SYSTEM',
    system,
  ).attachContext({ references: [`5.1.1.1 (119)`] });
};

export const massNitrogenFromInorganicFertiliserApplied = (
  inorganicFertiliser: InorganicFertiliserInputTransformed,
  constants: ConstantsForGrainsCalculator,
) => {
  /*
  See description for FNinorganic,f data source
  "Default values for common inorganic fertilisers based on average fertiliser composition from [4], or calculated from product label information.
  Default fraction of nitrogen for common fertiliser types are provided in Table A.2.2.6 of the Appendix.
  If using product information label, nitrogen content by weight per cent (wt%) fertiliser composition is typically stated in the form of N:P:K (the ratio of nitrogen, phosphorus and potassium nutrients."
  */
  let fnInorganicF: Container<MassPerMass<'N', 'Inorganic Fertiliser'>> =
    selectConstant(
      constants.CROP,
      (value) => massPerMass('N', 'Inorganic Fertiliser', value),
      'INORGANIC_FERTILISER_FRACTIONS',
      inorganicFertiliser.fertiliserType,
      'N',
    );

  if (isInorganicFertiliserInputScope3Method1(inorganicFertiliser)) {
    const nitrogenComponent = inorganicFertiliser.components?.find(
      (component) =>
        isInorganicFertiliserKnownComponent(component) &&
        component.componentType === 'Nitrogen - Generic',
    );
    if (nitrogenComponent) {
      fnInorganicF = input(
        'fnInorganicF (custom nitrogen component)',
        massPerMass(
          'N',
          'Inorganic Fertiliser',
          nitrogenComponent.fractionOfFertiliser.unit.value,
        ),
      );
    }
  } else {
    if (inorganicFertiliser.customNitrogenFraction) {
      fnInorganicF = inorganicFertiliser.customNitrogenFraction;
    }
  }

  const mnjf = inorganicFertiliser.massAppliedKg.multiply(fnInorganicF);
  return mnjf;
};

export const calculateInorganicFertiliserN2O = (
  input: FertiliserInputTransformed & BaseGrainsCropTransformed,
  context: ExecutionContext<ConstantsForGrainsCalculator>,
) => {
  const { constants } = context;
  /*
5.1.1.1 Method 1 - Inorganic Fertiliser Application N2O Emissions
(1) Nitrous oxide emissions from the application of all inorganic fertiliser types f to all
production systems j, EN2O (t N2O), are calculated as:
EN2O = SUMj SUMf (MN jf * EF j,N2O * CN2O * 10^-3)
Where MN jf = mass of nitrogen in inorganic fertiliser type f applied to production
system j (kg N)
EF j,N2O = emission factor for nitrous oxide for inorganic fertilisers (kg N2O-
N/kg N applied)
CN2O = factor to convert elemental mass of nitrous oxide to molecular mass
(dimensionless)
*/
  const { applications } = input.inorganicFertilisers;
  const emissionRecords = applications.map((inorganicFertiliser) => {
    const mnjf = massNitrogenFromInorganicFertiliserApplied(
      inorganicFertiliser,
      constants,
    );

    // NOTE: Method 2 is implemented in getEFjN20ForFertiliser
    const efjN20 = getEFjN20ForFertiliser(
      inorganicFertiliser,
      input,
      constants,
    );
    const cn2o = selectConstant(
      constants.COMMON,
      (value) => realNumber(new Decimal(value)),
      'GWP_FACTORSC15',
    );
    return mnjf.multiply(efjN20).multiply(cn2o);
  });

  return sum(emissionRecords, { name: 'E n2o' });
};

export const calculateInorganicFertiliserCO2 = (
  input: FertiliserInputTransformed,
  context: ExecutionContext<ConstantsForGrainsCalculator>,
) => {
  const { constants } = context;
  /*
  5.1.1.3 Method 1 - Inorganic Fertiliser Application CO2 Emissions
  Carbon dioxide emissions resulting from the use of inorganic, urea-based fertilisers,
  E jf,CO2 (t CO2), are calculated as:
  E jf,CO2 = MU jf * EF urea,CO2 * CCO2 * 10^-3
  MU jf = mass of urea of inorganic fertiliser type f applied to production system
  j (kg urea)
  EF urea,CO2 = emission factor for carbon emissions from urea-based fertilisers
  (kg C/kg urea)
  CCO2= factor to convert elemental mass of carbon dioxide to molecular mass
  (dimensionless)

  Mass of urea applied to production system MU jf is calculated as:
  MU jf = TM jf * FU f
  Where TM jf = the total mass of inorganic fertiliser type f applied to production system
  j (kg)
  FU f = the fraction of urea in fertiliser type f (kg urea/kg)
  */
  const { applications } = input.inorganicFertilisers;
  const emissionRecords = applications.map((inorganicFertiliser) => {
    const tmjf = inorganicFertiliser.massAppliedKg;
    const fUf = selectConstant(
      constants.CROP,
      (value) => massPerMass('Urea', 'Inorganic Fertiliser', value),
      'INORGANIC_FERTILISER_FRACTIONS',
      inorganicFertiliser.fertiliserType,
      'Urea',
    );
    const mujf = tmjf.multiply(fUf, {
      name: 'MUjf',
      references: [`5.1.1.3 (184)`],
    });

    const efUreaCO2 = constant(
      'EF Urea CO2',
      massPerMass('CO2e', 'Urea', new Decimal(constants.COMMON.EF_UREA_CO2)),
    );

    const cgCO2 = constant(
      'Cg CO2',
      massPerMass('CO2', 'CO2e', new Decimal(constants.COMMON.GWP_FACTORSC13)),
    );

    return mujf.multiply(efUreaCO2).multiply(cgCO2);
  });

  return sum(emissionRecords, {
    name: 'E jf CO2',
    references: [`5.1.1.3 (175)`],
  });
};

export const calculate51InorganicFertiliser = (
  input: FertiliserInputTransformed &
    CropResidueInputTransformed &
    BaseGrainsCropTransformed,
  context: ExecutionContext<ConstantsForGrainsCalculator>,
) => {
  return {
    inorganicFertiliserN2O: calculateInorganicFertiliserN2O(input, context),
    inorganicFertiliserCO2: calculateInorganicFertiliserCO2(input, context),
  };
};
