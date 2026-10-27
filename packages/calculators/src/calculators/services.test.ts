import {
  calculateEmissions,
  CroppingInput,
  GrainsInput,
  HorticultureInput,
  SugarInput,
} from '@/calculators';
import type { FuelInput } from '@/modules/scope1/8-fuel-use/fuel.input';
import { grainWheat } from '@/test/Grains/grains.data';
import { nv } from '@/tools/inputs';
import { SERVICES_15_7 } from '@/tools/modules';

/**
 * Purchased services (15.7) must be calculated from the fuel burnt by contractors
 * (`services.fuel`), never from the activity's own fuel (`fuel`, which feeds 8.1, 8.2
 * and 15.10). Every industry calculator routes 15.7 through the same helper; these
 * cases exercise it end to end for a selection of crop calculators.
 */

// The activity's own fuel: 18 kL off-road diesel and 4 kL ute diesel, plus 6 kL of
// stationary diesel.
const ownFuel: FuelInput = {
  transport: [
    {
      vehicleType: 'Off-road Agriculture and forestry equipment',
      fuelType: 'Diesel',
      amountKilolitres: nv(18),
    },
    {
      vehicleType: 'Cars and light commercial vehicles',
      fuelType: 'Diesel oil',
      amountKilolitres: nv(4),
    },
  ],
  stationary: [
    {
      fuelClass: 'Liquid fuels',
      fuelType: 'Diesel oil',
      amountKilolitres: nv(6),
    },
  ],
};

// Contractor fuel: 25 kL off-road diesel.
const contractorFuel: FuelInput = {
  transport: [
    {
      vehicleType: 'Off-road Agriculture and forestry equipment',
      fuelType: 'Diesel',
      amountKilolitres: nv(25),
    },
  ],
  stationary: [],
};

const noFuel: FuelInput = { transport: [], stationary: [] };

const electricity = {
  method: 'location',
  electricityPurchasedKWh: nv(0),
  region: 'QLD',
} as const;

const sugarInput = (fuel: FuelInput, servicesFuel: FuelInput): SugarInput => ({
  electricity,
  crops: [
    {
      crop: {
        totalYieldKg: nv(9_000_000),
        fractionOfAnnualCropBurnt: nv(0),
        residues: { calculationMethod: '1' },
      },
      state: 'QLD',
      climateZone: 'wet',
      isInLeachingZone: true,
      electricityAllocation: nv(1),
      lime: { applications: [] },
      chemicals: [],
      refrigerants: [],
      fertiliser: {
        inorganic: { applications: [], calculationMethodScope1: '1' },
        organic: { applications: [] },
      },
      fuel,
      services: { fuel: servicesFuel },
      waste: {},
    },
  ],
});

const grainsInput = (
  fuel: FuelInput,
  servicesFuel: FuelInput,
): GrainsInput & CroppingInput => ({
  electricity,
  crops: [{ ...grainWheat, fuel, services: { fuel: servicesFuel } }],
});

const horticultureInput = (
  fuel: FuelInput,
  servicesFuel: FuelInput,
): HorticultureInput => ({
  electricity,
  crops: [
    {
      crop: {
        type: 'Peanuts',
        totalYieldKg: nv(2000),
        fractionOfAnnualCropBurnt: nv(0),
        residues: { calculationMethod: '1' },
      },
      state: 'QLD',
      climateZone: 'wet',
      isInLeachingZone: false,
      electricityAllocation: nv(1),
      lime: { applications: [] },
      chemicals: [],
      fertiliser: {
        inorganic: { applications: [], calculationMethodScope1: '1' },
        organic: { applications: [] },
      },
      fuel,
      services: { fuel: servicesFuel },
      waste: {},
    },
  ],
});

type ServicesOutput = {
  amountTonnesCO2e: number;
  inputs?: { name: string; modules?: string[] }[];
};

const scope3Services = (
  name: 'sugar' | 'grains' | 'cropping' | 'horticulture',
  input: object,
) => {
  // The input builders above are typed per calculator, so the cast only widens the
  // name/input pairing for the table-driven cases.
  const result = calculateEmissions(name, input as never, {
    disableMetrics: true,
  });
  if (result.status !== 'OK') {
    throw new Error(`${name} calculation failed: ${JSON.stringify(result)}`);
  }
  const { scope3, intermediate } = result.emissions as unknown as {
    scope3: { services: ServicesOutput };
    intermediate: { scope3: { services: ServicesOutput } }[];
  };
  return { total: scope3.services, activity: intermediate[0].scope3.services };
};

const allModulesServicesTonnes = (servicesFuel: FuelInput) => {
  const result = calculateEmissions(
    'all-modules',
    { services: { state: 'QLD', fuel: servicesFuel } },
    { disableMetrics: true },
  );
  if (result.status !== 'OK') {
    throw new Error(`all-modules failed: ${JSON.stringify(result)}`);
  }
  return result.emissions.scope3.services.amountTonnesCO2e;
};

const cases = [
  ['sugar', sugarInput],
  ['grains', grainsInput],
  ['cropping', grainsInput],
  ['horticulture', horticultureInput],
] as const;

describe.each(cases)(
  '%s calculator, purchased services (15.7)',
  (name, build) => {
    it('uses services.fuel, not the activity own fuel', () => {
      const { total, activity } = scope3Services(
        name,
        build(ownFuel, contractorFuel),
      );

      const expected = allModulesServicesTonnes(contractorFuel);
      // 25 kL off-road diesel, ~3.397 t CO2e/kL including upstream emissions
      expect(expected).toBeCloseTo(84.92, 2);
      expect(activity.amountTonnesCO2e).toBeCloseTo(expected, 6);
      expect(total.amountTonnesCO2e).toBeCloseTo(expected, 6);
      expect(activity.amountTonnesCO2e).not.toBeCloseTo(
        allModulesServicesTonnes(ownFuel),
        2,
      );
    });

    it('is zero when no services fuel is supplied, regardless of own fuel', () => {
      const { activity } = scope3Services(name, build(ownFuel, noFuel));

      expect(activity.amountTonnesCO2e).toBe(0);
    });

    it('only reads inputs tagged for 15.7', () => {
      const { activity } = scope3Services(name, build(ownFuel, contractorFuel));

      const untagged = (activity.inputs ?? [])
        .filter((input) => !(input.modules ?? []).includes(SERVICES_15_7))
        .map((input) => input.name);
      expect(activity.inputs?.length).toBeGreaterThan(0);
      expect(untagged).toEqual([]);
    });
  },
);
