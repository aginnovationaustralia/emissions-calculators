import type {
  AreaPlotContent,
  FullCAMOutputLine,
  FullCAMSubmission,
} from './types';

import {
  FullCAMAreaInput,
  FullCAMAreaSchema,
  FullCAMClearableAreaInput,
  FullCAMUnclearableAreaInput,
} from './input';
import {
  extractKeyFieldsFromFullCAMOutput,
  generateCsvLines,
  generateSummaryFromLines,
} from './response';
import { Result } from './result';

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

const DEFAULT_INITIAL_TREES: FullCAMClearableAreaInput['initialTrees'] = {
  speciesName: 'Environmental plantings',
};

function isClearableOverrides(
  overrides:
    | Partial<FullCAMClearableAreaInput>
    | Partial<FullCAMUnclearableAreaInput>,
): overrides is Partial<FullCAMClearableAreaInput> {
  return (
    ('isInLeachingZone' in overrides &&
      overrides.isInLeachingZone !== undefined) ||
    ('initialTrees' in overrides &&
      overrides.initialTrees !== undefined &&
      overrides.initialTrees !== false)
  );
}

function minimalAreaInput(
  overrides?: Partial<FullCAMUnclearableAreaInput>,
): FullCAMUnclearableAreaInput;
function minimalAreaInput(
  overrides: Partial<FullCAMClearableAreaInput>,
): FullCAMClearableAreaInput;
function minimalAreaInput(
  overrides:
    | Partial<FullCAMClearableAreaInput>
    | Partial<FullCAMUnclearableAreaInput> = {},
): FullCAMAreaInput {
  const base: Omit<FullCAMUnclearableAreaInput, 'initialTrees'> = {
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
  };

  if (isClearableOverrides(overrides)) {
    return {
      ...base,
      initialTrees: DEFAULT_INITIAL_TREES,
      isInLeachingZone: false,
      ...overrides,
    };
  }

  return {
    ...base,
    initialTrees: false,
    ...overrides,
  };
}

function areaPlotContent(
  inputOverrides: Partial<FullCAMUnclearableAreaInput> = {},
  overrides: Partial<
    Pick<AreaPlotContent, 'plotContent' | 'plotfileName' | 'uniqueAreaKey'>
  > = {},
): AreaPlotContent {
  const uniqueAreaKey = overrides.uniqueAreaKey ?? 'area-1';
  const originalInput = minimalAreaInput(inputOverrides);

  return {
    uniqueAreaKey,
    plotfileName: overrides.plotfileName ?? `${uniqueAreaKey}.plo`,
    plotContent: overrides.plotContent ?? '',
    input: FullCAMAreaSchema.parse(originalInput),
    originalInput,
  };
}

function submission(
  outputCsv: string,
  input: FullCAMUnclearableAreaInput = minimalAreaInput(),
  uniqueAreaKey = 'area-1',
): FullCAMSubmission {
  return {
    area: areaPlotContent(input, { uniqueAreaKey }),
    outputCsv,
  };
}

function row({
  year,
  month,
  trees,
  debris,
  products = 0,
  ch4 = 0,
  n2o = 0,
  decimalYear = year + month / 12,
}: {
  year: number;
  month: number;
  trees: number;
  debris: number;
  products?: number;
  ch4?: number;
  n2o?: number;
  decimalYear?: number;
}): FullCAMOutputLine {
  return {
    year,
    month,
    decimalYear,
    carbonMassOfTreesTCPerHectare: trees,
    carbonMassOfForestDebrisTCPerHectare: debris,
    ch4EmittedDueToFireTCH4PerHectare: ch4,
    n2oEmittedDueToFireTN2OPerHectare: n2o,
    carbonMassOfForestProductsTCPerHectare: products,
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
      carbonMassOfForestProductsTCPerHectare: 0,
    });
  });
});

describe('generateSummaryFromLines', () => {
  it('uses calendar-year terminal month 12, prior December for y-1, and sums fire columns for endYear', () => {
    const lines: FullCAMOutputLine[] = [
      row({ year: 2019, month: 12, trees: 10, debris: 1 }),
      ...Array.from({ length: 5 }, (_, i) =>
        row({ year: 2020, month: i + 1, trees: 50 + i, debris: 2 }),
      ),
      row({
        year: 2020,
        month: 6,
        trees: 55,
        debris: 2,
        ch4: 0.25,
        n2o: 0.05,
      }),
      ...Array.from({ length: 6 }, (_, i) =>
        row({ year: 2020, month: i + 7, trees: 56 + i, debris: 2 }),
      ),
      row({
        year: 2020,
        month: 12,
        trees: 88,
        debris: 8,
        ch4: 0.5,
        n2o: 0.1,
      }),
    ];

    const result = generateSummaryFromLines(
      lines,
      areaPlotContent({
        startYear: 2019,
        startMonth: 1,
        endYear: 2020,
        endMonth: 12,
      }),
    );

    expect(result.isOk).toBe(true);
    if (!result.isOk) {
      return;
    }
    const summary = result.value.keyFields;

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
      row({ year: 2000, month: 6, trees: 1, debris: 10 }),
      row({
        year: 2000,
        month: 7,
        trees: 2,
        debris: 11,
        ch4: 0.1,
        n2o: 0.01,
      }),
      row({
        year: 2000,
        month: 12,
        trees: 3,
        debris: 12,
        ch4: 0.2,
        n2o: 0.02,
      }),
      row({
        year: 2001,
        month: 1,
        trees: 4,
        debris: 13,
        ch4: 0.4,
        n2o: 0.04,
      }),
      row({
        year: 2001,
        month: 6,
        trees: 100,
        debris: 20,
        ch4: 0.8,
        n2o: 0.08,
      }),
      row({
        year: 2001,
        month: 7,
        trees: 101,
        debris: 21,
        ch4: 9,
        n2o: 9,
      }),
    ];

    const result = generateSummaryFromLines(
      lines,
      areaPlotContent({
        startYear: 2000,
        startMonth: 1,
        endYear: 2001,
        endMonth: 6,
      }),
    );

    expect(result.isOk).toBe(true);
    if (!result.isOk) {
      return;
    }
    const summary = result.value.keyFields;

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
    const lines: FullCAMOutputLine[] = [
      row({ year: 2020, month: 11, trees: 1, debris: 1 }),
    ];

    const area = areaPlotContent({
      startYear: 2020,
      startMonth: 1,
      endYear: 2020,
      endMonth: 12,
    });
    const result = generateSummaryFromLines(lines, area);

    expect(result.isErr).toBe(true);
    if (!result.isErr) {
      return;
    }
    expect(result.error).toEqual({
      area,
      error: {
        step: 'extract-results',
        message: expect.stringMatching(/no output row for current year y/),
      },
    });
  });

  it('returns an error when no row exists for the previous reporting year terminal month', () => {
    const lines: FullCAMOutputLine[] = [
      row({ year: 2020, month: 12, trees: 88, debris: 8 }),
    ];

    const area = areaPlotContent({
      startYear: 2020,
      startMonth: 1,
      endYear: 2020,
      endMonth: 12,
    });
    const result = generateSummaryFromLines(lines, area);

    expect(result.isErr).toBe(true);
    if (!result.isErr) {
      return;
    }
    expect(result.error).toEqual({
      area,
      error: {
        step: 'extract-results',
        message: expect.stringMatching(/no output row for previous year y-1/),
      },
    });
  });

  it('treats non-finite fire values as zero when summing', () => {
    const lines: FullCAMOutputLine[] = [
      row({ year: 2019, month: 12, trees: 0, debris: 0 }),
      {
        ...row({ year: 2020, month: 1, trees: 0, debris: 0 }),
        ch4EmittedDueToFireTCH4PerHectare: Number.NaN,
        n2oEmittedDueToFireTN2OPerHectare: Number.NaN,
      },
      row({
        year: 2020,
        month: 12,
        trees: 1,
        debris: 1,
        ch4: 0.1,
        n2o: 0.2,
      }),
    ];

    const result = generateSummaryFromLines(
      lines,
      areaPlotContent(
        {
          startYear: 2020,
          startMonth: 1,
          endYear: 2020,
          endMonth: 12,
        },
        {
          uniqueAreaKey: 'test',
          plotfileName: 'test.plo',
        },
      ),
    );

    expect(result.isOk).toBe(true);
    if (!result.isOk) {
      return;
    }
    const summary = result.value.keyFields;

    expect(summary.ch4FromBiomassBurningPerHectare).toBeCloseTo(0.1);
    expect(summary.n2oFromBiomassBurningPerHectare).toBeCloseTo(0.2);
  });
});

describe('extractKeyFieldsFromFullCAMOutput', () => {
  it('returns a batch error when CSV parsing fails', () => {
    const testInput = submission('only,a,header');
    const result = extractKeyFieldsFromFullCAMOutput(testInput);

    expect(result).toEqual(
      Result.err({
        area: testInput.area,
        error: {
          step: 'extract-results',
          message: 'Invalid CSV output: no data',
        },
      }),
    );
  });

  it('returns a batch error when the batch API CSV contains an error row', () => {
    const testInput = submission('col1,col2,col3\na,b,Area not found');
    const result = extractKeyFieldsFromFullCAMOutput(testInput);

    expect(result).toEqual(
      Result.err({
        area: testInput.area,
        error: {
          step: 'extract-results',
          message: 'Batch error: Area not found',
        },
      }),
    );
  });

  it('returns a batch error when summary extraction fails', () => {
    const outputCsv = [CSV_HEADER, csvLine(2020, 11, 2020.83, 1, 0, 0, 1)].join(
      '\n',
    );

    const testInput = submission(outputCsv);
    const result = extractKeyFieldsFromFullCAMOutput(testInput);

    expect(result).toEqual(
      Result.err({
        area: testInput.area,
        error: {
          step: 'extract-results',
          message: expect.stringMatching(/no output row for current year y/),
        },
      }),
    );
  });

  it('returns key fields when CSV parsing and summary extraction succeed', () => {
    const input = minimalAreaInput();
    const outputCsv = [
      CSV_HEADER,
      csvLine(2019, 12, 2019.92, 10, 0, 0, 1),
      csvLine(2020, 12, 2020.92, 88, 0.5, 0.1, 8),
    ].join('\n');

    const testInput = submission(outputCsv, input, 'scenario-1');
    const result = extractKeyFieldsFromFullCAMOutput(testInput);

    expect(result).toEqual(
      Result.ok({
        area: testInput.area,
        keyFields: {
          carbonMassInTreesPerHectare: 88,
          carbonMassInDebrisPerHectare: 8,
          carbonMassInTreesPerHectarePrevYear: 10,
          carbonMassInDebrisPerHectarePrevYear: 1,
          carbonMassInForestProductsPerHectare: 0,
          ch4FromBiomassBurningPerHectare: 0.5,
          n2oFromBiomassBurningPerHectare: 0.1,
        },
      }),
    );
  });
});
