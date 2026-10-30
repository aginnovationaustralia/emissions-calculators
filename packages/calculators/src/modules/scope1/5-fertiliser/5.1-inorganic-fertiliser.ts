import { ExecutionContext } from '@/calculators/executionContext';
import { ProductionSystemsInorganicFertiliser } from '@/constants';
import { inorganicFertiliserComponentHasFertiliserEquivalent } from '@/constants/enums';
import {
  componentToFertiliser,
  convertToBasicProductionSystem,
} from '@/constants/translations';
import { selectConstant } from '@/tools/constants';
import { br, Container, max, min, num, root } from '@/tools/containers';
import { InputContainer } from '@/tools/inputs';
import { captureMethod1Or2Value } from '@/tools/multi';
import {
  e,
  zero,
  zeroCO2,
  zeroMassPerMassNInorganicFertiliser,
  zeroMassPerMassUreaInorganicFertiliser,
  zeroN,
} from '@/tools/sentinels';
import { sum } from '@/tools/sum';
import { selectSwitch } from '@/tools/switch';
import {
  MassPerArea,
  MassPerMass,
  massPerMass,
  realNumber,
  Substance,
} from '@/tools/units';
import { ConstantsForFertiliser } from './constants';
import {
  FertiliserInputInorganicScope1Method2Transformed,
  FertiliserInputTransformed,
  HasFertiliserInputTransformed,
  isFertilisersInorganicScope1Method2,
} from './fertiliser.input';
import {
  InorganicFertiliserComponentInputTransformed,
  isInorganicFertiliserKnownComponent,
  isInorganicFertiliserNitrogenComponent,
} from './inorganic-fertiliser-components.input';
import {
  InorganicFertiliserInputTransformed,
  isInorganicFertiliserInputScope3Method1,
  isInorganicFertiliserTypeOther,
} from './inorganic-fertiliser.input';

const massPerFertiliser = <S extends Substance>(substance: S, value: number) =>
  root(massPerMass(substance, 'Inorganic Fertiliser', value));

const getNitrogenFractionInComponent = (
  component: InorganicFertiliserComponentInputTransformed,
  constants: ConstantsForFertiliser,
): Container<MassPerMass<'N', 'Inorganic Fertiliser'>> => {
  if (!isInorganicFertiliserKnownComponent(component))
    return massPerFertiliser('N', 0);
  if (isInorganicFertiliserNitrogenComponent(component))
    return massPerFertiliser('N', 1);
  const componentType = component.componentType;
  if (inorganicFertiliserComponentHasFertiliserEquivalent(componentType)) {
    const equivalentFertiliserType = componentToFertiliser(componentType);
    return selectConstant(
      constants.CROP,
      'INORGANIC_FERTILISER_FRACTIONS',
      equivalentFertiliserType,
      'N',
    );
  }
  return massPerFertiliser('N', 0);
};

/**
 * Wrapper for getting the fraction of nitrogen *FNinorganic,f* for an inorganic
 * fertiliser application
 */
const getNitrogenFraction = (
  inorganicFertiliser: InorganicFertiliserInputTransformed,
  constants: ConstantsForFertiliser,
): Container<MassPerMass<'N', 'Inorganic Fertiliser'>> => {
  /**
   * See description for FNinorganic,f data source:
   * > Default values for common inorganic fertilisers based on average fertiliser composition from [4], or calculated from product label information.
   * > Default fraction of nitrogen for common fertiliser types are provided in Table A.2.2.6 of the Appendix.
   * > If using product information label, nitrogen content by weight per cent (wt%) fertiliser composition is typically stated in the form of N:P:K (the ratio of nitrogen, phosphorus and potassium nutrients."
   *
   * Also NOTE: All of these values are method 1, despite the complex search for a particular value
   */

  if (isInorganicFertiliserInputScope3Method1(inorganicFertiliser)) {
    const nitrogenInComponents = (inorganicFertiliser.components ?? []).map(
      (component) =>
        getNitrogenFractionInComponent(component, constants).multiply(
          component.fractionOfFertiliser,
        ),
    );
    /**
     * NOTE: We require that components be supplied completely, or not at all. We treat
     * an empty array as "not at all" here.
     */
    if (nitrogenInComponents.length > 0) {
      return sum(nitrogenInComponents, zeroMassPerMassNInorganicFertiliser)
        .switchUnit((r) => massPerMass('N', 'Inorganic Fertiliser', r.store))
        .named('FNinorganic,f (custom components)');
    }
  } else if (inorganicFertiliser.customNitrogenFraction !== undefined) {
    return inorganicFertiliser.customNitrogenFraction;
  }

  return (
    isInorganicFertiliserTypeOther(inorganicFertiliser)
      ? inorganicFertiliser.customNitrogenFraction
      : selectConstant(
          constants.CROP,
          'INORGANIC_FERTILISER_FRACTIONS',
          inorganicFertiliser.fertiliserType,
          'N',
        )
  ).named(`FNinorganic,f (${inorganicFertiliser.fertiliserType.unit})`);
};

function getUreaFraction(
  inorganicFertiliser: InorganicFertiliserInputTransformed,
  constants: ConstantsForFertiliser,
) {
  if (isInorganicFertiliserInputScope3Method1(inorganicFertiliser)) {
    const ureaInComponents = (inorganicFertiliser.components ?? []).map(
      (component) => {
        if (!isInorganicFertiliserKnownComponent(component))
          return massPerFertiliser('Urea', 0);
        if (component.componentType.unit === 'Urea-Ammonium Nitrate') {
          return selectConstant(
            constants.CROP,
            'INORGANIC_FERTILISER_FRACTIONS',
            'Urea-Ammonium Nitrate (UAN)',
            'Urea',
          ).multiply(component.fractionOfFertiliser);
        }
        if (component.componentType.unit === 'Urea')
          return component.fractionOfFertiliser.switchUnit((value) =>
            massPerMass('Urea', 'Inorganic Fertiliser', value.store),
          );
        return massPerFertiliser('Urea', 0);
      },
    );
    /**
     * NOTE: We require that components be supplied completely, or not at all. We treat
     * an empty array as "not at all" here.
     */
    if (ureaInComponents.length > 0) {
      return sum(
        ureaInComponents,
        zeroMassPerMassUreaInorganicFertiliser,
      ).named('FUf (custom components)');
    }
  }

  return (
    isInorganicFertiliserTypeOther(inorganicFertiliser)
      ? inorganicFertiliser.customUreaFraction
      : selectConstant(
          constants.CROP,
          'INORGANIC_FERTILISER_FRACTIONS',
          inorganicFertiliser.fertiliserType,
          'Urea',
        )
  ).named(`FUf (${inorganicFertiliser.fertiliserType.unit})`);
}

const calculateInorganicFertiliserN2OMethod1 = (
  fertiliser: FertiliserInputTransformed,
  constants: ConstantsForFertiliser,
) => {
  const basicProductionSystem = convertToBasicProductionSystem(
    fertiliser.productionSystem,
  );
  const emissionFactor = selectConstant(
    constants.CROP,
    'EF_N2O_ATMOSPHERIC_DEPOSITION_PRODUCTION_SYSTEM',
    basicProductionSystem,
  ).switchUnit((value) => massPerMass('N2O', 'N', value.store));
  const CN2O = selectConstant(constants.COMMON, 'ELEMENTAL_TO_MOLECULAR_N2O');

  const totalNitrogen = sum(
    fertiliser.inorganic.applications.map((application) =>
      application.massAppliedKg
        .multiply(getNitrogenFraction(application, constants))
        .named(`MNjf`)
        .reference('5.1.1.1 (2)'),
    ),
    zeroN,
  );

  /**
   * EN2O = SUM[j,f] (MNjf * EFj,N2O * CN2O) * 10^-3
   */
  return totalNitrogen
    .multiply(emissionFactor)
    .multiply(CN2O)
    .named('EN2O')
    .reference('5.1.1.1 (1)');
};

const calculateMethod2EmissionsFactor = (
  productionSystem: InputContainer<ProductionSystemsInorganicFertiliser>,
  totalNitrogenApplicationRate: Container<MassPerArea<'N'>>,
): Container<MassPerMass<'N2O', 'N'>> => {
  /**
   * NOTE: `totalNitrogenApplicationRate` is in kg N/m^2, NOT kg N/ha, and hence must be
   * converted before calculating the relevant emissions factor.
   */
  const applicationRateKgPerHectare = num(1e4).multiply(
    totalNitrogenApplicationRate,
  );

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
    .named(`EFfj=irrigatedmaize,N2O`)
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
    .named(`EFfj=nonirrigatedgrains,N2O`)
    .reference('5.1.1.2 (2)');

  /**
   * In equation 5.1.1.1 (1) for cotton, an entity-specific value for EFj=cotton,N2O may be
   * estimated based on the two-component model developed by [[3]](https://connectsci.au/sr/article/54/5/598/46814/Emission-factors-for-estimating-fertiliser-induced) as:
   * > EFfj=cotton,N2O = (0.29 + (0.007 * (e^(0.037 * Nfj=cotton) - 1) / Nfj=cotton)) * 10^-2
   *
   * This is capped at a maximum of 0.0183 kg CO2e/kg N, equivalent to N application rates of ~300 kg N/ha.
   */
  const cappedApplicationRate = min(applicationRateKgPerHectare, num(300));
  const efCotton: Container<MassPerMass<'N2O', 'N'>> = br(
    num(0.29).plus(
      br(
        num(0.007).multiply(
          e
            .power(
              num(0.037)
                .multiply(cappedApplicationRate)
                .switchUnit((r) => realNumber(r.store)),
            )
            .minus(num(1)),
        ),
      ).divide(cappedApplicationRate.switchUnit((r) => realNumber(r.store))),
    ),
  )
    .multiply(num(1e-2))
    .switchUnit((r) => massPerMass('N2O', 'N', r.store))
    .named(`EFfj=cotton,N2O`)
    .reference('5.1.1.2 (3)');

  return selectSwitch(productionSystem, {
    'Irrigated crop (maize)': efMaize,
    'Non-irrigated crop (high rainfall)': efHighRainfall,
    Cotton: efCotton,
  });
};

const calculateInorganicFertiliserN2OMethod2 = (
  fertiliser: FertiliserInputInorganicScope1Method2Transformed,
  constants: ConstantsForFertiliser,
) => {
  const { areaAppliedHectares } = fertiliser.inorganic;
  const totalNitrogenApplied = sum(
    fertiliser.inorganic.applications.map((application) =>
      application.massAppliedKg.multiply(
        getNitrogenFraction(application, constants),
      ),
    ),
    zeroN,
  );

  const nitrogenApplicationRate =
    totalNitrogenApplied.divide(areaAppliedHectares);

  const emissionsFactor = calculateMethod2EmissionsFactor(
    fertiliser.productionSystem,
    nitrogenApplicationRate,
  );

  const CN2O = selectConstant(constants.COMMON, 'ELEMENTAL_TO_MOLECULAR_N2O');

  return totalNitrogenApplied.multiply(emissionsFactor).multiply(CN2O);
};

export const massNitrogenFromInorganicFertiliserAppliedMNjf = (
  inorganicFertiliser: InorganicFertiliserInputTransformed,
  constants: ConstantsForFertiliser,
) => {
  const fnInorganicF = getNitrogenFraction(inorganicFertiliser, constants);

  const TMjf = inorganicFertiliser.massAppliedKg.named('TMjf');

  const mnjf = TMjf.multiply(fnInorganicF.named('FNinorganicf'))
    .named('MNjf')
    .reference('5.1.1.1 (2)');
  return mnjf;
};

export const calculateInorganicFertiliserN2O = (
  { fertiliser }: HasFertiliserInputTransformed,
  context: ExecutionContext<ConstantsForFertiliser>,
) => {
  const { constants } = context;
  return captureMethod1Or2Value(
    calculateInorganicFertiliserN2OMethod1(fertiliser, constants),
    isFertilisersInorganicScope1Method2(fertiliser)
      ? calculateInorganicFertiliserN2OMethod2(fertiliser, constants)
      : undefined,
  );
};

export const calculateInorganicFertiliserCO2 = (
  input: HasFertiliserInputTransformed,
  context: ExecutionContext<ConstantsForFertiliser>,
) => {
  const { constants } = context;
  /**
   * ECO2 = SUM[j,f] (MU jf * EF urea,CO2 * CCO2) * 10^-3
   */
  const { applications } = input.fertiliser.inorganic;
  const emissionRecords = applications.map((inorganicFertiliser) => {
    const tmjf = inorganicFertiliser.massAppliedKg;

    const fUf = getUreaFraction(inorganicFertiliser, constants);
    /**
     * MU jf = TM jf * FU f
     */
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

  return sum(emissionRecords, zeroCO2, {
    name: 'ECO2',
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
