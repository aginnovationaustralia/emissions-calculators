import {
  CroppingInput,
  CroppingInputSchema,
} from '@aginnovationaustralia/emissions-calculators';
import { calculateCropping, executeCalculator } from '.';
import { ResearchCalculatorOptions } from './environment';

const croppingTestData: CroppingInput = {
  electricity: {
    method: 'location',
    electricityPurchasedKWh: { value: 4000 },
    region: 'NSW',
  },
  crops: [
    {
      crop: {
        type: 'Wheat',
        totalYieldKg: { value: 3000 },
        residues: { calculationMethod: '1' },
        fractionOfAnnualCropBurnt: { value: 1 },
      },
      climateZone: 'wet',
      state: 'NSW',
      electricityAllocation: { value: 1 },
      lime: { applications: [] },
      chemicals: [],
      refrigerants: [],
      fertiliser: {
        productionSystem: 'Non-irrigated pasture',
        inorganic: { applications: [], calculationMethodScope1: '1' },
        organic: { applications: [] },
      },
      isInLeachingZone: true,
      fuel: {
        transport: [
          {
            vehicleType: 'Cars and light commercial vehicles',
            amountKilolitres: { value: 1 },
            fuelType: 'Diesel oil',
          },
        ],
        stationary: [],
      },
      services: {
        fuel: { stationary: [], transport: [] },
      },
      waste: {},
    },
  ],
};

const dieselCO2Override = (value: number) => ({
  COMMON: {
    TRANSPORT_FUEL_FACTORS: {
      'Cars and light commercial vehicles': {
        'Diesel oil': { SCOPE1_EF: { CO2: value } },
      },
    },
  },
});

describe('ResearchNodeEnvironment overrides', () => {
  const input = CroppingInputSchema.parse(croppingTestData);
  const options = { disableMetrics: true };
  const run = (o: ResearchCalculatorOptions) =>
    executeCalculator(calculateCropping, input, 'cropping', o);

  it('applies constant overrides to a calculator execution', () => {
    const baseline = run(options);

    const overriddenOptions = {
      ...options,
      overrides: dieselCO2Override(0.0000699 * 2),
    };

    const overridden = run(overriddenOptions);

    expect(baseline.scope1.fuelTransportCO2.amountGasKg).toBeGreaterThan(0);
    expect(overridden.scope1.fuelTransportCO2.amountGasKg).toBeCloseTo(
      baseline.scope1.fuelTransportCO2.amountGasKg * 2,
    );
    expect(overridden.scope1.fuelTransportCO2.constants).toContainEqual(
      expect.objectContaining({
        name: 'COMMON[TRANSPORT_FUEL_FACTORS.Cars and light commercial vehicles.Diesel oil.SCOPE1_EF.CO2]',
        value: 0.0000699 * 2,
      }),
    );
  });
});
