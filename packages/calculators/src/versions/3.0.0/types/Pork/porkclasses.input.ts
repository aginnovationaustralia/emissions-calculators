import { Type } from 'class-transformer';
import { IsOptional, ValidateNested } from 'class-validator';
import { SchemaDescription } from '../decorator.schema';
import { PorkClass } from './porkclass.input';

@SchemaDescription('Pork classes of different types')
export class PorkClasses {
  @ValidateNested({ always: true })
  @Type(() => PorkClass)
  @IsOptional()
  @SchemaDescription('Sows')
  sows?: PorkClass;

  @ValidateNested({ always: true })
  @Type(() => PorkClass)
  @IsOptional()
  @SchemaDescription('Boars')
  boars?: PorkClass;

  @ValidateNested({ always: true })
  @Type(() => PorkClass)
  @IsOptional()
  @SchemaDescription('Gilts')
  gilts?: PorkClass;

  @ValidateNested({ always: true })
  @Type(() => PorkClass)
  @IsOptional()
  @SchemaDescription('Suckers')
  suckers?: PorkClass;

  @ValidateNested({ always: true })
  @Type(() => PorkClass)
  @IsOptional()
  @SchemaDescription('Weaners')
  weaners?: PorkClass;

  @ValidateNested({ always: true })
  @Type(() => PorkClass)
  @IsOptional()
  @SchemaDescription('Growers')
  growers?: PorkClass;

  @ValidateNested({ always: true })
  @Type(() => PorkClass)
  @IsOptional()
  @SchemaDescription('Slaughter Pigs')
  slaughterPigs?: PorkClass;
}
