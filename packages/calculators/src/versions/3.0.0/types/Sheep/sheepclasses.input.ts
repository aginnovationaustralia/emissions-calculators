import { Type } from 'class-transformer';
import { IsDefined, IsOptional, ValidateNested } from 'class-validator';
import { DeprecatedSchemaDescription } from '../decorator.schema';
import { SheepClass } from './sheepclass.input';

export class SheepClasses {
  @ValidateNested({ always: true })
  @Type(() => SheepClass)
  @IsOptional()
  rams?: SheepClass;

  @ValidateNested({ always: true })
  @Type(() => SheepClass)
  @IsOptional()
  tradeRams?: SheepClass;

  @ValidateNested({ always: true })
  @Type(() => SheepClass)
  @IsOptional()
  wethers?: SheepClass;

  @ValidateNested({ always: true })
  @Type(() => SheepClass)
  @IsOptional()
  tradeWethers?: SheepClass;

  @ValidateNested({ always: true })
  @Type(() => SheepClass)
  @IsOptional()
  maidenBreedingEwes?: SheepClass;

  @ValidateNested({ always: true })
  @Type(() => SheepClass)
  @IsOptional()
  tradeMaidenBreedingEwes?: SheepClass;

  @ValidateNested({ always: true })
  @Type(() => SheepClass)
  @IsDefined()
  breedingEwes!: SheepClass;

  @ValidateNested({ always: true })
  @Type(() => SheepClass)
  @IsOptional()
  tradeBreedingEwes?: SheepClass;

  @ValidateNested({ always: true })
  @Type(() => SheepClass)
  @IsOptional()
  otherEwes?: SheepClass;

  @ValidateNested({ always: true })
  @Type(() => SheepClass)
  @IsOptional()
  tradeOtherEwes?: SheepClass;

  @ValidateNested({ always: true })
  @Type(() => SheepClass)
  @IsDefined()
  eweLambs!: SheepClass;

  @ValidateNested({ always: true })
  @Type(() => SheepClass)
  @IsOptional()
  tradeEweLambs?: SheepClass;

  @ValidateNested({ always: true })
  @Type(() => SheepClass)
  @IsDefined()
  wetherLambs!: SheepClass;

  @ValidateNested({ always: true })
  @Type(() => SheepClass)
  @IsOptional()
  tradeWetherLambs?: SheepClass;

  @ValidateNested({ always: true })
  @Type(() => SheepClass)
  @DeprecatedSchemaDescription(
    'More specific trading classes are now available',
  )
  @IsOptional()
  tradeEwes?: SheepClass;

  @ValidateNested({ always: true })
  @Type(() => SheepClass)
  @DeprecatedSchemaDescription(
    'More specific trading classes are now available',
  )
  @IsOptional()
  tradeLambsAndHoggets?: SheepClass;
}
