import { IsDefined, IsNumber } from 'class-validator';
import { SchemaDescription } from './decorator.schema';
import { DESCRIPTIONS } from './descriptions.schema';

export class LivestockPurchase {
  @IsNumber()
  @IsDefined()
  @SchemaDescription(DESCRIPTIONS.HEADPURCHASED)
  head!: number;

  @IsNumber()
  @IsDefined()
  @SchemaDescription(DESCRIPTIONS.PURCHASEDWEIGHT)
  purchaseWeight!: number;
}
