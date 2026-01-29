import { ExecutionContext } from '@/calculators/executionContext';
import { ConstantsForGrainsCalculator } from '@/calculators/Grains/constants';
import { constant } from '@/tools/constants';
import { RootContainer } from '@/tools/origins';
import { oneMinus } from '@/tools/sentinels';
import { sum } from '@/tools/sum';
import { mass, massPerMass, realNumber } from '@/tools/units';
import Decimal from 'decimal.js-light';
import { CropResidueInputTransformed } from '../scope1ResidueManagement/crop-residue.input';
import { FertiliserInputTransformed } from './fertiliser.input';
import { LimeInputTransformed } from './lime.input';

const calculateScope1FertiliserUreaCO2 = (
  input: FertiliserInputTransformed & CropResidueInputTransformed,
  constants: ConstantsForGrainsCalculator,
) => {
  // 5.1.1.1
  // ureaCO2
  // 147: E_j,f,CO2 = MU_j,f × EF_urea,CO2 × Cg,CO2 × 10^-3
  const mujf = input.ureaApplication.multiply(input.areaSown, {
    name: 'MUjf',
    references: [`5.1.1.1 (157)`],
  });

  const efUreaCO2 = constant(
    'EF Urea CO2',
    massPerMass(
      'CO2e',
      'Urea',
      new Decimal(constants.COMMON.UREA_FERTILISER_GHG),
    ),
  );

  const cgCO2 = constant(
    'Cg CO2',
    massPerMass('CO2', 'CO2e', new Decimal(constants.COMMON.GWP_FACTORSC13)),
  );

  // 147: E_j,f,CO2 = MU_j,f × EF_urea,CO2 × Cg,CO2 × 10^-3
  const ureaCO2 = mujf.multiply(efUreaCO2).multiply(cgCO2, {
    name: 'Urea CO2',
    references: [`5.1.1.1 (147)`],
  });

  return ureaCO2;
};

const calculateScope1FertiliserLimeCO2 = (
  input: LimeInputTransformed,
  constants: ConstantsForGrainsCalculator,
) => {
  /*
  5.3.1.1 Lime Application CO2 Emissions – Method 1
  (1) The emissions from the application of lime and dolomite to production systems
  𝐸𝑙𝑖𝑚𝑒 (t CO2) is calculated as:
  𝐸𝑙𝑖𝑚𝑒 = [(𝑀𝑙𝑖𝑚𝑒 × 𝐹𝑟𝑎𝑐𝐿𝑖𝑚𝑒 × 𝑃𝑙𝑖𝑚𝑒 × 𝐸𝐹 𝑙𝑖𝑚𝑒) + (𝑀𝑙𝑖𝑚𝑒 × 𝐹𝑟𝑎𝑐𝐷𝑜𝑙 × 𝑃𝑑𝑜𝑙 × 𝐸𝐹 𝑑𝑜𝑙)] × 𝐶𝐶𝑂2
  × 10−3
  Where 𝑀𝑙𝑖𝑚𝑒 = the total mass of lime applied to production system (kg)
  𝐹𝑟𝑎𝑐𝐿𝑖𝑚𝑒 = the fraction of lime as limestone (CaCO3) (dimensionless)
  𝑃𝑙𝑖𝑚𝑒 = fractional purity of limestone (dimensionless)
  𝐸𝐹 𝑙𝑖𝑚𝑒 = emission factor for limestone fraction of lime (kg C/kg)
  𝐹𝑟𝑎𝑐𝐷𝑜𝑙 = the fraction of lime as dolomite (dimensionless)
  𝑃𝑑𝑜𝑙 = fractional purity of dolomite (dimensionless)
  𝐸𝐹 𝑑𝑜𝑙 = emission factor for dolomite fraction of lime (kg C/kg)
  𝐶𝐶𝑂2= factor to convert elemental mass of carbon dioxide to molecular mass
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
  const fracDol = oneMinus(fracLime);
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
  const cco2 = constant(
    'C CO2',
    massPerMass('CO2', 'CO2e', new Decimal(constants.COMMON.GWP_FACTORSC18)),
  );
  const elime = sum([
    mlime.multiply(fracLime).multiply(plime).multiply(efLime),
    mlime.multiply(fracDol).multiply(pdol).multiply(efDol),
  ]).multiply(cco2, {
    name: 'E Lime',
    references: [`5.3.1.1 (279)`],
  });

  return elime;
};

export const calculateScope1FertiliserUse = (
  input: FertiliserInputTransformed &
    CropResidueInputTransformed &
    LimeInputTransformed,
  context: ExecutionContext<ConstantsForGrainsCalculator>,
) => {
  const { constants } = context;

  const zeroN2O = new RootContainer(mass('N2O', new Decimal(0)), {
    name: 'zero',
    valueType: 'constant',
  });
  const fertiliserN2O = zeroN2O;
  const atmosphericDepositionN2O = zeroN2O;
  const leachingAndRunoffN2O = zeroN2O;

  return {
    ureaCO2: calculateScope1FertiliserUreaCO2(input, constants),
    limeCO2: calculateScope1FertiliserLimeCO2(input, constants),
    fertiliserN2O,
    atmosphericDepositionN2O,
    leachingAndRunoffN2O,
  };
};
