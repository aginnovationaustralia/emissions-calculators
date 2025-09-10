import { Type } from 'class-transformer';
import {
  IsDefined,
  IsNumber,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { SchemaDescription, TypeWithArraySchema } from '../decorator.schema';
import { DESCRIPTIONS } from '../descriptions.schema';
import { LivestockPurchase } from '../livestockPurchase.input';
import { DeerSeason } from './deerseason.input';

@SchemaDescription('Deer class with seasonal data')
export class DeerClass {
  @ValidateNested({ always: true })
  @Type(() => DeerSeason)
  @IsDefined()
  autumn!: DeerSeason;

  @ValidateNested({ always: true })
  @Type(() => DeerSeason)
  @IsDefined()
  winter!: DeerSeason;

  @ValidateNested({ always: true })
  @Type(() => DeerSeason)
  @IsDefined()
  spring!: DeerSeason;

  @ValidateNested({ always: true })
  @Type(() => DeerSeason)
  @IsDefined()
  summer!: DeerSeason;

  @IsNumber()
  @SchemaDescription(DESCRIPTIONS.HEADSOLD)
  @IsDefined()
  headSold!: number;

  @IsNumber()
  @SchemaDescription(DESCRIPTIONS.SALEWEIGHT)
  @IsDefined()
  saleWeight!: number;

  @IsOptional()
  @ValidateNested({ always: true, each: true })
  @TypeWithArraySchema(() => LivestockPurchase)
  purchases?: LivestockPurchase[];
}
