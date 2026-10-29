import { calculateEmissions, RiceInput, SugarInput } from '@/calculators';
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

  it('calculates other livestock manure N2O from annual nitrogen excretion', () => {
    // NEj is kg N per head per year: goats 7, deer 13.2, horses 39.5
    // AE = 400 * 7 + 120 * 13.2 + 6 * 39.5 = 4,621 kg N
    const input = AllModulesInputSchema.parse({
      otherLivestock: {
        livestock: [
          { type: 'Goats', head: nv(400) },
          { type: 'Deer', head: nv(120) },
          { type: 'Horses', head: nv(6) },
        ],
        excludedFromNaturalWater: false,
        isInLeachingZone: true,
        climateZone: 'wet',
        state: 'NSW',
        grazingSystem: 'Non-irrigated pasture',
      },
    });
    const context = testContext('AllModules');

    const { scope1 } = calculateAllModules(input, context);

    // 4,621 * EFprp(wet) 0.006 * CN2O 1.57
    expect(scope1.manureDirectOtherLivestockN2O.amountGasKg).toBeCloseTo(
      43.52982,
      6,
    );
    // 4,621 * FracGASMsoil 0.21 * EFN2O 0.0018 * CN2O 1.57
    expect(
      scope1.manureAtmosphericDepositionOtherLivestockN2O.amountGasKg,
    ).toBeCloseTo(2.74237866, 6);
    // 4,621 * FracWET 1 * FracLEACH 0.24 * EFleach 0.011 * CN2O 1.57
    expect(
      scope1.manureLeachingRunoffOtherLivestockN2O.amountGasKg,
    ).toBeCloseTo(19.1531208, 6);
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

describe('calculateAllModules crop residues (6.1, 6.3, 6.4)', () => {
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

  // 9,000 t of sugar cane in QLD, wet climate, none burnt
  const caneResidue = {
    totalYieldKg: nv(9_000_000),
    fractionOfAnnualCropBurnt: nv(0),
    residues: { calculationMethod: '1' },
  } as const;

  const crop = ({
    isInLeachingZone,
    fractionOfAnnualCropBurnt = 0,
  }: {
    isInLeachingZone: boolean;
    fractionOfAnnualCropBurnt?: number;
  }): NonNullable<AllModulesInput['crop']> => ({
    crop: {
      ...caneResidue,
      type: 'Sugar Cane',
      fractionOfAnnualCropBurnt: nv(fractionOfAnnualCropBurnt),
    },
    state: 'QLD',
    climateZone: 'wet',
    isInLeachingZone,
  });

  const pasture: NonNullable<AllModulesInput['pasture']> = {
    pasture: {
      type: 'Annual grass',
      areaManaged: nv(100),
      fractionOfAnnualCropBurnt: nv(0),
      residues: { calculationMethod: '1' },
    },
    state: 'QLD',
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

  const sugarResidueLeaching = () => {
    const input: SugarInput = {
      electricity: {
        method: 'location',
        electricityPurchasedKWh: nv(0),
        region: 'QLD',
      },
      crops: [
        {
          crop: caneResidue,
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
          fuel: { transport: [], stationary: [] },
          services: { fuel: { transport: [], stationary: [] } },
          waste: {},
        },
      ],
    };
    const result = calculateEmissions('sugar', input, { disableMetrics: true });
    if (result.status !== 'OK') {
      throw new Error(JSON.stringify(result));
    }
    return result.emissions.scope1.residueLeachingAndRunoffN2O.amountTonnesCO2e;
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

  it('matches the Sugar calculator when the crop is in a leaching zone', () => {
    const expected = sugarResidueLeaching();
    const { residueLeachingAndRunoffN2O, cropResidueN2O } = scope1({
      crop: crop({ isInLeachingZone: true }),
    });

    expect(expected).toBeCloseTo(3.954, 3);
    expect(residueLeachingAndRunoffN2O.amountTonnesCO2e).toBeCloseTo(
      expected,
      8,
    );
    expect(cropResidueN2O.amountTonnesCO2e).toBeGreaterThan(0);
  });

  it('has no crop residue leaching when the crop is not in a leaching zone', () => {
    expect(
      scope1({ crop: crop({ isInLeachingZone: false }) })
        .residueLeachingAndRunoffN2O.amountGasKg,
    ).toBe(0);
  });

  it('adds the crop and rice residues together', () => {
    // A tenth of the cane burnt, so the crop contributes to every residue key
    const leachingBurntCrop = crop({
      isInLeachingZone: true,
      fractionOfAnnualCropBurnt: 0.1,
    });
    const cropOnly = scope1({ crop: leachingBurntCrop });
    const riceOnly = scope1({ rice });
    const both = scope1({ crop: leachingBurntCrop, rice });

    for (const key of residueKeys) {
      expect(cropOnly[key].amountGasKg).toBeGreaterThan(0);
      expect(riceOnly[key].amountGasKg).toBeGreaterThan(0);
      expect(both[key].amountGasKg).toBeCloseTo(
        cropOnly[key].amountGasKg + riceOnly[key].amountGasKg,
        6,
      );
    }
  });

  it('adds crop, pasture and rice residue leaching together', () => {
    const leachingCrop = crop({ isInLeachingZone: true });
    const leaching = (input: AllModulesInput) =>
      scope1(input).residueLeachingAndRunoffN2O.amountGasKg;

    const cropOnly = leaching({ crop: leachingCrop });
    const pastureOnly = leaching({ pasture });
    const riceOnly = leaching({ rice });
    const all = leaching({ crop: leachingCrop, pasture, rice });

    expect(cropOnly).toBeGreaterThan(0);
    expect(pastureOnly).toBeGreaterThan(0);
    expect(riceOnly).toBeGreaterThan(0);
    expect(all).toBeCloseTo(cropOnly + pastureOnly + riceOnly, 6);
  });
});
