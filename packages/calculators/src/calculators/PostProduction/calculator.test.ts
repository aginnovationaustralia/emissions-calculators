import { root } from '@/tools/containers';
import { nv } from '@/tools/inputs';
import { mass } from '@/tools/units';
import { getIntensities } from './calculator';
import { PostProductionIntensitiesSchema } from './types/intensities.input';

describe('getIntensities', () => {
  it('returns zero intensities when intensity inputs are omitted', () => {
    expect(getIntensities(undefined, root(mass('CO2e', 300)))).toEqual({
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

    expect(getIntensities(input, root(mass('CO2e', 300)))).toEqual({
      unitsProduced: { value: 100 },
      productionEmissionsKgCO2e: { value: 200 },
      postProductionAllocation: { value: 0.25 },
      postProductionEmissionsKgCO2e: { value: 300 },
      productionIntensityKgCO2ePerUnit: { value: 2 },
      // 25% of the 300kg post-production emissions, over 100 units
      postProductionIntensityKgCO2ePerUnit: { value: 0.75 },
      combinedIntensityKgCO2ePerUnit: { value: 2.75 },
    });
  });

  it('allocates all post-production emissions when no allocation is given', () => {
    const input = PostProductionIntensitiesSchema.parse({
      unitsProduced: nv(100),
      productionEmissionsKgCO2e: nv(200),
    });

    expect(getIntensities(input, root(mass('CO2e', 300)))).toMatchObject({
      postProductionAllocation: { value: 1 },
      postProductionIntensityKgCO2ePerUnit: { value: 3 },
      combinedIntensityKgCO2ePerUnit: { value: 5 },
    });
  });

  it('returns zero intensities when no units were produced', () => {
    const input = PostProductionIntensitiesSchema.parse({
      unitsProduced: nv(0),
      productionEmissionsKgCO2e: nv(200),
    });

    expect(getIntensities(input, root(mass('CO2e', 300)))).toEqual({
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
