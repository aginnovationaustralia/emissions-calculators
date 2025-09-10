import { IsDefined, IsNumber } from 'class-validator';
import { SchemaDescription } from '../decorator.schema';
import { OUTPUTDESCRIPTIONS } from '../descriptions.schema';

export class PoultryNet {
  @IsNumber()
  @SchemaDescription(OUTPUTDESCRIPTIONS.netEmissionsTotal)
  @IsDefined()
  total!: number;

  @IsNumber()
  @SchemaDescription('Net emissions of broilers, in tonnes-CO2e/year')
  @IsDefined()
  broilers!: number;

  @IsNumber()
  @SchemaDescription('Net emissions of layers, in tonnes-CO2e/year')
  @IsDefined()
  layers!: number;
}
