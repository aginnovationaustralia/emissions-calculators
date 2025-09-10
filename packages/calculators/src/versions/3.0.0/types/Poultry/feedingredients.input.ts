import { IsNumber, IsOptional } from 'class-validator';
import { SchemaDescription } from '../decorator.schema';

@SchemaDescription(
  'Poultry broiler feed ingredients as fractions, each from 0 to 1',
)
export class PoultryFeedIngredients {
  @IsNumber()
  @IsOptional()
  wheat?: number;

  @IsNumber()
  @IsOptional()
  barley?: number;

  @IsNumber()
  @IsOptional()
  sorghum?: number;

  @IsNumber()
  @IsOptional()
  soybean?: number;

  @IsNumber()
  @IsOptional()
  millrun?: number;
}
