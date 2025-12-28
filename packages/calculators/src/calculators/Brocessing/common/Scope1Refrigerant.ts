import { RefrigerantInputTransformed } from '@/types/refrigerant.input';
import { ExecutionContext } from '../../executionContext';
import { selectConstant } from '../types/constants';
import { multiply } from '../types/multiply';
import { Origin } from '../types/origins';
import { Output, scope1Output } from '../types/output';
import { Mass, mass, UnitArray } from '../types/overloads';
import { sum } from '../types/sum';

export function calculateScope1Refrigerant(
  refrigerants: RefrigerantInputTransformed[],
  context: ExecutionContext,
): Output<1, 'CO2e'> {
  const { constants } = context;

  const amounts = refrigerants.map(({ refrigerant, chargeSize }) => {
    const factor = selectConstant(
      constants.COMMON,
      'REFRIGERANT_GWP',
      refrigerant,
    );

    const result: Origin<Mass<'CO2e'>> = multiply(factor, chargeSize);
    return result;
  });

  const array: UnitArray<Mass<'CO2e'>> = {
    items: amounts,
    unit: mass('CO2e'), // TODO: This is needed to keep empty arrays typed. It would be error prone. Is there a better way to do this?
  };

  const massCO2eFromRefrigerant = sum(array);

  return scope1Output('hfcsRefrigerantLeakage', massCO2eFromRefrigerant);
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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const output = {
  valueType: 'output',
  scope: 1,
  name: 'hfcsRefrigerantLeakage',
  substance: 'hfcs',
  unit: 't CO2e',
  value: 151.6,
  from: expressionTree,
};

// const expressionTreeAnnotated = {
//   valueType: 'intermediate',
//   unit: 't CO2e',
//   value: 151.6,
//   from: {
//     type: 'conversion',
//     previousUnit: 'kg CO2e',
//     newUnit: 't CO2e',
//     newValue: 151.6,
//     operation: {
//       type: 'divide',
//       by: 1000,
//     },
//     from: {
//       valueType: 'intermediate',
//       unit: 'kg CO2e',
//       value: 151600,
//       from: {
//         type: 'sum',
//         from: [
//           {
//             type: 'multiply',
//             unit: 'kg CO2e',
//             value: 138 * 200,
//             left: {
//               // ConstantSelectionOrigin
//               valueType: 'constant',
//               name: 'REFRIGERANT_GWP[HFC-152a]',
//               // value: 138,
//               // unit: 'kg CO2e/kg',
//               unit: new KgCO2ePerKgRefrigerant(new Decimal(138)),
//               originType: 'constant_selection',
//               sourceName: 'REFRIGERANT_GWP',
//               selector: {
//                 // Input, RootOrigin
//                 valueType: 'input',
//                 name: 'REFRIGERANT[HFC-152a]',
//                 unit: 'HFC-152a',
//               },
//             },
//             right: {
//               valueType: 'input',
//               name: 'CHARGE_SIZE[HFC-152a]',
//               value: 200,
//               unit: 'kg',
//             },
//           },
//           {
//             type: 'multiply',
//             unit: 'kg CO2e',
//             value: 1300 * 100,
//             left: {
//               valueType: 'constant',
//               name: 'REFRIGERANT_GWP[HFC-134a]',
//               value: 1300,
//               unit: 'kg CO2e/kg',
//               from: {
//                 type: 'selected',
//                 constants: {
//                   name: 'REFRIGERANT_GWP',
//                 },
//                 selection: {
//                   valueType: 'input',
//                   name: 'REFRIGERANT[HFC-134a]',
//                   value: 'HFC-152a',
//                 },
//               },
//             },
//             right: {
//               valueType: 'input',
//               name: 'CHARGE_SIZE[HFC-134a]',
//               value: 100,
//               unit: 'kg',
//             },
//           },
//         ],
//       },
//     },
//   },
// };
