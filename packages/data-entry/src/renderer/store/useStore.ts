import { extractSymbols, parseExpressionLine } from '@/shared/expressionParser';
import { createEmptyRecord } from '@/shared/schema';
import type { FileData, SymbolRecord } from '@/shared/types';
import { create } from 'zustand';

interface AppState {
  records: SymbolRecord[];
  filePath: string | null;
  dirty: boolean;
  loadError: string | null;
  excelFilePath: string | null;
  excelSheetNames: string[];
  selectedExcelSheet: string | null;
}

interface AppActions {
  setRecords: (records: SymbolRecord[]) => void;
  addRecord: (record: SymbolRecord) => void;
  updateRecord: (index: number, updates: Partial<SymbolRecord>) => void;
  removeRecord: (index: number) => void;
  moveRecord: (index: number, direction: 'up' | 'down') => void;
  moveRecordTo: (fromIndex: number, toIndex: number) => void;
  loadFromJson: (data: FileData) => void;
  setFilePath: (path: string | null) => void;
  setDirty: (dirty: boolean) => void;
  setLoadError: (error: string | null) => void;
  setExcelFile: (path: string | null, sheetNames: string[]) => void;
  setSelectedExcelSheet: (sheet: string | null) => void;
  addExpressionFromPaste: (text: string, line?: string) => void;
  newDocument: () => void;
}

function findRecordBySymbol(
  records: SymbolRecord[],
  symbol: string,
): SymbolRecord | undefined {
  return records.find((r) => r.symbol === symbol);
}
export const useStore = create<AppState & AppActions>((set, get) => ({
  records: [],
  filePath: null,
  dirty: false,
  loadError: null,
  excelFilePath: null,
  excelSheetNames: [],
  selectedExcelSheet: null,

  setRecords: (records) => set({ records, dirty: true }),
  addRecord: (record) =>
    set((state) => ({
      records: [...state.records, record],
      dirty: true,
    })),
  updateRecord: (index, updates) =>
    set((state) => {
      const next = [...state.records];
      if (index < 0 || index >= next.length) return state;
      next[index] = { ...next[index], ...updates };
      return { records: next, dirty: true };
    }),
  removeRecord: (index) =>
    set((state) => ({
      records: state.records.filter((_, i) => i !== index),
      dirty: true,
    })),
  moveRecord: (index, direction) =>
    set((state) => {
      const { records } = state;
      if (index < 0 || index >= records.length) return state;
      const nextIndex = direction === 'up' ? index - 1 : index + 1;
      if (nextIndex < 0 || nextIndex >= records.length) return state;
      const next = [...records];
      [next[index], next[nextIndex]] = [next[nextIndex], next[index]];
      return { records: next, dirty: true };
    }),
  moveRecordTo: (fromIndex, toIndex) =>
    set((state) => {
      const { records } = state;
      if (fromIndex < 0 || fromIndex >= records.length) return state;
      const clampedTo = Math.max(0, Math.min(toIndex, records.length - 1));
      if (clampedTo === fromIndex) return state;
      const copy = records.slice();
      const [item] = copy.splice(fromIndex, 1);
      copy.splice(clampedTo, 0, item);
      return { records: copy, dirty: true };
    }),
  loadFromJson: (data) =>
    set({
      records: data.records,
      loadError: null,
      dirty: false,
    }),
  setFilePath: (filePath) => set({ filePath }),
  setDirty: (dirty) => set({ dirty }),
  setLoadError: (loadError) => set({ loadError }),
  setExcelFile: (path, sheetNames) =>
    set({
      excelFilePath: path,
      excelSheetNames: sheetNames,
      selectedExcelSheet:
        sheetNames.length > 0 ? sheetNames[0] : null,
    }),
  setSelectedExcelSheet: (sheet) => set({ selectedExcelSheet: sheet }),

  addExpressionFromPaste: (text, line) => {
    const { symbol, expression } = parseExpressionLine(text);
    const state = get();
    const records = [...state.records];

    const expr = symbol && expression ? expression : text;
    const symbols = extractSymbols(expr);

    // Add missing dependent symbols first (so they appear above the expression record)
    for (const sym of symbols) {
      if (findRecordBySymbol(records, sym)) continue;
      records.push(createEmptyRecord(sym, 'unknown'));
    }

    const lineValue = (line ?? '').trim();

    // Then add or update the expression record at the end (match existing by symbol, case-insensitive)
    if (symbol && expression) {
      const existing = findRecordBySymbol(records, symbol);
      if (existing) {
        const idx = records.indexOf(existing);
        records[idx] = {
          ...existing,
          type: 'expression',
          expression,
          ...(lineValue !== '' && { line: lineValue }),
        };
      } else {
        records.push({
          ...createEmptyRecord(symbol, 'expression'),
          expression,
          ...(lineValue !== '' && { line: lineValue }),
        });
      }
    }

    set({ records, dirty: true });
  },

  newDocument: () =>
    set({
      records: [],
      filePath: null,
      dirty: false,
      loadError: null,
      excelFilePath: null,
      excelSheetNames: [],
      selectedExcelSheet: null,
    }),
}));
