import { Type } from 'class-transformer';
import { IsDefined, IsNumber, Max, Min, ValidateNested } from 'class-validator';
import 'reflect-metadata';

import { SchemaDescription } from '../decorator.schema';
import { FeedIngredients } from './feedingredients.input';

@SchemaDescription('Pig feed product')
export class Feed {
  @IsNumber()
  @SchemaDescription('Pig feed purchased, in tonnes')
  @IsDefined()
  feedPurchased!: number;

  @IsNumber()
  @SchemaDescription(
    'Fraction of additional ingredient in feed mix, from 0 to 1',
  )
  @IsDefined()
  @Min(0)
  @Max(1)
  additionalIngredients!: number;

  @IsNumber()
  @SchemaDescription(
    'Emissions intensity of feed product in GHG (kg CO2-e/kg input)',
  )
  @IsDefined()
  emissionsIntensity!: number;

  @ValidateNested({ always: true })
  @Type(() => FeedIngredients)
  @IsDefined()
  ingredients!: FeedIngredients;
}
