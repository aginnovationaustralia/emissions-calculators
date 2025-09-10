import { IsDefined, IsNumber, Max, Min } from 'class-validator';
import { SchemaDescription } from '../decorator.schema';

@SchemaDescription(
  'The proportion of ewes lambing in each season, as a value from 0 to 1',
)
export class EwesLambing {
  @IsNumber()
  @Min(0)
  @Max(1)
  @IsDefined()
  autumn!: number;

  @IsNumber()
  @Min(0)
  @Max(1)
  @IsDefined()
  winter!: number;

  @IsNumber()
  @Min(0)
  @Max(1)
  @IsDefined()
  spring!: number;

  @IsNumber()
  @Min(0)
  @Max(1)
  @IsDefined()
  summer!: number;
}
