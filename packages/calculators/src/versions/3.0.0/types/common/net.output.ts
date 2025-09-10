import { IsDefined, IsNumber } from 'class-validator';
import { SchemaDescription } from '../decorator.schema';

@SchemaDescription('Net emissions for the activity')
export class NetOutput {
  @IsNumber()
  @IsDefined()
  total!: number;
}
