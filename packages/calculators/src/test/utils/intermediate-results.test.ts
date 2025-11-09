import { sumIntermediateResults } from '@/calculators/common/tools/intermediate-results';

describe('sumIntermediateResults', () => {
  test('should sum intermediate results accurately', () => {
    const results = [
      {
        output: {
          scope1: {
            a: 1,
            b: 2,
          },
          scope2: {
            c: 3,
            d: 4,
          },
          scope3: {
            e: 5,
            f: 6,
          },
        },
        extensions: {
          g: 7,
          h: 8,
        },
      },
      {
        output: {
          scope1: {
            a: 9,
            b: 10,
          },
          scope2: {
            c: 11,
            d: 12,
          },
          scope3: {
            e: 13,
            f: 14,
          },
        },
        extensions: {
          g: 15,
          h: 16,
        },
      },
    ];

    const result = sumIntermediateResults(
      {
        output: {
          scope1: { a: 0, b: 0 },
          scope2: { c: 0, d: 0 },
          scope3: { e: 0, f: 0 },
        },
        extensions: { g: 0, h: 0 },
      },
      results,
    );

    expect(result).toEqual({
      output: {
        scope1: { a: 10, b: 12 },
        scope2: { c: 14, d: 16 },
        scope3: { e: 18, f: 20 },
      },
      extensions: { g: 22, h: 24 },
    });
  });

  test('can handle empty results', () => {
    const result = sumIntermediateResults(
      {
        output: {
          scope1: {},
          scope2: {},
          scope3: {},
        },
        extensions: {
          cleanWoolYieldTotal: 0,
          greasyWoolShornTotal: 0,
          totalSheepSaleWeight: 0,
        },
      },
      [],
    );

    expect(result).toEqual({
      output: {
        scope1: {},
        scope2: {},
        scope3: {},
      },
      extensions: {
        cleanWoolYieldTotal: 0,
        greasyWoolShornTotal: 0,
        totalSheepSaleWeight: 0,
      },
    });
  });
});
