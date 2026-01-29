import { ExecutionContext } from '@/calculators/executionContext';
import { ConstantsForGrainsCalculator } from '@/calculators/Grains/constants';
import { constant } from '@/tools/constants';
import { RootContainer } from '@/tools/origins';
import { mass, massPerMass } from '@/tools/units';
import Decimal from 'decimal.js-light';
import { CropResidueInputTransformed } from '../scope1ResidueManagement/crop-residue.input';
import { FertiliserInputTransformed } from './fertiliser.input';

export const calculateScope1FertiliserUse = (
  input: FertiliserInputTransformed & CropResidueInputTransformed,
  context: ExecutionContext<ConstantsForGrainsCalculator>,
) => {
  const { constants } = context;

  const zeroCO2 = new RootContainer(mass('CO2', new Decimal(0)), {
    name: 'zero',
    valueType: 'constant',
  });
  const zeroN2O = new RootContainer(mass('N2O', new Decimal(0)), {
    name: 'zero',
    valueType: 'constant',
  });
  const limeCO2 = zeroCO2;
  const fertiliserN2O = zeroN2O;
  const atmosphericDepositionN2O = zeroN2O;
  const leachingAndRunoffN2O = zeroN2O;

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

  return {
    ureaCO2,
    limeCO2,
    fertiliserN2O,
    atmosphericDepositionN2O,
    leachingAndRunoffN2O,
  };
};
