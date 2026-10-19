import { calculateEmissions, HorticultureInput } from '@/calculators';
import { nv } from '@/tools/inputs';

const horticultureInput: HorticultureInput = {
  electricity: {
    method: 'location',
    electricityPurchasedKWh: nv(1000),
    region: 'NSW',
  },
  crops: [
    {
      crop: {
        type: 'Peanuts',
        totalYieldKg: nv(2000),
        fractionOfAnnualCropBurnt: nv(0),
        residues: { calculationMethod: '1' },
      },
      state: 'NSW',
      climateZone: 'wet',
      isInLeachingZone: false,
      electricityAllocation: nv(1),
      lime: { applications: [] },
      chemicals: [],
      fertiliser: {
        inorganic: { applications: [], calculationMethodScope1: '1' },
        organic: { applications: [] },
      },
      fuel: {
        transport: [
          {
            vehicleType: 'Cars and light commercial vehicles',
            amountKilolitres: nv(1),
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

describe('horticulture calculator', () => {
  it('is available via calculateEmissions', () => {
    const result = calculateEmissions('horticulture', horticultureInput, {
      disableMetrics: true,
    });

    expect(result.status).toBe('OK');
    if (result.status === 'OK') {
      expect(
        result.emissions.scope1.fuelTransportCO2.amountGasKg,
      ).toBeGreaterThan(0);
      expect(result.emissions.intermediate).toHaveLength(1);
    }
  });
});
