import { Type } from 'class-transformer';
import {
  IsDefined,
  IsNumber,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import {
  DeprecatedSchemaDescription,
  SchemaDescription,
  TypeWithArraySchema,
} from '../decorator.schema';
import { DESCRIPTIONS } from '../descriptions.schema';
import { LivestockPurchase } from '../livestockPurchase.input';
import { SheepSeason } from './sheepseason.input';

export class SheepClass {
  @ValidateNested({ always: true })
  @Type(() => SheepSeason)
  @IsDefined()
  autumn!: SheepSeason;

  @ValidateNested({ always: true })
  @Type(() => SheepSeason)
  @IsDefined()
  winter!: SheepSeason;

  @ValidateNested({ always: true })
  @Type(() => SheepSeason)
  @IsDefined()
  spring!: SheepSeason;

  @ValidateNested({ always: true })
  @Type(() => SheepSeason)
  @IsDefined()
  summer!: SheepSeason;

  @IsNumber()
  @SchemaDescription('Number of sheep shorn, in head')
  @IsDefined()
  headShorn!: number;

  @IsNumber()
  @SchemaDescription('Weight of wool shorn, in kg/head (kilogram per head)')
  @IsDefined()
  woolShorn!: number;

  @IsNumber()
  @SchemaDescription(
    'Percentage of clean wool from weight of yield, from 0 to 100',
  )
  @IsDefined()
  cleanWoolYield!: number;

  @IsOptional()
  @IsNumber()
  @DeprecatedSchemaDescription(
    DESCRIPTIONS.HEADPURCHASED,
    'Please use `purchases` instead',
  )
  headPurchased?: number;

  @IsOptional()
  @IsNumber()
  @DeprecatedSchemaDescription(
    DESCRIPTIONS.PURCHASEDWEIGHT,
    'Please use `purchases` instead',
  )
  purchasedWeight?: number;

  @IsNumber()
  @SchemaDescription(DESCRIPTIONS.HEADSOLD)
  @IsDefined()
  headSold!: number;

  @IsNumber()
  @SchemaDescription(DESCRIPTIONS.SALEWEIGHT)
  @IsDefined()
  saleWeight!: number;

  // Make madnatory when headPurchased deprecated
  @IsOptional()
  @ValidateNested({ always: true, each: true })
  @TypeWithArraySchema(() => LivestockPurchase)
  purchases?: LivestockPurchase[];
}
