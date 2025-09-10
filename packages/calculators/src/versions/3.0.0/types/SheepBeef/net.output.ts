import { IsDefined, IsNumber } from 'class-validator';
import { SchemaDescription } from '../decorator.schema';
import { OUTPUTDESCRIPTIONS } from '../descriptions.schema';

export class SheepBeefNet {
  @IsNumber()
  @SchemaDescription(OUTPUTDESCRIPTIONS.netEmissionsTotal)
  @IsDefined()
  total!: number;

  @IsNumber()
  @SchemaDescription('Net emissions of beef, in tonnes-CO2e/year')
  @IsDefined()
  beef!: number;

  @IsNumber()
  @SchemaDescription('Net emissions of sheep, in tonnes-CO2e/year')
  @IsDefined()
  sheep!: number;
}
