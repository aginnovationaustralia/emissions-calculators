import { IsDefined, IsEnum, IsNumber } from 'class-validator';
import { SchemaDescription } from '../decorator.schema';
import { DESCRIPTIONS } from '../descriptions.schema';
import {
  FeedlotPurchaseSourceLocation,
  FeedlotPurchaseSourceLocations,
} from '../types';

export class FeedlotPurchase {
  @IsNumber()
  @SchemaDescription(DESCRIPTIONS.HEADPURCHASED)
  @IsDefined()
  head!: number;

  @IsNumber()
  @SchemaDescription(DESCRIPTIONS.PURCHASEDWEIGHT)
  @IsDefined()
  purchaseWeight!: number;

  @IsEnum(FeedlotPurchaseSourceLocations)
  @SchemaDescription('Source location of trading cattle purchases')
  @IsDefined()
  purchaseSource: FeedlotPurchaseSourceLocation = 'sth NSW/VIC/sth SA';
}
