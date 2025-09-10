import { Type } from 'class-transformer';
import {
  IsDefined,
  IsEnum,
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
import {
  LivestockSourceLocation,
  LivestockSourceLocations,
} from '../livestock';
import { BeefPurchase } from './beefpurchase.input';
import { BeefSeason } from './beefseason.input';

@SchemaDescription('Beef class with seasonal data')
export class BeefClass {
  @ValidateNested({ always: true })
  @Type(() => BeefSeason)
  @IsDefined()
  autumn!: BeefSeason;

  @ValidateNested({ always: true })
  @Type(() => BeefSeason)
  @IsDefined()
  winter!: BeefSeason;

  @ValidateNested({ always: true })
  @Type(() => BeefSeason)
  @IsDefined()
  spring!: BeefSeason;

  @ValidateNested({ always: true })
  @Type(() => BeefSeason)
  @IsDefined()
  summer!: BeefSeason;

  @IsNumber()
  @IsOptional()
  @DeprecatedSchemaDescription(
    DESCRIPTIONS.HEADPURCHASED,
    'Use `purchases` instead',
  )
  headPurchased?: number;

  @IsNumber()
  @IsOptional()
  @DeprecatedSchemaDescription(
    DESCRIPTIONS.PURCHASEDWEIGHT,
    'Use `purchases` instead',
  )
  purchasedWeight?: number;

  @IsOptional()
  @DeprecatedSchemaDescription(
    'Source location of livestock purchase',
    'Use `purchases` instead',
  )
  @IsEnum(LivestockSourceLocations)
  source?: LivestockSourceLocation;

  @IsNumber()
  @SchemaDescription(DESCRIPTIONS.HEADSOLD)
  @IsDefined()
  headSold!: number;

  @IsNumber()
  @SchemaDescription(DESCRIPTIONS.SALEWEIGHT)
  @IsDefined()
  saleWeight!: number;

  // Make this mandatory when headPurchased etc are removed properly
  @IsOptional()
  @ValidateNested({ always: true, each: true })
  @TypeWithArraySchema(() => BeefPurchase)
  purchases!: BeefPurchase[];
}
