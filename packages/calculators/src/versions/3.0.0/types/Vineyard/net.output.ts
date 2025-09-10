import { IsDefined, IsNumber } from 'class-validator';
import { IsNumberArray, SchemaDescription } from '../decorator.schema';

@SchemaDescription('Net emissions for each vineyard (in order)')
export class VineyardNetOutput {
  @IsNumber()
  @IsDefined()
  total!: number;

  @IsNumberArray()
  @IsDefined()
  vineyards!: number[];
}
