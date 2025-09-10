import { IsDefined, IsNumber } from 'class-validator';
import { IsNumberArray, SchemaDescription } from '../decorator.schema';

@SchemaDescription('Net emissions for each crop (in order)')
export class RiceNetOutput {
  @IsNumber()
  @IsDefined()
  total!: number;

  @IsNumberArray()
  @IsDefined()
  crops!: number[];
}
