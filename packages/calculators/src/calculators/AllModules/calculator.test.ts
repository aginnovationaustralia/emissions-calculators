import { calculateEmissions, RiceInput } from '@/calculators';
import { testContext } from '@/test/Grains/context';
import { ZERO_ALL_MODULES_INPUT } from '@/test/inputs/zero-input';
import { nv } from '@/tools/inputs';
import { calculateAllModules } from './calculator';
import { AllModulesInput, AllModulesInputSchema } from './types/input';

describe('calculateAllModules', () => {
  it('returns zero totals for every scope when every input is zeroed out', () => {
    const input = AllModulesInputSchema.parse(ZERO_ALL_MODULES_INPUT);
    const context = testContext('AllModules');

    const result = calculateAllModules(input, context);

    expect(result.scope1.total.tonnesCO2e).toBe(0);
    expect(result.scope2.total.tonnesCO2e).toBe(0);
    expect(result.scope3.total.tonnesCO2e).toBe(0);
    expect(result.net.total.tonnesCO2e).toBe(0);

    // A couple of targeted individual scope 1 keys, to prove the zeroed-out shape
    // round-trips through the underlying modules and not just the top-level sum.
    expect(result.scope1.entericBeefCH4.amountGasKg).toBe(0);
    expect(result.scope1.inorganicFertiliserN2O.amountGasKg).toBe(0);
    expect(result.scope1.fuelTransportCO2.amountGasKg).toBe(0);
  });

  it('returns zero totals when every top-level key is omitted (each is optional)', () => {
    const input = AllModulesInputSchema.parse({});
    const context = testContext('AllModules');

    const result = calculateAllModules(input, context);

    expect(result.scope1.total.tonnesCO2e).toBe(0);
    expect(result.scope2.total.tonnesCO2e).toBe(0);
    expect(result.scope3.total.tonnesCO2e).toBe(0);
    expect(result.net.total.tonnesCO2e).toBe(0);
  });
});

describe('calculateAllModules rice crop residues (6.1, 6.3, 6.4)', () => {
  // 250 ha of rice in NSW, 10 t/ha, a fifth of the stubble burnt
  const riceCrop = {
    totalYieldKg: nv(2_500_000),
    fractionOfAnnualCropBurnt: nv(0.2),
    residues: { calculationMethod: '1' },
    areaSown: nv(250),
    preSeasonWaterRegimeType: 'Non flooded pre-season <180 days',
    waterRegimeType: 'Continuously flooded',
    cultivationPeriodDays: nv(150),
  } as const;

  const rice: NonNullable<AllModulesInput['rice']> = {
    crop: riceCrop,
    state: 'NSW',
    climateZone: 'Warm temperate dry',
    isInLeachingZone: true,
  };

  // 9,000 t of sugar cane in NSW, a tenth burnt
  const crop: NonNullable<AllModulesInput['crop']> = {
    crop: {
      type: 'Sugar Cane',
      totalYieldKg: nv(9_000_000),
      fractionOfAnnualCropBurnt: nv(0.1),
      residues: { calculationMethod: '1' },
    },
    state: 'NSW',
    climateZone: 'wet',
  };

  const pasture: NonNullable<AllModulesInput['pasture']> = {
    pasture: {
      type: 'Annual grass',
      areaManaged: nv(100),
      fractionOfAnnualCropBurnt: nv(0),
      residues: { calculationMethod: '1' },
    },
    state: 'NSW',
    climateZone: 'wet',
    isInLeachingZone: true,
  };

  const residueKeys = [
    'cropResidueN2O',
    'residueLeachingAndRunoffN2O',
    'fieldBurningN2O',
    'fieldBurningCH4',
  ] as const;

  const scope1 = (input: AllModulesInput) =>
    calculateAllModules(
      AllModulesInputSchema.parse(input),
      testContext('AllModules'),
    ).scope1;

  const riceCalculatorScope1 = () => {
    const input: RiceInput = {
      electricity: {
        method: 'location',
        electricityPurchasedKWh: nv(0),
        region: 'NSW',
      },
      crops: [
        {
          crop: riceCrop,
          state: 'NSW',
          climateZone: 'Warm temperate dry',
          isInLeachingZone: true,
          electricityAllocation: nv(1),
          lime: { applications: [] },
          chemicals: [],
          refrigerants: [],
          fertiliser: {
            productionSystem: 'Rice (continuous flooding)',
            inorganic: { applications: [], calculationMethodScope1: '1' },
            organic: { applications: [] },
          },
          fuel: { transport: [], stationary: [] },
          services: { fuel: { transport: [], stationary: [] } },
          waste: {},
        },
      ],
    };
    const result = calculateEmissions('rice', input, { disableMetrics: true });
    if (result.status !== 'OK') {
      throw new Error(JSON.stringify(result));
    }
    return result.emissions.scope1;
  };

  it('matches the Rice calculator when only rice is supplied', () => {
    const expected = riceCalculatorScope1();
    const actual = scope1({ rice });

    for (const key of residueKeys) {
      expect(expected[key].amountGasKg).toBeGreaterThan(0);
      expect(actual[key].amountGasKg).toBeCloseTo(expected[key].amountGasKg, 6);
    }
    expect(actual.riceCultivationCH4.amountGasKg).toBeCloseTo(
      expected.riceCultivationCH4.amountGasKg,
      6,
    );
  });

  it('adds the crop and rice residues together', () => {
    const cropOnly = scope1({ crop });
    const riceOnly = scope1({ rice });
    const both = scope1({ crop, rice });

    for (const key of [
      'cropResidueN2O',
      'fieldBurningN2O',
      'fieldBurningCH4',
    ] as const) {
      expect(cropOnly[key].amountGasKg).toBeGreaterThan(0);
      expect(riceOnly[key].amountGasKg).toBeGreaterThan(0);
      expect(both[key].amountGasKg).toBeCloseTo(
        cropOnly[key].amountGasKg + riceOnly[key].amountGasKg,
        6,
      );
    }
  });

  it('adds the pasture and rice residue leaching together', () => {
    const pastureOnly = scope1({ pasture }).residueLeachingAndRunoffN2O;
    const riceOnly = scope1({ rice }).residueLeachingAndRunoffN2O;
    const both = scope1({ pasture, rice }).residueLeachingAndRunoffN2O;

    expect(pastureOnly.amountGasKg).toBeGreaterThan(0);
    expect(riceOnly.amountGasKg).toBeGreaterThan(0);
    expect(both.amountGasKg).toBeCloseTo(
      pastureOnly.amountGasKg + riceOnly.amountGasKg,
      6,
    );
  });

  it('keeps accepting rice without state, climate zone or leaching zone, and still includes field burning', () => {
    const riceWithoutLocation = { crop: riceCrop };
    const expected = scope1({ rice });
    const actual = scope1({ rice: riceWithoutLocation });

    expect(actual.fieldBurningN2O.amountGasKg).toBeGreaterThan(0);
    expect(actual.cropResidueN2O.amountGasKg).toBe(0);
    expect(actual.residueLeachingAndRunoffN2O.amountGasKg).toBe(0);
    expect(actual.fieldBurningN2O.amountGasKg).toBeCloseTo(
      expected.fieldBurningN2O.amountGasKg,
      6,
    );
    expect(actual.fieldBurningCH4.amountGasKg).toBeCloseTo(
      expected.fieldBurningCH4.amountGasKg,
      6,
    );
  });
});
