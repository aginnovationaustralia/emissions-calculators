export type RecordType = 'expression' | 'constant' | 'input' | 'unknown';

export interface SymbolRecord {
  symbol: string;
  name: string;
  units: string;
  type: RecordType;
  expression: string;
  line: string;
  notes: string;
  values?: string;
}

export interface FileData {
  records: SymbolRecord[];
}
