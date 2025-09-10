import { IsDefined, IsNumber } from 'class-validator';
import { SchemaDescription } from './decorator.schema';
import { OUTPUTDESCRIPTIONS } from './descriptions.schema';

@SchemaDescription(OUTPUTDESCRIPTIONS.purchasedOffsets)
export class PurchasedOffsetsOutput {
  @IsNumber()
  @SchemaDescription(OUTPUTDESCRIPTIONS.totalSequestration)
  @IsDefined()
  total!: number;
}
