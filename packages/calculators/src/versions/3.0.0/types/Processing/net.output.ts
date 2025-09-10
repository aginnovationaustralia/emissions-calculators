import { IsDefined, IsNumber } from 'class-validator';
import { SchemaDescription } from '../decorator.schema';

@SchemaDescription('Net emissions for the processing activity')
export class ProcessingNetOutput {
  @IsNumber()
  @IsDefined()
  total!: number;
}
