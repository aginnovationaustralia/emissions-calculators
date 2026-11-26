import { testContext } from '@/test/Grains/context';
import { nv } from '@/tools/inputs';
import { calculateElectricityScope2 } from '../scope2/14-electricity/calculate';
import {
  ElectricityInputsSchema,
  ElectricityInputsTransformed,
} from '../scope2/14-electricity/electricity.input';
import {
  MarketBasedACTElectricityInputs,
  MarketBasedNonACTElectricityInputs,
} from '../scope2/14-electricity/market-based.input';
import { calculateElectricityScope3 } from '../scope3/15.11-electricity';

const DEFAULT_RPP = 0.1667;
const DEFAULT_JRPP = 0.7613;

const baseInput = {
  method: 'market',
  electricityPurchasedKilowattHours: nv(1000),
  recsSurrenderedMegawattHours: nv(0),
  recsOnsiteMegawattHours: nv(0),
} as const;

const marketInput = (
  overrides: Partial<MarketBasedNonACTElectricityInputs> = {},
): ElectricityInputsTransformed =>
  ElectricityInputsSchema.parse({
    ...baseInput,
    region: 'NSW',
    ...overrides,
  } satisfies MarketBasedNonACTElectricityInputs);

const actMarketInput = (
  overrides: Partial<MarketBasedACTElectricityInputs> = {},
): ElectricityInputsTransformed =>
  ElectricityInputsSchema.parse({
    ...baseInput,
    region: 'ACT',
    ...overrides,
  } satisfies MarketBasedACTElectricityInputs);

const calculators = [
  ['14.1 scope 2', calculateElectricityScope2],
  ['15.11 scope 3', calculateElectricityScope3],
] as const;

describe.each(calculators)(
  'Electricity %s market-based RPP and JRPP inputs',
  (_, calculate) => {
    const context = testContext();
    const result = (input: ElectricityInputsTransformed) =>
      calculate(input, context).unit.store.value.toNumber();

    it('uses the supplied RPP instead of the built-in constant', () => {
      const defaultResult = result(marketInput());
      const overrideResult = result(
        marketInput({ renewablePowerPercentage: nv(20) }),
      );

      expect(overrideResult / defaultResult).toBeCloseTo(
        (1 - 0.2) / (1 - DEFAULT_RPP),
        8,
      );
    });

    it('uses the supplied JRPP for the ACT', () => {
      const defaultResult = result(actMarketInput());
      const overrideResult = result(
        actMarketInput({
          renewablePowerPercentage: nv(10),
          jurisdictionalRenewablePowerPercentage: nv(50),
        }),
      );

      expect(overrideResult / defaultResult).toBeCloseTo(
        (1 - 0.6) / (1 - (DEFAULT_RPP + DEFAULT_JRPP)),
        8,
      );
    });

    it('rejects a JRPP outside the ACT', () => {
      expect(() =>
        ElectricityInputsSchema.parse({
          ...baseInput,
          region: 'NSW',
          jurisdictionalRenewablePowerPercentage: nv(50),
        }),
      ).toThrow();
    });

    it('applies the built-in JRPP only in the ACT', () => {
      expect(result(actMarketInput()) / result(marketInput())).toBeCloseTo(
        (1 - (DEFAULT_RPP + DEFAULT_JRPP)) / (1 - DEFAULT_RPP),
        8,
      );
    });

    it('rejects percentages outside 0 to 100', () => {
      expect(() =>
        marketInput({ renewablePowerPercentage: nv(101) }),
      ).toThrow();
      expect(() =>
        actMarketInput({ jurisdictionalRenewablePowerPercentage: nv(-1) }),
      ).toThrow();
    });
  },
);
