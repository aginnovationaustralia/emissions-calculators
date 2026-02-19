import { ConstantsForGrainsCalculator } from '@/calculators/Grains/constants';
import { isInorganicFertiliserComponentTypeRegional } from '@/calculators/Grains/constants/enums';
import { ExecutionContext } from '@/calculators/Grains/constants/executionContext';
import { GrainsCropTransformed } from '@/calculators/Grains/types/crop.input';
import {
  InorganicFertiliserComponentInputTransformed,
  InorganicFertiliserKnownComponentInputTransformed,
  InorganicFertiliserUnknownComponentInputTransformed,
  isInorganicFertiliserKnownComponent,
} from '@/modules/scope1/5-fertiliser/inorganic-fertiliser-components.input';
import {
  InorganicFertiliserInputScope3Method1Transformed,
  InorganicFertiliserInputScope3Method2Transformed,
  isInorganicFertiliserInputScope3Method2,
} from '@/modules/scope1/5-fertiliser/inorganic-fertiliser.input';
import { selectConstant } from '@/tools/constants';
import { sum } from '@/tools/sum';
import { massPerMass } from '@/tools/units';

export const calculateScope3FertiliserMethod1EmissionsFactor = (
  fertiliser: InorganicFertiliserInputScope3Method1Transformed,
  context: ExecutionContext<ConstantsForGrainsCalculator>,
) => {
  /*
    15.4.1.1 Method 1 -- Purchased Fertiliser
    (1) Emissions from purchased fertiliser E (t CO2e) are estimated as the sum of
    embedded emissions of all purchased inorganic fertilisers as:
    E = SUMf SUMj TM jf * EF f
    Where TMjf = quantity of inorganic fertiliser type f purchased and applied to
    production system j (t) (calculated in Section 5.1.1)
    EF f = emission factor of purchased inorganic fertiliser (kg CO2e/kg)
    */
  const { constants } = context;
  const tmjf = fertiliser.massAppliedKg;
  const ef = selectConstant(
    constants.CROP,
    (val) => massPerMass('CO2e', 'Inorganic Fertiliser', val),
    'INORGANIC_FERTILISER_FRACTIONS',
    fertiliser.fertiliserType,
    'Scope3EF',
  );
  const e = tmjf.multiply(ef, {
    name: 'E fertiliser',
    references: ['15.4.1.1 (314)'],
  });
  return e;
};

const emissionsFactorForComponent = (
  component: InorganicFertiliserComponentInputTransformed,
  context: ExecutionContext<ConstantsForGrainsCalculator>,
) => {
  const { constants } = context;
  if (isInorganicFertiliserKnownComponent(component)) {
    if (isInorganicFertiliserComponentTypeRegional(component.componentType)) {
      return selectConstant(
        constants.CROP,
        (val) => massPerMass('CO2e', 'Inorganic Fertiliser', val),
        'INORGANIC_FERTILISER_FRACTIONS_BY_REGION',
        component.componentType,
        component.componentOrigin,
      );
    } else {
      return selectConstant(
        constants.CROP,
        (val) => massPerMass('CO2e', 'Inorganic Fertiliser', val),
        'INORGANIC_FERTILISER_FRACTIONS_BY_NON_REGIONAL',
        component.componentType,
      );
    }
  } else {
    return component.emissionFactor;
  }
};

export const calculateScope3FertiliserMethod1KnownComponent = (
  fertiliser: InorganicFertiliserInputScope3Method1Transformed,
  component: InorganicFertiliserKnownComponentInputTransformed,
  context: ExecutionContext<ConstantsForGrainsCalculator>,
) => {
  const fcf = component.fractionOfFertiliser;
  const tmjf = fertiliser.massAppliedKg;
  const efc = emissionsFactorForComponent(component, context);
  return fcf.multiply(tmjf).multiply(efc);
};

export const calculateScope3FertiliserMethod1UnknownComponent = (
  fertiliser: InorganicFertiliserInputScope3Method1Transformed,
  component: InorganicFertiliserUnknownComponentInputTransformed,
) => {
  const fcf = component.fractionOfFertiliser;
  const tmjf = fertiliser.massAppliedKg;
  const efc = component.emissionFactor;
  return fcf.multiply(tmjf).multiply(efc);
};

export const calculateScope3FertiliserMethod1Components = (
  fertiliser: InorganicFertiliserInputScope3Method1Transformed,
  components: InorganicFertiliserComponentInputTransformed[],
  context: ExecutionContext<ConstantsForGrainsCalculator>,
) => {
  /*
  Where emission factors for the purchased fertiliser are not available, the emissions can be
  estimated using the approach from Horticulture Australia Ltd [13], which estimates the
  embedded emissions in the fertiliser based on the embedded emissions of each of the
  individual components contained in the fertiliser.
  (1) Emissions from purchased fertiliser E (t CO2e) are estimated as the sum of the emissions from all of its components as:
  E = SUMf SUMc SUMj (F cf * TM jf * EF c)
  Where F cf = fraction of component c contained within the inorganic fertiliser f (wt%)
  EF c = emission factor for the production of component (kg CO2e/kg component)
  */
  const componentEmissions = components.map((component) => {
    if (isInorganicFertiliserKnownComponent(component)) {
      return calculateScope3FertiliserMethod1KnownComponent(
        fertiliser,
        component,
        context,
      );
    } else {
      return calculateScope3FertiliserMethod1UnknownComponent(
        fertiliser,
        component,
      );
    }
  });
  return sum(componentEmissions);
};

export const calculateScope3FertiliserMethod1 = (
  fertiliser: InorganicFertiliserInputScope3Method1Transformed,
  context: ExecutionContext<ConstantsForGrainsCalculator>,
) => {
  if (fertiliser.components) {
    return calculateScope3FertiliserMethod1Components(
      fertiliser,
      fertiliser.components,
      context,
    );
  } else {
    return calculateScope3FertiliserMethod1EmissionsFactor(fertiliser, context);
  }
};

export const calculateScope3FertiliserMethod2 = (
  fertiliser: InorganicFertiliserInputScope3Method2Transformed,
) => {
  /*
  15.4.1.2 Method 2 -- Purchased Fertiliser
  Method 2 is the same as Method 1, except that a verified supplier-provided value for EF f is required.
  */
  const tmjf = fertiliser.massAppliedKg;
  const ef = fertiliser.customScope3EmissionFactor;
  const e = tmjf.multiply(ef).attachContext({ references: ['15.4.1.2 (342)'] });
  return e;
};

export const calculateScope3Fertiliser = (
  crop: GrainsCropTransformed,
  context: ExecutionContext<ConstantsForGrainsCalculator>,
) => {
  const fertilisers = crop.inorganicFertilisers;

  const emissionsRecords = fertilisers.applications.map((fertiliser) => {
    if (isInorganicFertiliserInputScope3Method2(fertiliser)) {
      return calculateScope3FertiliserMethod2(fertiliser);
    } else {
      return calculateScope3FertiliserMethod1(fertiliser, context);
    }
  });

  return sum(emissionsRecords);
};
