import { nv } from '@/tools/inputs';
import { getIntensities } from './calculator';
import { PostProductionIntensitiesSchema } from './types/intensities.input';

describe('getIntensities', () => {
  it('returns zero intensities when intensity inputs are omitted', () => {
    expect(
      getIntensities(undefined, {
        total: { tonnesCO2e: 300 / 1000 },
      }),
    ).toEqual({
      unitsProduced: { value: 0 },
      productionEmissionsKgCO2e: { value: 0 },
      postProductionAllocation: { value: 0 },
      postProductionEmissionsKgCO2e: { value: 300 },
      productionIntensityKgCO2ePerUnit: { value: 0 },
      postProductionIntensityKgCO2ePerUnit: { value: 0 },
      combinedIntensityKgCO2ePerUnit: { value: 0 },
    });
  });

  it('calculates production, post-production, and combined intensities', () => {
    const input = PostProductionIntensitiesSchema.parse({
      unitsProduced: nv(100),
      productionEmissionsKgCO2e: nv(200),
      postProductionAllocation: nv(0.25),
    });

    expect(
      getIntensities(input, {
        total: { tonnesCO2e: 300 / 1000 },
      }),
    ).toEqual({
      unitsProduced: { value: 100 },
      productionEmissionsKgCO2e: { value: 200 },
      postProductionAllocation: { value: 0.25 },
      postProductionEmissionsKgCO2e: { value: 300 },
      productionIntensityKgCO2ePerUnit: { value: 2 },
      postProductionIntensityKgCO2ePerUnit: { value: 3 },
      combinedIntensityKgCO2ePerUnit: { value: 5 },
    });
  });

  it('returns zero intensities when no units were produced', () => {
    const input = PostProductionIntensitiesSchema.parse({
      unitsProduced: nv(0),
      productionEmissionsKgCO2e: nv(200),
    });

    expect(
      getIntensities(input, {
        total: { tonnesCO2e: 300 / 1000 },
      }),
    ).toEqual({
      unitsProduced: { value: 0 },
      productionEmissionsKgCO2e: { value: 200 },
      postProductionAllocation: { value: 1 },
      postProductionEmissionsKgCO2e: { value: 300 },
      productionIntensityKgCO2ePerUnit: { value: 0 },
      postProductionIntensityKgCO2ePerUnit: { value: 0 },
      combinedIntensityKgCO2ePerUnit: { value: 0 },
    });
  });
});
