import { calculateDairy } from '@/calculators/Dairy';
import { DairySaleInput } from '@/calculators/Dairy/types/sale.input';
import { createDairyHerdInput } from '@/modules/test/factory';
import { nv } from '@/tools/inputs';

const electricity = {
  method: 'location',
  electricityPurchasedKilowattHours: nv(0),
  region: 'NSW',
} as const;

const dairyInput = (livestockSales: DairySaleInput[] = []) => ({
  electricity,
  herds: [
    createDairyHerdInput({
      milkProduction: { litresPerHeadPerDay: nv(20) },
      classes: { milkingCows: { head: nv(10) } },
      livestockSales,
    }),
  ],
});

const calculate = (input: ReturnType<typeof dairyInput>) => {
  const result = calculateDairy(input);
  if (result.status !== 'OK') {
    throw new Error(`Unexpected status ${result.status}`);
  }
  return result.emissions;
};

describe('Dairy mass based allocation intensities', () => {
  const sales: DairySaleInput[] = [
    {
      class: 'milkingCows',
      numberSold: nv(5),
      averageLiveweightKilograms: nv(600),
    },
  ];

  test('spreads emissions evenly across each kg of milk and liveweight', () => {
    const { intensities, net, intermediate } = calculate(dairyInput(sales));

    const totalMass =
      intensities.milkProducedKilograms.value +
      intensities.liveweightProducedKilograms.value;
    const expected = (net.total.tonnesCO2e * 1000) / totalMass;

    expect(intensities.liveweightProducedKilograms.value).toBe(3000);
    expect(
      intensities.milkIntensityMassAllocationIncludingLULUCF.value,
    ).toBeCloseTo(expected, 10);
    expect(
      intensities.liveweightIntensityMassAllocationIncludingLULUCF.value,
    ).toBeCloseTo(expected, 10);

    const [herd] = intermediate;
    expect(herd.intensities.milkIntensityMassAllocation.value).toBeCloseTo(
      herd.intensities.liveweightIntensityMassAllocation.value,
      10,
    );
  });

  test('allocates every emission to milk when no livestock are sold', () => {
    const { intensities, net } = calculate(dairyInput());

    const expected =
      (net.total.tonnesCO2e * 1000) / intensities.milkProducedKilograms.value;

    expect(
      intensities.milkIntensityMassAllocationIncludingLULUCF.value,
    ).toBeCloseTo(expected, 10);
    expect(
      intensities.milkIntensityMassAllocationIncludingLULUCF.value,
    ).toBeCloseTo(intensities.milkIntensityIncludingLULUCF.value, 10);
    expect(
      intensities.liveweightIntensityMassAllocationIncludingLULUCF.value,
    ).toBe(0);
  });

  test('differs from the energy based allocation when livestock are sold', () => {
    const { intensities } = calculate(dairyInput(sales));

    expect(
      intensities.milkIntensityMassAllocationIncludingLULUCF.value,
    ).not.toBeCloseTo(intensities.milkIntensityIncludingLULUCF.value, 4);
  });
});
