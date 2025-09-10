import { IsDefined, IsNumber } from 'class-validator';
import { SchemaDescription } from '../decorator.schema';

@SchemaDescription('Net emissions for Buffalo')
export class BuffaloNetOutput {
  @IsNumber()
  @IsDefined()
  total!: number;
}
