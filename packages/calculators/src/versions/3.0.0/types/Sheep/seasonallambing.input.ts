import { IsDefined, IsNumber, Min } from 'class-validator';
import { SchemaDescription } from '../decorator.schema';

@SchemaDescription(
  'Seasonal lamb marking rates, i.e. the rate of lambs marked per ewe lambed. Values may exceed 1 if there are more lambs marked than ewes lambed in a season.',
)
export class SeasonalLambing {
  @IsNumber()
  @Min(0)
  @IsDefined()
  autumn!: number;

  @IsNumber()
  @Min(0)
  @IsDefined()
  winter!: number;

  @IsNumber()
  @Min(0)
  @IsDefined()
  spring!: number;

  @IsNumber()
  @Min(0)
  @IsDefined()
  summer!: number;
}
