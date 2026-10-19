import { object } from '@/types/schemas';
import { z } from 'zod';

export type QualityLevel = '1' | '2' | '3' | '4' | '5' | 'Unknown';
const QualityLevelEnum = z.enum(['1', '2', '3', '4', '5', 'Unknown']).meta({
  id: 'QualityLevel',
});

export type QualityCategory = 'Temporal' | 'Spatial' | 'SampleSize' | 'Scope3';

export type QualityTable = Partial<Record<QualityCategory, QualityLevel>>;

export const QualityTableSchema = object({
  Temporal: QualityLevelEnum.optional(),
  Spatial: QualityLevelEnum.optional(),
  SampleSize: QualityLevelEnum.optional(),
  Scope3: QualityLevelEnum.optional(),
}).meta({
  id: 'QualityTable',
});
