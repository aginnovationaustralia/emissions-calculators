import { calculateScope1And3Fuel } from '../../common/fuel';
import { StationaryFuelInput } from '../../types/stationaryFuel.input';
import { TransportFuelInput } from '../../types/transportFuel.input';
import {
  State,
  StationaryFuelTypes,
  TransportFuelTypes,
} from '../../types/types';
import { testContext, V3_0_0 } from './context';
import { defaultPrecision } from './emissions';

const context = testContext(V3_0_0);

/**
 * The following test cases are designed to cover as many fuel constants at once as possible.
 * If a known constant change occurs, the expected values in these tests will need to be
 * regenerated. This should then catch any 'missed' constant changes.
 */
describe('Fuel Tests', () => {
  describe('Stationary Fuels (inc. Natural Gas)', () => {
    const stationaryFuel: StationaryFuelInput[] = Object.values(
      StationaryFuelTypes,
    ).map((type) => ({
      type,
      amountLitres: 1000000,
    }));
    const fuelInput = {
      stationaryFuel,
      transportFuel: [],
      naturalGas: 1000000,
    };
    const { co2, ch4, n2o, scope3Total } = calculateScope1And3Fuel(
      fuelInput,
      'qld',
      context,
    );
    it('Scope 1 CO2', () => {
      expect(co2).toBeCloseTo(7902.18, defaultPrecision);
    });
    it('Scope 1 CH4', () => {
      expect(ch4).toBeCloseTo(211.002, defaultPrecision);
    });
    it('Scope 1 N2O', () => {
      expect(n2o).toBeCloseTo(51.32, defaultPrecision);
    });
    it('Scope 3', () => {
      expect(scope3Total).toBeCloseTo(2239.36, defaultPrecision);
    });
  });
  describe('Transport fuels', () => {
    const transportFuel: TransportFuelInput[] = Object.values(
      TransportFuelTypes,
    ).map((type) => ({
      type,
      amountLitres: 1000000,
    }));
    const fuelInput = {
      stationaryFuel: [],
      transportFuel,
      naturalGas: 0,
    };
    const { co2, ch4, n2o, scope3Total } = calculateScope1And3Fuel(
      fuelInput,
      'nsw',
      context,
    );
    it('Scope 1 CO2', () => {
      expect(co2).toBeCloseTo(18143.06, defaultPrecision);
    });
    it('Scope 1 CH4', () => {
      expect(ch4).toBeCloseTo(256.224, defaultPrecision);
    });
    it('Scope 1 N2O', () => {
      expect(n2o).toBeCloseTo(248.04, defaultPrecision);
    });
    it('Scope 3', () => {
      expect(scope3Total).toBeCloseTo(4875.86, defaultPrecision);
    });
  });
  describe('Natural Gas', () => {
    const fuelInput = {
      stationaryFuel: [],
      transportFuel: [],
      naturalGas: 1000000,
    };
    /**
     * The best way of testing this in a way that's likely to catch mistakes introduced by
     * constant changes to make sure certain regions match.
     * NT and TAS also 'match', but not for the same logical reasons, so it's not included here.
     */
    describe.each([
      { r1: 'wa_sw', r2: 'wa_nw', scope3: 4.1 },
      { r1: 'nsw', r2: 'act', scope3: 13.1 },
    ])(
      'Regions ($r1 & $r2) are consistent over natural gas',
      ({ r1, r2, scope3 }) => {
        const region1Fuel = calculateScope1And3Fuel(
          fuelInput,
          r1 as State,
          context,
        );
        const region2Fuel = calculateScope1And3Fuel(
          fuelInput,
          r2 as State,
          context,
        );
        it('$r1 Scope 3', () => {
          expect(region1Fuel.scope3Total).toBeCloseTo(scope3, defaultPrecision);
        });
        it('$r2 Scope 3', () => {
          expect(region2Fuel.scope3Total).toBeCloseTo(scope3, defaultPrecision);
        });
      },
    );
  });
});
