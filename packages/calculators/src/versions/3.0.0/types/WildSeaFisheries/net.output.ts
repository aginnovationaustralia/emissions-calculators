import { IsDefined, IsNumber } from 'class-validator';
import { IsNumberArray, SchemaDescription } from '../decorator.schema';

@SchemaDescription('Net emissions for each enterprise (in order)')
export class WildSeaFisheriesNetOutput {
  @IsNumber()
  @IsDefined()
  total!: number;

  @IsNumberArray()
  @IsDefined()
  enterprises!: number[];
}
