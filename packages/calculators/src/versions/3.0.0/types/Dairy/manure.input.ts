import { IsDefined, IsNumber, Max, Min } from 'class-validator';
import { SchemaDescription } from '../decorator.schema';

@SchemaDescription(
  'Manure management for each type, each value is a percentage of all excreta, from 0 to 100',
)
export class ManureManagement {
  @IsNumber()
  @IsDefined()
  @Min(0)
  @Max(100)
  pasture!: number;

  @IsNumber()
  @IsDefined()
  @Min(0)
  @Max(100)
  anaerobicLagoon!: number;

  @IsNumber()
  @IsDefined()
  @Min(0)
  @Max(100)
  sumpAndDispersal!: number;

  @IsNumber()
  @IsDefined()
  @Min(0)
  @Max(100)
  drainToPaddocks!: number;

  @IsNumber()
  @IsDefined()
  @Min(0)
  @Max(100)
  soildStorage!: number;
}
