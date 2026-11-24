import { calculateDairy } from '@/calculators/Dairy';
import { DairyMilkProductionInput } from '@/calculators/Dairy/types/milk.input';
import { createDairyHerdInput } from '@/modules/test/factory';
import { nv } from '@/tools/inputs';

const electricity = {
  method: 'location',
  electricityPurchasedKilowattHours: nv(0),
  region: 'NSW',
} as const;

const dairyInput = (milkProduction: DairyMilkProductionInput) => ({
  electricity,
  herds: [
    createDairyHerdInput({
      milkProduction,
      classes: { milkingCows: { head: nv(10) } },
      livestockSales: [
        {
          class: 'milkingCows',
          numberSold: nv(10),
          averageLiveweightKilograms: nv(500),
        },
      ],
    }),
  ],
});

const intensitiesOf = (milkProduction: DairyMilkProductionInput) => {
  const result = calculateDairy(dairyInput(milkProduction));
  if (result.status !== 'OK') {
    throw new Error(`dairy calculation failed: ${JSON.stringify(result)}`);
  }
  return {
    intensities: result.emissions.intensities,
    netTonnesCO2e: result.emissions.net.total.tonnesCO2e,
  };
};

describe('Dairy intensities, fat and protein corrected milk', () => {
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

  test('allocates the net total between FPCM and liveweight', () => {
    const { intensities, netTonnesCO2e } = intensitiesOf({
      litresPerHeadPerDay: nv(20),
    });

    const milkKgCO2e =
      intensities.milkIntensityIncludingLULUCF.value *
      intensities.fatAndProteinCorrectedMilkProducedKilograms.value;
    const liveweightKgCO2e =
      intensities.liveweightIntensityIncludingLULUCF.value *
      intensities.liveweightProducedKilograms.value;

    expect(milkKgCO2e + liveweightKgCO2e).toBeCloseTo(netTonnesCO2e * 1000, 6);
  });
});
