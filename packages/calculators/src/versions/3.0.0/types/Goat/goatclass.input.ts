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
import { GoatSeason } from './goatseason.input';

@SchemaDescription('Goat class with seasonal data')
export class GoatClass {
  @ValidateNested({ always: true })
  @Type(() => GoatSeason)
  @IsDefined()
  autumn!: GoatSeason;

  @ValidateNested({ always: true })
  @Type(() => GoatSeason)
  @IsDefined()
  winter!: GoatSeason;

  @ValidateNested({ always: true })
  @Type(() => GoatSeason)
  @IsDefined()
  spring!: GoatSeason;

  @ValidateNested({ always: true })
  @Type(() => GoatSeason)
  @IsDefined()
  summer!: GoatSeason;

  @IsNumber()
  @IsOptional()
  @DeprecatedSchemaDescription(
    DESCRIPTIONS.HEADPURCHASED,
    'Please use `purchases` instead',
  )
  headPurchased?: number;

  @IsNumber()
  @IsOptional()
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

  @IsNumber()
  @SchemaDescription('Number of goat shorn, in head')
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

  // Make mandatory when headPurchased is deprecated
  @IsOptional()
  @ValidateNested({ always: true, each: true })
  @TypeWithArraySchema(() => LivestockPurchase)
  purchases?: LivestockPurchase[];
}
