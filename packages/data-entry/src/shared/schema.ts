import { z } from 'zod';
import type { FileData, SymbolRecord } from './types';

const recordTypeSchema = z.enum(['expression', 'constant', 'input', 'unknown']);

export const symbolRecordSchema = z.object({
  symbol: z.string(),
  name: z.string(),
  units: z.string(),
  type: recordTypeSchema,
  expression: z.string(),
  line: z.string(),
  method2Input: z.boolean().default(false),
  notes: z.string(),
  values: z.string().optional(),
});

export const fileDataSchema = z.object({
  records: z.array(symbolRecordSchema),
});

export function parseFileData(data: unknown): { success: true; data: FileData } | { success: false; error: string } {
  const result = fileDataSchema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data as FileData };
  }
  const first = result.error.issues[0];
  const message = first
    ? `${first.path.join('.')}: ${first.message}`
    : String(result.error.message);
  return { success: false, error: message };
}

export function createEmptyRecord(symbol: string, type: SymbolRecord['type']): SymbolRecord {
  return {
    symbol,
    name: '',
    units: '',
    type,
    expression: '',
    line: '',
    method2Input: false,
    notes: '',
    ...(type === 'constant' ? { values: '' } : {}),
  };
}
