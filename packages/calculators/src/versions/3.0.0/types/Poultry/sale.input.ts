import { IsDefined, IsNumber } from 'class-validator';
import { SchemaDescription } from '../decorator.schema';
import { DESCRIPTIONS } from '../descriptions.schema';

export class PoultrySale {
  @IsNumber()
  @SchemaDescription(DESCRIPTIONS.HEADSOLD)
  @IsDefined()
  head!: number;

  @IsNumber()
  @SchemaDescription(DESCRIPTIONS.SALEWEIGHT)
  @IsDefined()
  saleWeight!: number;
}
