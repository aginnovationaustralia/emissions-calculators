import { ExecutionContext } from '@/calculators/executionContext';
import { ConstantsForGrainsCalculator } from '@/calculators/Grains/constants';
import { BaseGrainsCropTransformed } from '@/calculators/Grains/types/base-crop.input';
import { constant, selectConstant } from '@/tools/constants';
import { Container } from '@/tools/containers';
import { input } from '@/tools/inputs';
import { sum } from '@/tools/sum';
import { Mass, MassPerMass, massPerMass } from '@/tools/units';
import { CropResidueInputTransformed } from '../6-residue-mgmt/crop-residue.input';
import { FertiliserInputTransformed } from './fertiliser.input';
import { isInorganicFertiliserKnownComponent } from './inorganic-fertiliser-components.input';
import {
  InorganicFertiliserInputTransformed,
  isInorganicFertiliserInputScope3Method1,
} from './inorganic-fertiliser.input';
import Decimal from 'decimal.js-light';

const getEFjN2OForFertiliser = (
  inorganicFertiliserMassN: Container<Mass<'N'>>,
  baseCrop: BaseGrainsCropTransformed & FertiliserInputTransformed,
  constants: ConstantsForGrainsCalculator,
) => {
  const system = baseCrop.inorganicFertilisers.productionSystem;

  /**
   * NOTE: This value is in kg N/m^2, NOT kg N/ha, and hence must be converted
   * before calculating the relevant emissions factor.
   */
  const applicationRate = inorganicFertiliserMassN.divide(baseCrop.areaSown);

  const applicationRateKgPerHectare = applicationRate.unit.value.mul(1e4);

  // NOTE: These special cases implement 5.1.1.2 method 2
  if (system === 'Irrigated crop (maize)') {
    // REVISIT: This is jumping down to raw numbers instead of using containers. We won't track that the applicationRate input was used, for example
    // The problem in this case is that a linear regression is used, and it is leapfrogging across units

    /**
     * For irrigated maize, the emission factor EF j=irrigatedmaize,N2O can be estimated based
     * on the linear regression developed by [[2]](https://connectsci.au/sr/article/62/1/SR23070/47290/Revised-emission-factors-for-estimating-direct) as:
     * > EF fj=irrigatedmaize,N2O = (-0.1474 + (0.0061 * N fj=irrigatedmaize)) * 10^-2
     */
    const ef = new Decimal(-0.1474)
      .plus(applicationRateKgPerHectare.mul(0.0061))
      .mul(1e-2)
      .toNumber();
    // const ef =  value(massPerMass('N2O', 'N', -0.1474).plus(applicationRate.multiply(num(0.0061)));
    return constant(
      'EF jN2O (irrigated maize)',
      massPerMass('N2O', 'Volatilised N', ef),
      {
        references: [`5.1.1.2 (150)`],
      },
    );
  } else if (system === 'Non-irrigated crop (high rainfall zone)') {
    /**
     * for non-irrigated grains in high rainfall zone, a value for
     * EFj=nonirrigatedgrains,N2O may be estimated based on the linear regression developed
     * by [[2]](https://connectsci.au/sr/article/62/1/SR23070/47290/Revised-emission-factors-for-estimating-direct) as:
     * > EF fj=nonirrigatedgrains,N2O = (0.0781 + (0.0075 * N fj=nonirrigatedgrains)) * 10^-2
     */
    const ef = new Decimal(0.0781)
      .plus(applicationRateKgPerHectare.mul(0.0075))
      .mul(1e-2)
      .toNumber();
    return constant(
      'EF jN2O (non-irrigated high rainfall zone)',
      massPerMass('N2O', 'Volatilised N', ef),
      { references: [`5.1.1.2 (157)`] },
    );
  } else if (
    system === 'Cotton' &&
    baseCrop.inorganicFertilisers.calculationMethodScope1 === '2'
  ) {
    /**
     * In equation 5.1.1.1 (1) for cotton, an entity-specific value for EFj=cotton,N2O may be
     * estimated based on the two-component model developed by [[3]](https://connectsci.au/sr/article/54/5/598/46814/Emission-factors-for-estimating-fertiliser-induced) as:
     * > EF fj=cotton,N2O = (0.29 + (0.007 * (e^(0.037 * Nfj=cotton - 1)) / Nfj=cotton)) * 10^-2
     *
     * This is capped at a maximum of 0.0183 kg CO2e/kg N, equivalent to N application rates of ~300 kg N/ha.
     */
    const ef =
      (0.29 +
        (0.007 *
          (Math.exp(0.037 * applicationRateKgPerHectare.toNumber()) - 1)) /
          applicationRateKgPerHectare.toNumber()) *
      1e-2;
    return constant(
      'EF jN2O (cotton)',
      massPerMass('N2O', 'Volatilised N', Math.min(ef, 0.0183)),
      {
        references: [`5.1.1.2 (163)`],
      },
    );
  }
  return selectConstant(
    constants.CROP,
    'EF_N2O_PRODUCTION_SYSTEM',
    system,
  ).attach({ references: [`5.1.1.1 (119)`] });
};

export const massNitrogenFromInorganicFertiliserAppliedMNjf = (
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

  const TMjf = inorganicFertiliser.massAppliedKg.named('TMjf');

  const mnjf = TMjf.multiply(fnInorganicF.named('FNinorganicf')).named('MNjf');
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
    const mnjf = massNitrogenFromInorganicFertiliserAppliedMNjf(
      inorganicFertiliser,
      constants,
    );

    // NOTE: Method 2 is implemented in getEFjN2OForFertiliser
    const efjN2O = getEFjN2OForFertiliser(mnjf, input, constants);

    const cn2o = selectConstant(constants.COMMON, 'GWP_FACTORSC15');
    // @ts-expect-error - unclear if efjN2O is a MassPerMass<'N2O', 'N'> or MassPerMass<'N2O', 'Volatilised N'>
    return mnjf.multiply(efjN2O).multiply(cn2o);
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
      'INORGANIC_FERTILISER_FRACTIONS',
      inorganicFertiliser.fertiliserType,
      'Urea',
    );
    const mujf = tmjf.multiply(fUf, {
      name: 'MUjf',
      references: [`5.1.1.3 (184)`],
    });

    const efUreaCO2 = selectConstant(constants.COMMON, 'EF_UREA_CO2');

    const cgCO2 = selectConstant(constants.COMMON, 'GWP_FACTORSC13');

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
