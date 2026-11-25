import { calculateDairy } from '@/calculators/Dairy';
import { DairyMilkProductionInput } from '@/calculators/Dairy/types/milk.input';
import { DairySaleInput } from '@/calculators/Dairy/types/sale.input';
import { createDairyHerdInput } from '@/modules/test/factory';
import { nv } from '@/tools/inputs';

const electricity = {
  method: 'location',
  electricityPurchasedKilowattHours: nv(0),
  region: 'NSW',
} as const;

const dairyInput = (
  milkProduction: DairyMilkProductionInput,
  livestockSales: DairySaleInput[] = [],
) => ({
  electricity,
  herds: [
    createDairyHerdInput({
      milkProduction,
      classes: { milkingCows: { head: nv(10) } },
      livestockSales,
    }),
  ],
});

const calculate = (input: ReturnType<typeof dairyInput>) => {
  const result = calculateDairy(input);
  if (result.status !== 'OK') {
    throw new Error(`dairy calculation failed: ${JSON.stringify(result)}`);
  }
  return result.emissions;
};

describe('Dairy intensities, fat and protein corrected milk', () => {
  const sales: DairySaleInput[] = [
    {
      class: 'milkingCows',
      numberSold: nv(10),
      averageLiveweightKilograms: nv(500),
    },
  ];

  const intensitiesOf = (milkProduction: DairyMilkProductionInput) => {
    const { intensities, net } = calculate(dairyInput(milkProduction, sales));
    return { intensities, netTonnesCO2e: net.total.tonnesCO2e };
  };

  test('corrects milk by volume with the default fat and protein content', () => {
    const { intensities } = intensitiesOf({ litresPerHeadPerDay: nv(20) });

    // FPCM = M * (0.1226 * 4.0 + 0.0776 * 3.3 + 0.2534)
    expect(
      intensities.fatAndProteinCorrectedMilkProducedKilograms.value /
        intensities.milkProducedKilograms.value,
    ).toBeCloseTo(0.99988, 10);
  });

  test('corrects milk by volume with the method 2 fat and protein content', () => {
    const { intensities } = intensitiesOf({
      litresPerHeadPerDay: nv(20),
      method2PercentFatContent: nv(5),
      method2PercentProteinContent: nv(3.5),
    });

    // FPCM = M * (0.1226 * 5 + 0.0776 * 3.5 + 0.2534)
    expect(
      intensities.fatAndProteinCorrectedMilkProducedKilograms.value /
        intensities.milkProducedKilograms.value,
    ).toBeCloseTo(1.138, 10);
  });

  test('corrects milk solids with the method 2 fat and protein content', () => {
    const { intensities } = intensitiesOf({
      solidsKilogramsPerHeadPerDay: nv(1.5),
      method2PercentFatContent: nv(5),
      method2PercentProteinContent: nv(3.5),
    });

    // FPCM = M * (0.1226 * 5 + 0.0776 * 3.5 + 0.2534)
    expect(
      intensities.fatAndProteinCorrectedMilkProducedKilograms.value /
        intensities.milkProducedKilograms.value,
    ).toBeCloseTo(1.138, 10);
  });

  test.each(['energyIntensities', 'massIntensities'] as const)(
    'allocates the net total between FPCM and liveweight (%s)',
    (allocation) => {
      const { intensities, netTonnesCO2e } = intensitiesOf({
        litresPerHeadPerDay: nv(20),
      });

      const milkKgCO2e =
        intensities[allocation].milkIntensityIncludingLULUCF.value *
        intensities.fatAndProteinCorrectedMilkProducedKilograms.value;
      const liveweightKgCO2e =
        intensities[allocation].liveweightIntensityIncludingLULUCF.value *
        intensities.liveweightProducedKilograms.value;

      expect(milkKgCO2e + liveweightKgCO2e).toBeCloseTo(
        netTonnesCO2e * 1000,
        6,
      );
    },
  );
});

describe('Dairy mass based allocation intensities', () => {
  const milkProduction = { litresPerHeadPerDay: nv(20) };
  const sales: DairySaleInput[] = [
    {
      class: 'milkingCows',
      numberSold: nv(5),
      averageLiveweightKilograms: nv(600),
    },
  ];

  test('spreads emissions evenly across each kg of FPCM and liveweight', () => {
    const { intensities, net, intermediate } = calculate(
      dairyInput(milkProduction, sales),
    );

    const totalMass =
      intensities.fatAndProteinCorrectedMilkProducedKilograms.value +
      intensities.liveweightProducedKilograms.value;
    const expected = (net.total.tonnesCO2e * 1000) / totalMass;

    expect(intensities.liveweightProducedKilograms.value).toBe(3000);
    expect(
      intensities.massIntensities.milkIntensityIncludingLULUCF.value,
    ).toBeCloseTo(expected, 10);
    expect(
      intensities.massIntensities.liveweightIntensityIncludingLULUCF.value,
    ).toBeCloseTo(expected, 10);

    const [herd] = intermediate;
    expect(herd.intensities.massIntensities.milkIntensity.value).toBeCloseTo(
      herd.intensities.massIntensities.liveweightIntensity.value,
      10,
    );
  });

  test('allocates every emission to milk when no livestock are sold', () => {
    const { intensities, net } = calculate(dairyInput(milkProduction));

    const expected =
      (net.total.tonnesCO2e * 1000) /
      intensities.fatAndProteinCorrectedMilkProducedKilograms.value;

    expect(
      intensities.massIntensities.milkIntensityIncludingLULUCF.value,
    ).toBeCloseTo(expected, 10);
    expect(
      intensities.massIntensities.milkIntensityIncludingLULUCF.value,
    ).toBeCloseTo(
      intensities.energyIntensities.milkIntensityIncludingLULUCF.value,
      10,
    );
    expect(
      intensities.massIntensities.liveweightIntensityIncludingLULUCF.value,
    ).toBe(0);
  });

  test('differs from the energy based allocation when livestock are sold', () => {
    const { intensities } = calculate(dairyInput(milkProduction, sales));

    expect(
      intensities.massIntensities.milkIntensityIncludingLULUCF.value,
    ).not.toBeCloseTo(
      intensities.energyIntensities.milkIntensityIncludingLULUCF.value,
      4,
    );
  });
});
