import { Type } from 'class-transformer';
import { IsOptional, ValidateNested } from 'class-validator';
import {
  DeprecatedSchemaDescription,
  SchemaDescription,
} from '../decorator.schema';
import { GoatClass } from './goatclass.input';

@SchemaDescription('Goat classes of different types')
export class GoatClasses {
  @ValidateNested({ always: true })
  @Type(() => GoatClass)
  @SchemaDescription('Bucks / Billy')
  @IsOptional()
  bucksBilly?: GoatClass;

  @ValidateNested({ always: true })
  @Type(() => GoatClass)
  @SchemaDescription('Trade Bucks / Billy')
  @IsOptional()
  tradeBucks?: GoatClass;

  @ValidateNested({ always: true })
  @Type(() => GoatClass)
  @SchemaDescription('wethers')
  @IsOptional()
  wethers?: GoatClass;

  @ValidateNested({ always: true })
  @Type(() => GoatClass)
  @SchemaDescription('trade wethers')
  @IsOptional()
  tradeWethers?: GoatClass;

  @ValidateNested({ always: true })
  @Type(() => GoatClass)
  @SchemaDescription('maiden breeding does/nannies')
  @IsOptional()
  maidenBreedingDoesNannies?: GoatClass;

  @ValidateNested({ always: true })
  @Type(() => GoatClass)
  @SchemaDescription('trade maiden breeding does/nannies')
  @IsOptional()
  tradeMaidenBreedingDoesNannies?: GoatClass;

  @ValidateNested({ always: true })
  @Type(() => GoatClass)
  @SchemaDescription('breeding does/nannies')
  @IsOptional()
  breedingDoesNannies?: GoatClass;

  @ValidateNested({ always: true })
  @Type(() => GoatClass)
  @SchemaDescription('trade breeding does/nannies')
  @IsOptional()
  tradeBreedingDoesNannies?: GoatClass;

  @ValidateNested({ always: true })
  @Type(() => GoatClass)
  @SchemaDescription('other does/culled females')
  @IsOptional()
  otherDoesCulledFemales?: GoatClass;

  @ValidateNested({ always: true })
  @Type(() => GoatClass)
  @SchemaDescription('trade other does/culled females')
  @IsOptional()
  tradeOtherDoesCulledFemales?: GoatClass;

  @ValidateNested({ always: true })
  @Type(() => GoatClass)
  @SchemaDescription('kids')
  @IsOptional()
  kids?: GoatClass;

  @ValidateNested({ always: true })
  @Type(() => GoatClass)
  @SchemaDescription('trade kids')
  @IsOptional()
  tradeKids?: GoatClass;

  @ValidateNested({ always: true })
  @Type(() => GoatClass)
  @SchemaDescription('trade does')
  @DeprecatedSchemaDescription('More specific trade doe classes now available')
  @IsOptional()
  tradeDoes?: GoatClass;
}
