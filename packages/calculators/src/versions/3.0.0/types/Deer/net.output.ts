import { IsDefined, IsNumber } from 'class-validator';
import { SchemaDescription } from '../decorator.schema';

@SchemaDescription('Net emissions for deer')
export class DeerNetOutput {
  @IsNumber()
  @IsDefined()
  total!: number;
}
