import { ConstantsForGrainsCalculator } from '@/calculators/Grains/constants';
import { ExecutionContext } from '@/calculators/Grains/constants/executionContext';
import { constant } from '@/tools/constants';
import { sum } from '@/tools/sum';
import { massPerMass, realNumber } from '@/tools/units';
import Decimal from 'decimal.js-light';
import { LimeInputTransformed } from './lime.input';

const calculateLimeCO2 = (
  input: LimeInputTransformed,
  context: ExecutionContext<ConstantsForGrainsCalculator>,
) => {
  const { constants } = context;
  /*
    5.3.1.1 Lime Application CO2 Emissions - Method 1
    (1) The emissions from the application of lime and dolomite to production systems
    Elime (t CO2) is calculated as:
    Elime = [(Mlime * FracLime * Plime * EF lime) + (Mlime * FracDol * Pdol * EF dol)] * CCO2
    * 10^-3
    Where Mlime = the total mass of lime applied to production system (kg)
    FracLime = the fraction of lime as limestone (CaCO3) (dimensionless)
    Plime = fractional purity of limestone (dimensionless)
    EF lime = emission factor for limestone fraction of lime (kg C/kg)
    FracDol = the fraction of lime as dolomite (dimensionless)
    Pdol = fractional purity of dolomite (dimensionless)
    EF dol = emission factor for dolomite fraction of lime (kg C/kg)
    CCO2= factor to convert elemental mass of carbon dioxide to molecular mass
    (dimensionless)
    */
  const mlime = input.limestone;
  const fracLime = input.limestoneFraction;
  const plime = constant(
    'P Lime',
    realNumber(constants.COMMON.LIMING.SCOPE1.LIMESTONE_FRACTIONPURITY),
  );
  const efLime = constant(
    'EF Lime',
    massPerMass(
      'CO2',
      'Lime',
      new Decimal(constants.COMMON.LIMING.SCOPE1.LIMESTONE_EF),
    ),
  );
  const fracDol = input.dolomiteFraction;
  const pdol = constant(
    'P Dol',
    realNumber(constants.COMMON.LIMING.SCOPE1.DOLOMITE_FRACTIONPURITY),
  );
  const efDol = constant(
    'EF Dol',
    massPerMass(
      'CO2',
      'Lime',
      new Decimal(constants.COMMON.LIMING.SCOPE1.DOLOMITE_EF),
    ),
  );
  const cco2 = constant('C CO2', realNumber(constants.COMMON.GWP_FACTORSC18));

  const limePart = mlime.multiply(fracLime).multiply(plime).multiply(efLime);
  const dolomitePart = mlime.multiply(fracDol).multiply(pdol).multiply(efDol);
  const elime = sum([limePart, dolomitePart]).multiply(cco2, {
    name: 'E Lime',
    references: [`5.3.1.1 (279)`],
  });

  return elime;
};

export const calculate53Lime = (
  input: LimeInputTransformed,
  context: ExecutionContext<ConstantsForGrainsCalculator>,
) => {
  return calculateLimeCO2(input, context);
};
