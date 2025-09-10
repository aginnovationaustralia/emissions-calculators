import { IsDefined, IsNumber } from 'class-validator';
import { SchemaDescription } from '../decorator.schema';
import { OUTPUTDESCRIPTIONS } from '../descriptions.schema';

export class SheepNet {
  @IsNumber()
  @SchemaDescription(OUTPUTDESCRIPTIONS.netEmissionsTotal)
  @IsDefined()
  total!: number;

  @IsNumber()
  @SchemaDescription('Net emissions of sheep, in tonnes-CO2e/year')
  @IsDefined()
  sheep!: number;
}
