import { IsDefined, IsNumber } from 'class-validator';
import { SchemaDescription } from '../decorator.schema';
import { OUTPUTDESCRIPTIONS } from '../descriptions.schema';

export class DairyNet {
  @IsNumber()
  @SchemaDescription(OUTPUTDESCRIPTIONS.netEmissionsTotal)
  @IsDefined()
  total!: number;
}
