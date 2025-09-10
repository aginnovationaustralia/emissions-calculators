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
import { LivestockManure } from '../livestockManure.input';
import { LivestockPurchase } from '../livestockPurchase.input';

@SchemaDescription('Pork class with seasonal data')
export class PorkClass {
  @IsNumber()
  @SchemaDescription('Pig numbers in autumn')
  @IsDefined()
  autumn!: number;

  @IsNumber()
  @SchemaDescription('Pig numbers in autumn')
  @IsDefined()
  winter!: number;

  @IsNumber()
  @SchemaDescription('Pig numbers in autumn')
  @IsDefined()
  spring!: number;

  @IsNumber()
  @SchemaDescription('Pig numbers in autumn')
  @IsDefined()
  summer!: number;

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

  // Make mandatory when headPurchased is deprecated
  @ValidateNested({ always: true, each: true })
  @TypeWithArraySchema(() => LivestockPurchase)
  purchases?: LivestockPurchase[];

  @ValidateNested({ always: true })
  @IsDefined()
  @Type(() => LivestockManure)
  manure!: LivestockManure;
}
