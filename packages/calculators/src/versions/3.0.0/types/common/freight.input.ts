import { IsDefined, IsEnum, IsNumber } from 'class-validator';
import { SchemaDescription } from '../decorator.schema';
import { DESCRIPTIONS } from '../descriptions.schema';
import { FreightTypes } from '../types';

export class FreightInput {
  @IsEnum(FreightTypes)
  @SchemaDescription(DESCRIPTIONS.FREIGHT_TYPE)
  @IsDefined()
  type!: FreightTypes;

  @IsNumber()
  @SchemaDescription(DESCRIPTIONS.TOTAL_KM_TONNES)
  @IsDefined()
  totalKmTonnes!: number;
}
