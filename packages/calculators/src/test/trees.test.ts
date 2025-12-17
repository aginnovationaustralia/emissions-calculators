import { calculateTreeCarbonSequestration } from '@/calculators/common/trees';
import { testContext } from './common/context';

const context = testContext();

describe('validating Tree carbon', () => {
  const carbon = calculateTreeCarbonSequestration(
    {
      age: 20,
      area: 10,
      region: 'East Coast',
      soil: 'Structured Earths',
      treeSpecies: 'Tasmanian Blue Gum',
    },
    context,
  );

  test('total carbon should be correct', () => {
    expect(carbon.total).toBeCloseTo(229.008);
  });

  test('average carbon should be correct', () => {
    expect(carbon.average).toBeCloseTo(2.719);
  });
});

describe('validating Tree carbon, 0 age', () => {
  const carbon = calculateTreeCarbonSequestration(
    {
      age: 0,
      area: 10,
      region: 'East Coast',
      soil: 'Structured Earths',
      treeSpecies: 'Tasmanian Blue Gum',
    },
    context,
  );

  test('total carbon should be correct', () => {
    expect(carbon.total).toBeCloseTo(0);
  });

  test('average carbon should be correct', () => {
    expect(carbon.average).toBeCloseTo(0);
  });
});

describe('validating Tree carbon, 0 area', () => {
  const carbon = calculateTreeCarbonSequestration(
    {
      age: 20,
      area: 0,
      region: 'East Coast',
      soil: 'Structured Earths',
      treeSpecies: 'Tasmanian Blue Gum',
    },
    context,
  );

  test('total carbon should be correct', () => {
    expect(carbon.total).toBeCloseTo(0);
  });

  test('average carbon should be correct', () => {
    expect(carbon.average).toBeCloseTo(2.719);
  });
});
