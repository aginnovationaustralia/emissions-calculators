import { IsNumber, IsOptional, Max, Min } from 'class-validator';
import 'reflect-metadata';

import { SchemaDescription } from '../decorator.schema';

@SchemaDescription(
  'Feed product ingredients, each ingredient is a fraction from 0 to 1',
)
export class FeedIngredients {
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(1)
  wheat?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(1)
  barley?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(1)
  wheyPowder?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(1)
  canolaMeal?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(1)
  soybeanMeal?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(1)
  meatMeal?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(1)
  bloodMeal?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(1)
  fishmeal?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(1)
  tallow?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(1)
  wheatBran?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(1)
  beetPulp?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(1)
  millMix?: number;
}
