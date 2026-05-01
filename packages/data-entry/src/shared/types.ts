export type RecordType = 'expression' | 'constant' | 'input' | 'unknown';

export interface SymbolRecord {
  symbol: string;
  name: string;
  units: string;
  type: RecordType;
  expression: string;
  line: string;
  /** Persisted as `method2Input` in JSON; defaults to false when absent. */
  method2Input: boolean;
  notes: string;
  values?: string;
}

export interface FileData {
  records: SymbolRecord[];
}
