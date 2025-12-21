import { RefrigerantInput } from '@/types/refrigerant.input';
import { Decimal } from 'decimal.js-light';
import { ExecutionContext } from '../../executionContext';
import { constant } from '../types/constants';
import { input } from '../types/inputs';
import { binaryOperation, transformOperation } from '../types/operations';
import { Output, scope1Output } from '../types/output';
import { KgCO2ePerKgRefrigerant, MassKg } from '../types/values';
import { variable } from '../types/variable';

export function calculateScope1Refrigerant(
  refrigerants: RefrigerantInput[],
  context: ExecutionContext,
): Output<1> {
  const { constants } = context;

  // resulting units is tonnes CO2e
  const amount = refrigerants
    .map(({ refrigerant, chargeSize }) => {
      // chargeSize is in kg
      const factor = new KgCO2ePerKgRefrigerant(
        new Decimal(constants.COMMON.REFRIGERANT_GWP[refrigerant]),
      );
      const constantFactor = constant('factor', factor);

      const inputChargeSize = input(
        'chargeSize',
        new MassKg('Refrigerant', new Decimal(chargeSize)),
      );

      const co2eFromRefrigerant = variable(
        'kgCO2eFromRefrigerant',
        binaryOperation(constantFactor, inputChargeSize, 'toMassKg'),
      );

      return variable(
        'tCO2eFromRefrigerant',
        transformOperation(co2eFromRefrigerant, 'toMassTonnes'),
      );
    })
    .reduce((a, b) => {
      const added = binaryOperation(a, b, 'add');
      return variable('totalCO2eFromRefrigerant', added);
    });

  return scope1Output('hfcsRefrigerantLeakage', { value: () => amount }, 'CO2');
}
