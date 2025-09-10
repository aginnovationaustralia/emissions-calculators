import {
  IsDefined,
  IsEnum,
  IsNumber,
  IsOptional,
  Max,
  Min,
} from 'class-validator';
import 'reflect-metadata';
import { SchemaDescription } from '../decorator.schema';
import { AquacultureBait } from '../types';

export class AquacultureBaitPurchase {
  @IsEnum(AquacultureBait)
  @SchemaDescription('Bait product type')
  @IsDefined()
  type!: AquacultureBait;

  @IsNumber()
  @SchemaDescription('Purchased product in tonnes')
  @IsDefined()
  purchasedTonnes!: number;

  @IsNumber()
  @SchemaDescription('Additional ingredient fraction, from 0 to 1')
  @IsDefined()
  @Min(0)
  @Max(1)
  additionalIngredients!: number;

  @IsNumber()
  @SchemaDescription(
    'Emissions intensity of additional ingredients, in kg CO2e/kg bait (default 0)',
  )
  @IsOptional()
  emissionsIntensity: number = 0;
}
