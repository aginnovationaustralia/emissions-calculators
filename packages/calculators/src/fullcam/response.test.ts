import type { FullCAMOutputLine } from './types';

import { generateSummaryFromLines } from './response';

function row(
  year: number,
  month: number,
  trees: number,
  debris: number,
  ch4 = 0,
  n2o = 0,
  decimalYear = year + month / 12,
): FullCAMOutputLine {
  return {
    year,
    month,
    decimalYear,
    carbonMassOfTreesTCPerHectare: trees,
    carbonMassOfForestDebrisTCPerHectare: debris,
    ch4EmittedDueToFireTCH4PerHectare: ch4,
    n2oEmittedDueToFireTN2OPerHectare: n2o,
  };
}

describe('generateSummaryFromLines', () => {
  it('uses calendar-year terminal month 12, prior December for y-1, and sums fire columns for endYear', () => {
    const lines: FullCAMOutputLine[] = [
      row(2019, 12, 10, 1),
      ...Array.from({ length: 5 }, (_, i) => row(2020, i + 1, 50 + i, 2, 0, 0)),
      row(2020, 6, 55, 2, 0.25, 0.05),
      ...Array.from({ length: 6 }, (_, i) => row(2020, i + 7, 56 + i, 2, 0, 0)),
      row(2020, 12, 88, 8, 0.5, 0.1),
    ];

    const summary = generateSummaryFromLines(lines, {
      startYear: 2019,
      startMonth: 1,
      endYear: 2020,
      endMonth: 12,
    });

    expect(summary.carbonMassInTreesPerHectare).toBe(88);
    expect(summary.carbonMassInDebrisPerHectare).toBe(8);
    expect(summary.carbonMassInTreesPerHectarePrevYear).toBe(10);
    expect(summary.carbonMassInDebrisPerHectarePrevYear).toBe(1);
    expect(summary.carbonMassInForestProductsPerHectare).toBe(0);
    expect(summary.ch4FromBiomassBurningPerHectare).toBeCloseTo(0.75);
    expect(summary.n2oFromBiomassBurningPerHectare).toBeCloseTo(0.15);
  });

  it('uses financial-year July-June window for fire sums and June terminal rows for stocks', () => {
    const lines: FullCAMOutputLine[] = [
      row(2000, 6, 1, 10),
      row(2000, 7, 2, 11, 0.1, 0.01),
      row(2000, 12, 3, 12, 0.2, 0.02),
      row(2001, 1, 4, 13, 0.4, 0.04),
      row(2001, 6, 100, 20, 0.8, 0.08),
      row(2001, 7, 101, 21, 9, 9),
    ];

    const summary = generateSummaryFromLines(lines, {
      startYear: 2000,
      startMonth: 1,
      endYear: 2001,
      endMonth: 6,
    });

    expect(summary.carbonMassInTreesPerHectare).toBe(100);
    expect(summary.carbonMassInDebrisPerHectare).toBe(20);
    expect(summary.carbonMassInTreesPerHectarePrevYear).toBe(1);
    expect(summary.carbonMassInDebrisPerHectarePrevYear).toBe(10);
    expect(summary.ch4FromBiomassBurningPerHectare).toBeCloseTo(
      0.1 + 0.2 + 0.4 + 0.8,
    );
    expect(summary.n2oFromBiomassBurningPerHectare).toBeCloseTo(
      0.01 + 0.02 + 0.04 + 0.08,
    );
  });

  it('throws when no row exists for required terminal year and month', () => {
    const lines: FullCAMOutputLine[] = [row(2020, 11, 1, 1)];

    expect(() =>
      generateSummaryFromLines(lines, {
        startYear: 2020,
        startMonth: 1,
        endYear: 2020,
        endMonth: 12,
      }),
    ).toThrow(/no output row for current year y/);
  });

  it('treats non-finite fire values as zero when summing', () => {
    const lines: FullCAMOutputLine[] = [
      row(2019, 12, 0, 0),
      {
        ...row(2020, 1, 0, 0, NaN, NaN),
        ch4EmittedDueToFireTCH4PerHectare: Number.NaN,
        n2oEmittedDueToFireTN2OPerHectare: Number.NaN,
      },
      row(2020, 12, 1, 1, 0.1, 0.2),
    ];

    const summary = generateSummaryFromLines(lines, {
      startYear: 2020,
      startMonth: 1,
      endYear: 2020,
      endMonth: 12,
    });

    expect(summary.ch4FromBiomassBurningPerHectare).toBeCloseTo(0.1);
    expect(summary.n2oFromBiomassBurningPerHectare).toBeCloseTo(0.2);
  });
});
