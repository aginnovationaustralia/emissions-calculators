import { IsDefined, IsNumber } from 'class-validator';
import { SchemaDescription } from '../decorator.schema';

@SchemaDescription('Net emissions for pork')
export class PorkNetOutput {
  @IsNumber()
  @IsDefined()
  total!: number;
}
