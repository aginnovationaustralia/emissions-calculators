import { ExecutionContext } from '@/calculators/executionContext';
import { convertToBasicProductionSystem } from '@/constants/translations';
import { selectConstant } from '@/tools/constants';
import { br, Container, max, min, num } from '@/tools/containers';
import { captureMethod1Or2Value } from '@/tools/multi';
import { e, zero } from '@/tools/sentinels';
import { sum } from '@/tools/sum';
import { selectSwitch } from '@/tools/switch';
import { MassPerMass, massPerMass, realNumber } from '@/tools/units';
import { ConstantsForFertiliser } from './constants';
import {
  FertiliserInputInorganicScope1Method2Transformed,
  FertiliserInputTransformed,
  HasFertiliserInputTransformed,
  isFertilisersInorganicScope1Method2,
} from './fertiliser.input';
import { isInorganicFertiliserKnownComponent } from './inorganic-fertiliser-components.input';
import {
  InorganicFertiliserInputTransformed,
  isInorganicFertiliserInputScope3Method1,
  isInorganicFertiliserTypeOther,
} from './inorganic-fertiliser.input';
import {
  InorganicFertiliserInputWithAreaTransformed,
  isInorganicFertiliserInputWithArea,
} from './inorganic-fertilisers.input';

const getEFjN2OForFertiliserMethod2 = (
  fertiliser: FertiliserInputInorganicScope1Method2Transformed,
  application: InorganicFertiliserInputWithAreaTransformed,
): Container<MassPerMass<'N2O', 'N'>> => {
  /**
   * NOTE: This value is in kg N/m^2, NOT kg N/ha, and hence must be converted
   * before calculating the relevant emissions factor.
   */
  const applicationRate = application.massAppliedKg.divide(
    application.areaAppliedHectares,
  );

  const applicationRateKgPerHectare = num(1e4).multiply(applicationRate);

  /**
   * For irrigated maize, the emission factor EF j=irrigatedmaize,N2O can be estimated based
   * on the linear regression developed by [[2]](https://connectsci.au/sr/article/62/1/SR23070/47290/Revised-emission-factors-for-estimating-direct) as:
   * > EF fj=irrigatedmaize,N2O = (-0.1474 + (0.0061 * N fj=irrigatedmaize)) * 10^-2
   */
  const efMaize: Container<MassPerMass<'N2O', 'N'>> = max(
    num(-0.1474)
      .plus(applicationRateKgPerHectare.multiply(num(0.0061)))
      .multiply(num(1e-2)),
    zero,
  )
    .switchUnit((r) => massPerMass('N2O', 'N', r.store))
    .reference('5.1.1.2 (1)');

  /**
   * for non-irrigated grains in high rainfall zone, a value for
   * EFj=nonirrigatedgrains,N2O may be estimated based on the linear regression developed
   * by [[2]](https://connectsci.au/sr/article/62/1/SR23070/47290/Revised-emission-factors-for-estimating-direct) as:
   * > EF fj=nonirrigatedgrains,N2O = (0.0781 + (0.0075 * N fj=nonirrigatedgrains)) * 10^-2
   */
  const efHighRainfall: Container<MassPerMass<'N2O', 'N'>> = num(0.0781)
    .plus(applicationRateKgPerHectare.multiply(num(0.0075)))
    .multiply(num(1e-2))
    .switchUnit((r) => massPerMass('N2O', 'N', r.store))
    .reference('5.1.1.2 (2)');

  /**
   * In equation 5.1.1.1 (1) for cotton, an entity-specific value for EFj=cotton,N2O may be
   * estimated based on the two-component model developed by [[3]](https://connectsci.au/sr/article/54/5/598/46814/Emission-factors-for-estimating-fertiliser-induced) as:
   * > EF fj=cotton,N2O = (0.29 + (0.007 * (e^(0.037 * Nfj=cotton) - 1) / Nfj=cotton)) * 10^-2
   *
   * This is capped at a maximum of 0.0183 kg CO2e/kg N, equivalent to N application rates of ~300 kg N/ha.
   */
  const efCotton: Container<MassPerMass<'N2O', 'N'>> = br(
    num(0.29).plus(
      br(
        num(0.007).multiply(
          e
            .power(
              num(0.037)
                .multiply(min(applicationRateKgPerHectare, num(300)))
                .switchUnit((r) => realNumber(r.store)),
            )
            .minus(num(1)),
        ),
      ).divide(
        applicationRateKgPerHectare.switchUnit((r) => realNumber(r.store)),
      ),
    ),
  )
    .multiply(num(1e-2))
    .switchUnit((r) => massPerMass('N2O', 'N', r.store))
    .reference('5.1.1.2 (3)');

  return selectSwitch(fertiliser.productionSystem, {
    'Irrigated crop (maize)': efMaize,
    'Non-irrigated crop (high rainfall)': efHighRainfall,
    Cotton: efCotton,
  });
};

const getEFjN2OForFertiliser = (
  fertiliser: FertiliserInputTransformed,
  application:
    | InorganicFertiliserInputTransformed
    | InorganicFertiliserInputWithAreaTransformed,
  constants: ConstantsForFertiliser,
): Container<MassPerMass<'N2O', 'N'>> => {
  const basicProductionSystem = convertToBasicProductionSystem(
    fertiliser.productionSystem,
  );

  const method1EF = selectConstant(
    constants.CROP,
    'EF_N2O_ATMOSPHERIC_DEPOSITION_PRODUCTION_SYSTEM',
    basicProductionSystem,
  ).switchUnit((value) => massPerMass('N2O', 'N', value.store));

  const method2EF =
    !isFertilisersInorganicScope1Method2(fertiliser) ||
    !isInorganicFertiliserInputWithArea(application)
      ? undefined
      : getEFjN2OForFertiliserMethod2(fertiliser, application);

  return captureMethod1Or2Value(method1EF, method2EF);
};

export const massNitrogenFromInorganicFertiliserAppliedMNjf = (
  inorganicFertiliser: InorganicFertiliserInputTransformed,
  constants: ConstantsForFertiliser,
) => {
  /*
  See description for FNinorganic,f data source
  "Default values for common inorganic fertilisers based on average fertiliser composition from [4], or calculated from product label information.
  Default fraction of nitrogen for common fertiliser types are provided in Table A.2.2.6 of the Appendix.
  If using product information label, nitrogen content by weight per cent (wt%) fertiliser composition is typically stated in the form of N:P:K (the ratio of nitrogen, phosphorus and potassium nutrients."

  Also NOTE: All of these values are method 1, despite the complex search for a particular value
  */
  let fnInorganicF: Container<MassPerMass<'N', 'Inorganic Fertiliser'>> =
    isInorganicFertiliserTypeOther(inorganicFertiliser)
      ? inorganicFertiliser.customNitrogenFraction
      : selectConstant(
          constants.CROP,
          'INORGANIC_FERTILISER_FRACTIONS',
          inorganicFertiliser.fertiliserType,
          'N',
        );

  if (isInorganicFertiliserInputScope3Method1(inorganicFertiliser)) {
    const nitrogenComponent = inorganicFertiliser.components?.find(
      (component) =>
        isInorganicFertiliserKnownComponent(component) &&
        component.componentType.unit === 'Nitrogen - Generic',
    );
    if (nitrogenComponent) {
      fnInorganicF = nitrogenComponent.fractionOfFertiliser
        .switchUnit((r) => massPerMass('N', 'Inorganic Fertiliser', r.store))
        .named('fnInorganicF (custom nitrogen component)');
    }
  } else {
    if (inorganicFertiliser.customNitrogenFraction) {
      fnInorganicF = inorganicFertiliser.customNitrogenFraction;
    }
  }

  const TMjf = inorganicFertiliser.massAppliedKg.named('TMjf');

  const mnjf = TMjf.multiply(fnInorganicF.named('FNinorganicf'))
    .named('MNjf')
    .reference('5.1.1.1 (2)');
  return mnjf;
};

export const calculateInorganicFertiliserN2O = (
  input: HasFertiliserInputTransformed,
  context: ExecutionContext<ConstantsForFertiliser>,
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
  const { applications } = input.fertiliser.inorganic;
  const emissionRecords = applications.map((inorganicFertiliser) => {
    const mnjf = massNitrogenFromInorganicFertiliserAppliedMNjf(
      inorganicFertiliser,
      constants,
    );

    const efjN2O = getEFjN2OForFertiliser(
      input.fertiliser,
      inorganicFertiliser,
      constants,
    );

    const cn2o = selectConstant(constants.COMMON, 'ELEMENTAL_TO_MOLECULAR_N2O');
    return mnjf.multiply(efjN2O).multiply(cn2o);
  });

  return sum(emissionRecords, { name: 'E n2o' }).reference('5.1.1.1 (1)');
};

function getUreaComponent(
  inorganicFertiliser: InorganicFertiliserInputTransformed,
  constants: ConstantsForFertiliser,
) {
  let fUf: Container<MassPerMass<'Urea', 'Inorganic Fertiliser'>> =
    isInorganicFertiliserTypeOther(inorganicFertiliser)
      ? inorganicFertiliser.customUreaFraction
      : selectConstant(
          constants.CROP,
          'INORGANIC_FERTILISER_FRACTIONS',
          inorganicFertiliser.fertiliserType,
          'Urea',
        );

  if (isInorganicFertiliserInputScope3Method1(inorganicFertiliser)) {
    const ureaComponent = inorganicFertiliser.components?.find(
      (component) =>
        isInorganicFertiliserKnownComponent(component) &&
        component.componentType.unit === 'Urea',
    );
    if (ureaComponent) {
      fUf = ureaComponent.fractionOfFertiliser
        .switchUnit((r) => massPerMass('Urea', 'Inorganic Fertiliser', r.store))
        .named('fUf (custom Urea component)');
    }
  }

  return fUf;
}

export const calculateInorganicFertiliserCO2 = (
  input: HasFertiliserInputTransformed,
  context: ExecutionContext<ConstantsForFertiliser>,
) => {
  const { constants } = context;
  /*
  5.1.1.3 Method 1 - Inorganic Fertiliser Application CO2 Emissions
  Carbon dioxide emissions resulting from the use of inorganic, urea-based fertilisers,
  E jf,CO2 (t CO2), are calculated as:
  ECO2 = SUM[j,f] (MU jf * EF urea,CO2 * CCO2) * 10^-3
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
  const { applications } = input.fertiliser.inorganic;
  const emissionRecords = applications.map((inorganicFertiliser) => {
    const tmjf = inorganicFertiliser.massAppliedKg;

    const fUf = getUreaComponent(inorganicFertiliser, constants);
    const mujf = tmjf.multiply(fUf, {
      name: 'MUjf',
      references: [`5.1.1.3 (2)`],
    });

    const efUreaCO2 = selectConstant(
      constants.COMMON,
      'EF_CONVERSION_UREA_TO_CO2',
    );

    const cgCO2 = selectConstant(
      constants.COMMON,
      'ELEMENTAL_TO_MOLECULAR_CO2',
    );

    return mujf.multiply(efUreaCO2).multiply(cgCO2);
  });

  return sum(emissionRecords, {
    name: 'E jf CO2',
    references: [`5.1.1.3 (1)`],
  });
};

export const calculate51InorganicFertiliser = (
  input: HasFertiliserInputTransformed,
  context: ExecutionContext<ConstantsForFertiliser>,
) => {
  return {
    inorganicFertiliserN2O: calculateInorganicFertiliserN2O(input, context),
    inorganicFertiliserCO2: calculateInorganicFertiliserCO2(input, context),
  };
};
