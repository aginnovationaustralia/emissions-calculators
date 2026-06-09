import { isDefined } from '@/common/filters';
import {
  BatchSimulationResult,
  FullCAMOutputKeyFields,
  FullCAMOutputLine,
  FullCAMSubmissionSucceeded,
} from './types';

function extractFloatByColumnIndex(
  lineValues: string[],
  index: number,
): number {
  const value = lineValues[index];
  if (value === undefined) {
    return 0;
  }
  return parseFloat(value);
}

export const generateCsvLines = (
  csvString: string,
): FullCAMOutputLine[] | string => {
  const lines = csvString.split('\n');

  if (lines.length < 2) {
    return 'Invalid CSV output: no data';
  }

  const csvHeader = lines[0];
  const columnNames = csvHeader.split(',');
  const firstLineValues = lines[1].split(',');
  if (columnNames.length === 3) {
    return `Batch error: ${firstLineValues[2] ?? firstLineValues}`;
  }

  const indexCMassOfTrees = columnNames.indexOf('"C mass of trees  (tC/ha)"');
  const indexCH4EmittedDueToFire = columnNames.indexOf(
    '"CH4 emitted due to fire (tCH4/ha)"',
  );
  const indexN2OEmittedDueToFire = columnNames.indexOf(
    '"N2O emitted due to fire (tN2O/ha)"',
  );
  const indexCMassOfForestDebris = columnNames.indexOf(
    '"C mass of forest debris  (tC/ha)"',
  );
  const indexYear = columnNames.indexOf('Year');
  const indexMonth = columnNames.indexOf('Step In Year');
  const indexDecimalYear = columnNames.indexOf('Dec. Year');

  const summary = lines
    .map((line): FullCAMOutputLine | undefined => {
      if (line === '') {
        return undefined;
      }
      const values = line.split(',');

      // if (values.length !== 7) {
      //   throw new Error(`Invalid line '${line}' in csv output: ${csvString}`);
      // }

      const valueYear = values[indexYear];
      const valueMonth = values[indexMonth];
      const valueDecimalYear = values[indexDecimalYear];

      return {
        year: parseInt(valueYear),
        month: parseInt(valueMonth),
        decimalYear: parseFloat(valueDecimalYear),
        carbonMassOfTreesTCPerHectare: extractFloatByColumnIndex(
          values,
          indexCMassOfTrees,
        ),
        ch4EmittedDueToFireTCH4PerHectare: extractFloatByColumnIndex(
          values,
          indexCH4EmittedDueToFire,
        ),
        n2oEmittedDueToFireTN2OPerHectare: extractFloatByColumnIndex(
          values,
          indexN2OEmittedDueToFire,
        ),
        carbonMassOfForestDebrisTCPerHectare: extractFloatByColumnIndex(
          values,
          indexCMassOfForestDebris,
        ),
      };
    })
    .filter(isDefined);

  return summary;
};

/*
Summary field definitions: see FullCAMOutputKeyFields in ./types.ts

Determining tree and debris carbon for plantings, regeneration, farm forestry and commercial plantation forestry

To determine Ct,i,j,y and Cd,i,j,y, find the last row for the year y in their respective columns of
the output CSV as indicated in Table 11.
The last entry will be the last month of the year. This will be where the “Step In Year”
column contains 6 (for financial year) or 12 (for calendar year).

To determine Ct,i,j,y-1 and Cd,i,j,y-1, find the last row for the year before y in their respective
columns of the output CSV as indicated in Table 11. For example, if y is the financial year
2015-16, then y-1 is the financial year 2014-15. Alternatively, if y is the calendar year 2016,
then y-1 is the calendar year 2015.

To determine Cp,i,j=6-7,y, find the row corresponding to the date of the clearing with
product recovery event. If this is the first clearing with product recovery event, then
Cp,i,j=6-7,y is equal to the value in this cell. If the simulation contains an earlier clearing
with product recovery event, then there may be some carbon in the “C mass of forest
products (tC/ha)” column remaining from the previous clearing event. In that case,
Cp,i,j=6-7,y is equal to the difference between the value in the highlighted and previous
rows. (Not implemented: CSV line type has no forest-products column yet; returns 0.)

Determining emissions from biomass burning

To determine Eg,i,j,y where g = CH4, sum all the rows in the “CH4 emitted due to fire (tCH4/ha)” column within the year y.
To determine Eg,i,j,y where g = N2O, sum all the rows in the “N2O emitted due to fire (tN2O/ha)” column within the year y.
*/

export type ExtractionOptions = {
  startYear: number;
  startMonth: number;
  endYear: number;
  endMonth: number;
};

function terminalStockMonth(endMonth: number): 6 | 12 {
  return endMonth === 6 ? 6 : 12;
}

function findLastRowForYearMonth(
  lines: FullCAMOutputLine[],
  year: number,
  month: number,
): FullCAMOutputLine | undefined {
  let found: FullCAMOutputLine | undefined;
  for (const line of lines) {
    if (line.year === year && line.month === month) {
      found = line;
    }
  }
  return found;
}

function requireRow(
  lines: FullCAMOutputLine[],
  year: number,
  month: number,
  label: string,
): FullCAMOutputLine {
  const row = findLastRowForYearMonth(lines, year, month);
  if (!row) {
    throw new Error(
      `FullCAM summary: no output row for ${label} at year=${year}, month=${month} (terminal month per reporting period).`,
    );
  }
  return row;
}

function isInReportingYearForEmissions(
  line: FullCAMOutputLine,
  endYear: number,
  endMonth: number,
): boolean {
  if (endMonth === 6) {
    return (
      (line.year === endYear - 1 && line.month >= 7) ||
      (line.year === endYear && line.month <= 6)
    );
  }
  return line.year === endYear;
}

function finiteOrZero(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function sumFireForReportingYear(
  lines: FullCAMOutputLine[],
  endYear: number,
  endMonth: number,
): { ch4: number; n2o: number } {
  let ch4 = 0;
  let n2o = 0;
  for (const line of lines) {
    if (!isInReportingYearForEmissions(line, endYear, endMonth)) {
      continue;
    }
    ch4 += finiteOrZero(line.ch4EmittedDueToFireTCH4PerHectare);
    n2o += finiteOrZero(line.n2oEmittedDueToFireTN2OPerHectare);
  }
  return { ch4, n2o };
}

/**
 * Builds {@link FullCAMOutputKeyFields} from sorted monthly FullCAM lines. See block comment above
 * {@link ExtractionOptions} for methodology; calendar vs financial year follows `endMonth` (12 vs 6).
 */
export const generateSummaryFromLines = (
  lines: FullCAMOutputLine[],
  options: ExtractionOptions,
): FullCAMOutputKeyFields => {
  const { endYear, endMonth } = options;
  const terminalMonth = endMonth; // terminalStockMonth(endMonth);
  const prevYear = endYear - 1;

  const rowY = requireRow(lines, endYear, terminalMonth, 'current year y');
  const rowY1 = requireRow(lines, prevYear, terminalMonth, 'previous year y-1');

  const { ch4, n2o } = sumFireForReportingYear(lines, endYear, endMonth);

  return {
    carbonMassInTreesPerHectare: rowY.carbonMassOfTreesTCPerHectare, // Ct,i,j,y
    carbonMassInDebrisPerHectare: rowY.carbonMassOfForestDebrisTCPerHectare, // Cd,i,j,y
    carbonMassInTreesPerHectarePrevYear: rowY1.carbonMassOfTreesTCPerHectare, // Ct,i,j,y-1
    carbonMassInDebrisPerHectarePrevYear:
      rowY1.carbonMassOfForestDebrisTCPerHectare, // Cd,i,j,y-1
    carbonMassInForestProductsPerHectare: 0, // Cp,i,j=6-7,y // TODO
    ch4FromBiomassBurningPerHectare: ch4, // Eg,i,j,y for g = CH4
    n2oFromBiomassBurningPerHectare: n2o, // Eg,i,j,y for g = N2O
  };
};

export const extractKeyFieldsFromFullCAMOutput = (
  submission: FullCAMSubmissionSucceeded,
): BatchSimulationResult => {
  // console.log(
  //   'extracting key fields from fullcam output',
  //   submission.area.uniqueAreaKey,
  //   submission.area.input,
  // );
  const lines = generateCsvLines(submission.outputCsv);

  if (typeof lines === 'string') {
    return {
      uniqueAreaKey: submission.area.uniqueAreaKey,
      error: lines,
    };
  }

  return {
    uniqueAreaKey: submission.area.uniqueAreaKey,
    inputArea: submission.area.input,
    keyFields: generateSummaryFromLines(lines, submission.area.input),
  };
};
