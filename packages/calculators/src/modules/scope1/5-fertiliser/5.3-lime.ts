import { ExecutionContext } from '@/calculators/executionContext';
import { selectConstant } from '@/tools/constants';
import { oneMinus, zeroMassCarbon, zeroMassLime } from '@/tools/sentinels';
import { sum } from '@/tools/sum';
import { limeApplicationIsNotGypsum } from './lime-application.input';
import { HasLimeInputTransformed } from './lime.input';

const calculateLimeCO2 = (
  input: HasLimeInputTransformed,
  context: ExecutionContext,
) => {
  const { constants } = context;
  /*
    5.3.1.1 Lime Application CO2 Emissions - Method 1
    (1) The emissions from the application of lime and dolomite to production systems
    Elime (t CO2) is calculated as:
    Elime = [(Mlime * FracLime * Plime * EF lime) + (Mlime * (1 - FracLime) * Pdol * EF dol)] * CCO2 * 10^-3

    Where Mlime = the total mass of lime applied to production system (kg)
    FracLime = the fraction of lime as limestone (CaCO3) (dimensionless)
    Plime = fractional purity of limestone (dimensionless)
    EF lime = emission factor for limestone fraction of lime (kg C/kg)
    Pdol = fractional purity of dolomite (dimensionless)
    EF dol = emission factor for dolomite fraction of lime (kg C/kg)
    CCO2 = factor to convert elemental mass of carbon dioxide to molecular mass
    (dimensionless)
    */
  const { lime } = input;
  const { applications } = lime;

  const hasCountableLime = applications.filter(limeApplicationIsNotGypsum);

  const mlime = sum(
    hasCountableLime.map((a) => a.massAppliedKg),
    zeroMassLime,
  ).named('Mlime');
  const totalLimestone = sum(
    hasCountableLime.map((a) => a.massAppliedKg.multiply(a.limestoneFraction)),
    zeroMassLime,
  ).named('Total Limestone');

  const fracLime = totalLimestone.divide(mlime).named('FracLime');
  const plime = selectConstant(constants.COMMON, 'LIMING', 'LIMESTONE_PURITY');
  const efLime = selectConstant(constants.COMMON, 'LIMING', 'LIMESTONE_EF');
  const pdol = selectConstant(constants.COMMON, 'LIMING', 'DOLOMITE_PURITY');
  const efDol = selectConstant(constants.COMMON, 'LIMING', 'DOLOMITE_EF');
  const cco2 = selectConstant(constants.COMMON, 'ELEMENTAL_TO_MOLECULAR_CO2');

  const limePart = mlime.multiply(fracLime).multiply(plime).multiply(efLime);
  const dolomitePart = mlime
    .multiply(oneMinus(fracLime))
    .multiply(pdol)
    .multiply(efDol);
  const elime = sum([limePart, dolomitePart], zeroMassCarbon).multiply(cco2, {
    name: 'E Lime',
    references: [`5.3.1.1 (1)`],
  });

  return elime;
};

export const calculate53Lime = (
  input: HasLimeInputTransformed,
  context: ExecutionContext,
) => {
  return calculateLimeCO2(input, context);
};
