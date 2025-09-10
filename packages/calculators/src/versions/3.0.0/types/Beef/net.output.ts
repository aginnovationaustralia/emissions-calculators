import { IsDefined, IsNumber } from 'class-validator';
import { SchemaDescription } from '../decorator.schema';
import { OUTPUTDESCRIPTIONS } from '../descriptions.schema';

export class BeefNet {
  @IsNumber()
  @SchemaDescription(OUTPUTDESCRIPTIONS.netEmissionsTotal)
  @IsDefined()
  total!: number;

  @IsNumber()
  @SchemaDescription('Net emissions of beef, in tonnes-CO2e/year')
  @IsDefined()
  beef!: number;
}
