import { Type } from 'class-transformer';
import { IsDefined, IsNumber, ValidateNested } from 'class-validator';
import { SchemaDescription } from '../decorator.schema';
import { PoultryFeedIngredients } from './feedingredients.input';

@SchemaDescription('Poultry feed')
export class PoultryFeed {
  @ValidateNested({ always: true })
  @Type(() => PoultryFeedIngredients)
  @IsDefined()
  ingredients!: PoultryFeedIngredients;

  @IsNumber()
  @SchemaDescription('Feed purchased, in tonnes')
  @IsDefined()
  feedPurchased!: number;

  @IsNumber()
  @SchemaDescription(
    'Fraction of additional ingredients in feed mix, from 0 to 1',
  )
  @IsDefined()
  additionalIngredient!: number;

  @IsNumber()
  @SchemaDescription(
    'Emissions intensity of feed product in GHG (kg CO2-e/kg input)',
  )
  @IsDefined()
  emissionIntensity!: number;
}
