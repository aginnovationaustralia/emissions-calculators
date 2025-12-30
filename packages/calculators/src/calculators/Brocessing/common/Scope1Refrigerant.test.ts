import { RefrigerantInputTransformed } from '@/types/refrigerant.input';
import Decimal from 'decimal.js-light';
import { ExecutionContext } from '../../executionContext';
import { input } from '../types/inputs';
import { mass, massCO2ePerMassRefrigerant } from '../types/units';
import { calculateScope1Refrigerant } from './Scope1Refrigerant';

// Helper to create mock refrigerant inputs matching RefrigerantInputTransformed
const createRefrigerantInput = (
  refrigerant: RefrigerantInputTransformed['refrigerant']['unit'],
  chargeSizeKg: number,
): RefrigerantInputTransformed => ({
  refrigerant: input(`REFRIGERANT[${refrigerant}]`, refrigerant),
  chargeSize: input(
    `CHARGE_SIZE[${refrigerant}]`,
    mass('Refrigerant', new Decimal(chargeSizeKg)),
  ),
});

// Create mock constants with the ConstantSelectionSource structure
const createMockConstants = () => ({
  COMMON: {
    REFRIGERANT_GWP: {
      unit: massCO2ePerMassRefrigerant(),
      values: {
        'HFC-152a': new Decimal(138),
        'HFC-134a': new Decimal(1300),
        'HFC-23': new Decimal(12400),
      } as Record<string, Decimal>,
    },
  },
});

const createMockContext = (): ExecutionContext => ({
  calculator: 'test',
  version: '1.0.0',
  timestamp: new Date().toISOString(),
  constants: createMockConstants() as unknown as ExecutionContext['constants'],
});

describe('calculateScope1Refrigerant', () => {
  describe('output structure', () => {
    it('returns an output with scope 1 and correct name', () => {
      const refrigerants = [createRefrigerantInput('HFC-152a', 200)];
      const context = createMockContext();

      const result = calculateScope1Refrigerant(refrigerants, context);

      expect(result.scope).toBe(1);
      expect(result.name).toBe('hfcsRefrigerantLeakage');
    });

    it('has a value property that is a Decimal', () => {
      const refrigerants = [createRefrigerantInput('HFC-152a', 200)];
      const context = createMockContext();

      const result = calculateScope1Refrigerant(refrigerants, context);

      expect(result.value).toBeInstanceOf(Decimal);
    });

    it('has an amountCO2e property that is a Decimal', () => {
      const refrigerants = [createRefrigerantInput('HFC-152a', 200)];
      const context = createMockContext();

      const result = calculateScope1Refrigerant(refrigerants, context);

      expect(result.amountCO2e).toBeInstanceOf(Decimal);
    });
  });

  describe('from (origin) structure', () => {
    it('has a sum origin type at the top level', () => {
      const refrigerants = [createRefrigerantInput('HFC-152a', 200)];
      const context = createMockContext();

      const result = calculateScope1Refrigerant(refrigerants, context);

      expect(result.from.originType).toBe('sum');
    });

    it('has unit with substance CO2e at the top level', () => {
      const refrigerants = [createRefrigerantInput('HFC-152a', 200)];
      const context = createMockContext();

      const result = calculateScope1Refrigerant(refrigerants, context);

      expect(result.from.unit).toMatchObject({
        __unitType: 'Mass',
        substance: 'CO2e',
      });
    });

    it('contains array of binary multiply operations for each refrigerant', () => {
      const refrigerants = [
        createRefrigerantInput('HFC-152a', 200),
        createRefrigerantInput('HFC-134a', 100),
      ];
      const context = createMockContext();

      const result = calculateScope1Refrigerant(refrigerants, context);

      expect(result.from.originType).toBe('sum');
      if (result.from.originType === 'sum') {
        expect(result.from.from.items).toHaveLength(2);
        expect(result.from.from.items[0].originType).toBe('binary');
        expect(result.from.from.items[1].originType).toBe('binary');
      }
    });
  });

  describe('multiply operation structure', () => {
    it('has left operand as constant_selection for GWP factor', () => {
      const refrigerants = [createRefrigerantInput('HFC-152a', 200)];
      const context = createMockContext();

      const result = calculateScope1Refrigerant(refrigerants, context);

      if (result.from.originType === 'sum') {
        const multiplyOp = result.from.from.items[0];
        if (multiplyOp.originType === 'binary') {
          expect(multiplyOp.left.originType).toBe('constant_selection');
        }
      }
    });

    it('has right operand as root input for charge size', () => {
      const refrigerants = [createRefrigerantInput('HFC-152a', 200)];
      const context = createMockContext();

      const result = calculateScope1Refrigerant(refrigerants, context);

      if (result.from.originType === 'sum') {
        const multiplyOp = result.from.from.items[0];
        if (multiplyOp.originType === 'binary') {
          expect(multiplyOp.right.originType).toBe('root');
          if (multiplyOp.right.originType === 'root') {
            expect(multiplyOp.right.valueType).toBe('input');
            if (multiplyOp.right.valueType === 'input') {
              expect(multiplyOp.right.name).toBe('CHARGE_SIZE[HFC-152a]');
            }
          }
        }
      }
    });

    it('multiply has type "multiply"', () => {
      const refrigerants = [createRefrigerantInput('HFC-152a', 200)];
      const context = createMockContext();

      const result = calculateScope1Refrigerant(refrigerants, context);

      if (result.from.originType === 'sum') {
        const multiplyOp = result.from.from.items[0];
        if (multiplyOp.originType === 'binary') {
          expect(multiplyOp.type).toBe('multiply');
        }
      }
    });
  });

  describe('constant_selection structure', () => {
    it('has correct sourceName for REFRIGERANT_GWP', () => {
      const refrigerants = [createRefrigerantInput('HFC-152a', 200)];
      const context = createMockContext();

      const result = calculateScope1Refrigerant(refrigerants, context);

      if (result.from.originType === 'sum') {
        const multiplyOp = result.from.from.items[0];
        if (
          multiplyOp.originType === 'binary' &&
          multiplyOp.left.originType === 'constant_selection'
        ) {
          expect(multiplyOp.left.selectors).toBe(['REFRIGERANT_GWP']);
        }
      }
    });

    it('has selector with the refrigerant input as root origin', () => {
      const refrigerants = [createRefrigerantInput('HFC-152a', 200)];
      const context = createMockContext();

      const result = calculateScope1Refrigerant(refrigerants, context);

      if (result.from.originType === 'sum') {
        const multiplyOp = result.from.from.items[0];
        if (
          multiplyOp.originType === 'binary' &&
          multiplyOp.left.originType === 'constant_selection'
        ) {
          const selectors = multiplyOp.left.selectors;
          expect(selectors).toHaveLength(2);
          expect(selectors[0]).toBe('REFRIGERANT_GWP');
          expect(selectors[1]).toBe('HFC-152a');
        } else {
          throw new Error(
            'multiplyOp.left.originType is not constant_selection',
          );
        }
      } else {
        throw new Error('result.from.originType is not sum');
      }
    });

    it('has name that combines source and selector', () => {
      const refrigerants = [createRefrigerantInput('HFC-134a', 100)];
      const context = createMockContext();

      const result = calculateScope1Refrigerant(refrigerants, context);

      if (result.from.originType === 'sum') {
        const multiplyOp = result.from.from.items[0];
        if (
          multiplyOp.originType === 'binary' &&
          multiplyOp.left.originType === 'constant_selection'
        ) {
          if (multiplyOp.left.valueType === 'constant') {
            expect(multiplyOp.left.name).toBe('REFRIGERANT_GWP[HFC-134a]');
          } else {
            throw new Error('multiplyOp.left.valueType is not constant');
          }
        }
      }
    });
  });

  describe('calculation values', () => {
    it('calculates correct value for single refrigerant', () => {
      // HFC-152a has GWP of 138, charge size of 200kg
      // Expected: 138 * 200 = 27600 kg CO2e
      const refrigerants = [createRefrigerantInput('HFC-152a', 200)];
      const context = createMockContext();

      const result = calculateScope1Refrigerant(refrigerants, context);

      expect(result.value.toNumber()).toBe(27600);
    });

    it('calculates correct value for multiple refrigerants', () => {
      // HFC-152a: 138 * 200 = 27600
      // HFC-134a: 1300 * 100 = 130000
      // Total: 157600 kg CO2e
      const refrigerants = [
        createRefrigerantInput('HFC-152a', 200),
        createRefrigerantInput('HFC-134a', 100),
      ];
      const context = createMockContext();

      const result = calculateScope1Refrigerant(refrigerants, context);

      expect(result.value.toNumber()).toBe(157600);
    });

    it('returns zero for empty refrigerant list', () => {
      const refrigerants: ReturnType<typeof createRefrigerantInput>[] = [];
      const context = createMockContext();

      const result = calculateScope1Refrigerant(refrigerants, context);

      expect(result.value.toNumber()).toBe(0);
    });
  });

  describe('snapshot', () => {
    it('matches expected structure for typical input', () => {
      const refrigerants = [
        createRefrigerantInput('HFC-152a', 200),
        createRefrigerantInput('HFC-134a', 100),
      ];
      const context = createMockContext();

      const result = calculateScope1Refrigerant(refrigerants, context);

      // Remove volatile timestamp-like values and Decimal instances for snapshot
      const sanitizedResult = JSON.parse(
        JSON.stringify(result, (key, value) => {
          if (value instanceof Decimal) {
            return `Decimal(${value.toString()})`;
          }
          return value;
        }),
      );

      expect(sanitizedResult).toMatchSnapshot();
    });
  });
});
