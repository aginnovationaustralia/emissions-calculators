import { RefrigerantInput } from '@/types/refrigerant.input';
import { Decimal } from 'decimal.js-light';
import { ExecutionContext } from '../../executionContext';
import { constant } from '../types/constants';
import { input } from '../types/inputs';
import { binaryOperation } from '../types/operations';
import { Output, scope1Output } from '../types/output';
import { sum } from '../types/sum';
import { KgCO2ePerKgRefrigerant, MassKg } from '../types/values';
import { variable } from '../types/variable';

export function calculateScope1Refrigerant(
  refrigerants: RefrigerantInput[],
  context: ExecutionContext,
): Output<1> {
  const { constants } = context;

  // resulting units is tonnes CO2e
  const amounts = refrigerants.map(({ refrigerant, chargeSize }) => {
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

    return co2eFromRefrigerant;
  });

  const totalTCO2eFromRefrigerant = sum(amounts);

  return scope1Output(
    'hfcsRefrigerantLeakage',
    totalTCO2eFromRefrigerant,
    'CO2',
  );
}

/*

Inputs = 200kg 'HFC-152a', 100kg 'HFC-134a'

hfcsRefrigerantLeakage
 = sum(138 kg CO2e/kg * 200kg, 1300 kg CO2e/kg * 100kg) / 1000 = 
 = sum(138 kg CO2e/kg * 200kg, 1300 kg CO2e/kg * 100kg) / 1000
 = sum(REFRIGERANT_GWP[HFC-152a] * 200kg, REFRIGERANT_GWP[HFC-134a] * 100kg) / 1000
 = SUM(REFRIGERANT_GWP[HFC-152a] * CHARGE_SIZE[HFC-152a], REFRIGERANT_GWP[HFC-134a] * CHARGE_SIZE[HFC-134a])


 = SUM(138 kg CO2e/kg * 200kg, 1300 kg CO2e/kg * 100kg) / 1000
 = SUM(REFRIGERANT_GWP[HFC-152a] * CHARGE_SIZE[HFC-152a], REFRIGERANT_GWP[HFC-134a] * CHARGE_SIZE[HFC-134a])

 = 
*/

const expressionTree = {
  valueType: 'intermediate',
  unit: 't CO2e',
  value: 151.6,
  from: {
    type: 'conversion',
    previousUnit: 'kg CO2e',
    newUnit: 't CO2e',
    newValue: 151.6,
    operation: {
      type: 'divide',
      by: 1000,
    },
    from: {
      valueType: 'intermediate',
      unit: 'kg CO2e',
      value: 151600,
      from: {
        type: 'sum',
        from: [
          {
            type: 'multiply',
            unit: 'kg CO2e',
            value: 138 * 200,
            left: {
              valueType: 'constant',
              name: 'REFRIGERANT_GWP[HFC-152a]',
              value: 138,
              unit: 'kg CO2e/kg',
              from: {
                type: 'constant_selection',
                constants: {
                  name: 'REFRIGERANT_GWP',
                },
                selection: {
                  valueType: 'input',
                  name: 'REFRIGERANT[HFC-152a]',
                  value: 'HFC-152a',
                },
              },
            },
            right: {
              valueType: 'input',
              name: 'CHARGE_SIZE[HFC-152a]',
              value: 200,
              unit: 'kg',
            },
          },
          {
            type: 'multiply',
            unit: 'kg CO2e',
            value: 1300 * 100,
            left: {
              valueType: 'constant',
              name: 'REFRIGERANT_GWP[HFC-134a]',
              value: 1300,
              unit: 'kg CO2e/kg',
              from: {
                type: 'selected',
                constants: {
                  name: 'REFRIGERANT_GWP',
                },
                selection: {
                  valueType: 'input',
                  name: 'REFRIGERANT[HFC-134a]',
                  value: 'HFC-152a',
                },
              },
            },
            right: {
              valueType: 'input',
              name: 'CHARGE_SIZE[HFC-134a]',
              value: 100,
              unit: 'kg',
            },
          },
        ],
      },
    },
  },
};

const output = {
  valueType: 'output',
  scope: 1,
  name: 'hfcsRefrigerantLeakage',
  substance: 'hfcs',
  unit: 't CO2e',
  value: 151.6,
  from: expressionTree,
};
