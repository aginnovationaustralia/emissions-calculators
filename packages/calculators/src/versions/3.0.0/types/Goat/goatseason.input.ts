import { IsDefined, IsNumber } from 'class-validator';
import { SchemaDescription } from '../decorator.schema';
import { DESCRIPTIONS } from '../descriptions.schema';

export class GoatSeason {
  @IsNumber()
  @SchemaDescription(DESCRIPTIONS.HEAD)
  @IsDefined()
  head!: number;
}
