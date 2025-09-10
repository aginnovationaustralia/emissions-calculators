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
import { BuffaloSeason } from './buffaloseason.input';

@SchemaDescription('Buffalo class with seasonal data')
export class BuffaloClass {
  @ValidateNested({ always: true })
  @Type(() => BuffaloSeason)
  @IsDefined()
  autumn!: BuffaloSeason;

  @ValidateNested({ always: true })
  @Type(() => BuffaloSeason)
  @IsDefined()
  winter!: BuffaloSeason;

  @ValidateNested({ always: true })
  @Type(() => BuffaloSeason)
  @IsDefined()
  spring!: BuffaloSeason;

  @ValidateNested({ always: true })
  @Type(() => BuffaloSeason)
  @IsDefined()
  summer!: BuffaloSeason;

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
