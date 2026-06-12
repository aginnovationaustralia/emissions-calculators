import { getSheet } from '../src/test/common/sheets';

const colLetters = (n: number): string => {
  let s = '';
  while (n > 0) {
    const r = (n - 1) % 26;
    s = String.fromCharCode(65 + r) + s;
    n = Math.floor((n - 1) / 26);
  }
  return s;
};

const main = async (): Promise<void> => {
  const [workbook, sheetName, headerRow, dataRow] = process.argv.slice(2);
  if (!workbook || !sheetName || !headerRow || !dataRow) {
    console.error(
      'Usage: tsx scripts/dump-row-with-headers.ts <workbook> <sheet> <headerRow> <dataRow>',
    );
    process.exit(1);
  }
  const sheet = await getSheet(workbook, sheetName);
  console.log('col\tsymbol\tvalue\tformula');
  for (let ci = 1; ci <= 78; ci++) {
    const col = colLetters(ci);
    const header = sheet.cell(`${col}${headerRow}`).value();
    if (header === undefined || header === null || String(header).trim() === '') {
      continue;
    }
    const cell = sheet.cell(`${col}${dataRow}`);
    const formula = cell.formula();
    console.log(
      `${col}\t${header}\t${cell.value() ?? ''}\t${formula ?? ''}`,
    );
  }
};

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
