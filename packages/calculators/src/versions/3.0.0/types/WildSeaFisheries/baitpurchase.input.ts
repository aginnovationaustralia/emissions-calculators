import { IsDefined, IsEnum, IsNumber, Max, Min } from 'class-validator';
import 'reflect-metadata';
import { SchemaDescription } from '../decorator.schema';
import { WildSeaFisheriesBait, WildSeaFisheriesBaits } from '../types';

export class WildSeaFisheriesBaitPurchase {
  @IsEnum(WildSeaFisheriesBaits)
  @SchemaDescription('Bait product type')
  @IsDefined()
  type!: WildSeaFisheriesBait;

  @IsNumber()
  @SchemaDescription('Purchased product in tonnes')
  @IsDefined()
  purchased!: number;

  @IsNumber()
  @SchemaDescription('Additional ingredient fraction, from 0 to 1')
  @IsDefined()
  @Min(0)
  @Max(1)
  additionalIngredient!: number;

  @IsNumber()
  @SchemaDescription('Emissions intensity of product, in kg CO2e/kg')
  @IsDefined()
  emissionsIntensity!: number;
}
