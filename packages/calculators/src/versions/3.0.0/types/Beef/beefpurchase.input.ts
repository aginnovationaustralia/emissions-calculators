import { IsDefined, IsEnum } from 'class-validator';
import { SchemaDescription } from '../decorator.schema';
import {
  LivestockSourceLocation,
  LivestockSourceLocations,
} from '../livestock';
import { LivestockPurchase } from '../livestockPurchase.input';

@SchemaDescription('Beef purchase')
export class BeefPurchase extends LivestockPurchase {
  @SchemaDescription('Source location of livestock purchase')
  @IsEnum(LivestockSourceLocations)
  @IsDefined()
  purchaseSource!: LivestockSourceLocation;
}
