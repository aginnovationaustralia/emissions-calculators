import { IsDefined, IsNumber } from 'class-validator';
import { SchemaDescription } from '../decorator.schema';

@SchemaDescription('Net emissions for goat')
export class GoatNetOutput {
  @IsNumber()
  @IsDefined()
  total!: number;
}
