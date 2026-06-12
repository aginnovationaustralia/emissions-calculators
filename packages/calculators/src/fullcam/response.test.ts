import type { FullCAMOutputLine, FullCAMSubmissionSucceeded } from './types';

import { FullCAMAreaInput } from './input';
import {
  extractKeyFieldsFromFullCAMOutput,
  generateCsvLines,
  generateSummaryFromLines,
} from './response';

const CSV_HEADER =
  'Year,Step In Year,Dec. Year,"C mass of trees  (tC/ha)","CH4 emitted due to fire (tCH4/ha)","N2O emitted due to fire (tN2O/ha)","C mass of forest debris  (tC/ha)"';

function csvLine(
  year: number,
  month: number,
  decimalYear: number,
  trees: number,
  ch4: number,
  n2o: number,
  debris: number,
): string {
  return `${year},${month},${decimalYear},${trees},${ch4},${n2o},${debris}`;
}

function minimalAreaInput(
  overrides: Partial<FullCAMAreaInput> = {},
): FullCAMAreaInput {
  return {
    latitude: -30,
    longitude: 151,
    region: 'New England Tablelands',
    areaHectares: 1,
    startYear: 2019,
    startMonth: 1,
    endYear: 2020,
    endMonth: 12,
    plantingEvents: [],
    wildfireEvents: [],
    prescribedBurnEvents: [],
    initialTrees: false,
    ...overrides,
  } as FullCAMAreaInput;
}

function submission(
  outputCsv: string,
  input: FullCAMAreaInput = minimalAreaInput(),
  uniqueAreaKey = 'area-1',
): FullCAMSubmissionSucceeded {
  return {
    area: {
      uniqueAreaKey,
      plotfileName: `${uniqueAreaKey}.plo`,
      plotContent: '',
      input,
    },
    outputCsv,
  };
}

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

describe('generateCsvLines', () => {
  it('returns an error when the CSV has no data rows', () => {
    const result = generateCsvLines('');

    expect(result.isErr).toBe(true);
    if (!result.isErr) {
      return;
    }
    expect(result.error).toEqual({
      step: 'extract-results',
      message: 'Invalid CSV output: no data',
    });
  });

  it('returns an error when the CSV has only a header row', () => {
    const result = generateCsvLines(CSV_HEADER);

    expect(result.isErr).toBe(true);
    if (!result.isErr) {
      return;
    }
    expect(result.error).toEqual({
      step: 'extract-results',
      message: 'Invalid CSV output: no data',
    });
  });

  it('returns an error when the batch API reports a three-column error row', () => {
    const result = generateCsvLines('col1,col2,col3\na,b,Simulation failed');

    expect(result.isErr).toBe(true);
    if (!result.isErr) {
      return;
    }
    expect(result.error).toEqual({
      step: 'extract-results',
      message: 'Batch error: Simulation failed',
    });
  });

  it('parses valid FullCAM CSV output into lines', () => {
    const result = generateCsvLines(
      [CSV_HEADER, csvLine(2020, 12, 2020.92, 88, 0.5, 0.1, 8)].join('\n'),
    );

    expect(result.isOk).toBe(true);
    if (!result.isOk) {
      return;
    }
    expect(result.value).toContainEqual({
      year: 2020,
      month: 12,
      decimalYear: 2020.92,
      carbonMassOfTreesTCPerHectare: 88,
      ch4EmittedDueToFireTCH4PerHectare: 0.5,
      n2oEmittedDueToFireTN2OPerHectare: 0.1,
      carbonMassOfForestDebrisTCPerHectare: 8,
    });
  });
});

describe('generateSummaryFromLines', () => {
  it('uses calendar-year terminal month 12, prior December for y-1, and sums fire columns for endYear', () => {
    const lines: FullCAMOutputLine[] = [
      row(2019, 12, 10, 1),
      ...Array.from({ length: 5 }, (_, i) => row(2020, i + 1, 50 + i, 2, 0, 0)),
      row(2020, 6, 55, 2, 0.25, 0.05),
      ...Array.from({ length: 6 }, (_, i) => row(2020, i + 7, 56 + i, 2, 0, 0)),
      row(2020, 12, 88, 8, 0.5, 0.1),
    ];

    const result = generateSummaryFromLines(lines, {
      startYear: 2019,
      startMonth: 1,
      endYear: 2020,
      endMonth: 12,
    });

    expect(result.isOk).toBe(true);
    if (!result.isOk) {
      return;
    }
    const summary = result.value;

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

    const result = generateSummaryFromLines(lines, {
      startYear: 2000,
      startMonth: 1,
      endYear: 2001,
      endMonth: 6,
    });

    expect(result.isOk).toBe(true);
    if (!result.isOk) {
      return;
    }
    const summary = result.value;

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

  it('returns an error when no row exists for the current reporting year terminal month', () => {
    const lines: FullCAMOutputLine[] = [row(2020, 11, 1, 1)];

    const result = generateSummaryFromLines(lines, {
      startYear: 2020,
      startMonth: 1,
      endYear: 2020,
      endMonth: 12,
    });

    expect(result.isErr).toBe(true);
    if (!result.isErr) {
      return;
    }
    expect(result.error).toEqual({
      step: 'extract-results',
      message: expect.stringMatching(/no output row for current year y/),
    });
  });

  it('returns an error when no row exists for the previous reporting year terminal month', () => {
    const lines: FullCAMOutputLine[] = [row(2020, 12, 88, 8)];

    const result = generateSummaryFromLines(lines, {
      startYear: 2020,
      startMonth: 1,
      endYear: 2020,
      endMonth: 12,
    });

    expect(result.isErr).toBe(true);
    if (!result.isErr) {
      return;
    }
    expect(result.error).toEqual({
      step: 'extract-results',
      message: expect.stringMatching(/no output row for previous year y-1/),
    });
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

    const result = generateSummaryFromLines(lines, {
      startYear: 2020,
      startMonth: 1,
      endYear: 2020,
      endMonth: 12,
    });

    expect(result.isOk).toBe(true);
    if (!result.isOk) {
      return;
    }
    const summary = result.value;

    expect(summary.ch4FromBiomassBurningPerHectare).toBeCloseTo(0.1);
    expect(summary.n2oFromBiomassBurningPerHectare).toBeCloseTo(0.2);
  });
});

describe('extractKeyFieldsFromFullCAMOutput', () => {
  it('returns a batch error when CSV parsing fails', () => {
    const result = extractKeyFieldsFromFullCAMOutput(
      submission('only,a,header'),
    );

    expect(result).toEqual({
      uniqueAreaKey: 'area-1',
      error: {
        step: 'extract-results',
        message: 'Invalid CSV output: no data',
      },
    });
  });

  it('returns a batch error when the batch API CSV contains an error row', () => {
    const result = extractKeyFieldsFromFullCAMOutput(
      submission('col1,col2,col3\na,b,Area not found'),
    );

    expect(result).toEqual({
      uniqueAreaKey: 'area-1',
      error: {
        step: 'extract-results',
        message: 'Batch error: Area not found',
      },
    });
  });

  it('returns a batch error when summary extraction fails', () => {
    const outputCsv = [CSV_HEADER, csvLine(2020, 11, 2020.83, 1, 0, 0, 1)].join(
      '\n',
    );

    const result = extractKeyFieldsFromFullCAMOutput(submission(outputCsv));

    expect(result).toMatchObject({
      uniqueAreaKey: 'area-1',
      error: {
        step: 'extract-results',
        message: expect.stringMatching(/no output row for current year y/),
      },
    });
  });

  it('returns key fields when CSV parsing and summary extraction succeed', () => {
    const input = minimalAreaInput();
    const outputCsv = [
      CSV_HEADER,
      csvLine(2019, 12, 2019.92, 10, 0, 0, 1),
      csvLine(2020, 12, 2020.92, 88, 0.5, 0.1, 8),
    ].join('\n');

    const result = extractKeyFieldsFromFullCAMOutput(
      submission(outputCsv, input, 'scenario-1'),
    );

    expect(result).toEqual({
      uniqueAreaKey: 'scenario-1',
      inputArea: input,
      keyFields: {
        carbonMassInTreesPerHectare: 88,
        carbonMassInDebrisPerHectare: 8,
        carbonMassInTreesPerHectarePrevYear: 10,
        carbonMassInDebrisPerHectarePrevYear: 1,
        carbonMassInForestProductsPerHectare: 0,
        ch4FromBiomassBurningPerHectare: 0.5,
        n2oFromBiomassBurningPerHectare: 0.1,
      },
    });
  });
});
