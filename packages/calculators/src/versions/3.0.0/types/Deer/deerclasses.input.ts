import { Type } from 'class-transformer';
import { IsOptional, ValidateNested } from 'class-validator';
import { SchemaDescription } from '../decorator.schema';
import { DeerClass } from './deerclass.input';

@SchemaDescription('Deer classes of different types')
export class DeerClasses {
  @ValidateNested({ always: true })
  @Type(() => DeerClass)
  @SchemaDescription('Bucks')
  @IsOptional()
  bucks?: DeerClass;

  @ValidateNested({ always: true })
  @Type(() => DeerClass)
  @SchemaDescription('Trade bucks')
  @IsOptional()
  tradeBucks?: DeerClass;

  @ValidateNested({ always: true })
  @Type(() => DeerClass)
  @SchemaDescription('Breeding does')
  @IsOptional()
  breedingDoes?: DeerClass;

  @ValidateNested({ always: true })
  @Type(() => DeerClass)
  @SchemaDescription('Trade does')
  @IsOptional()
  tradeDoes?: DeerClass;

  @ValidateNested({ always: true })
  @Type(() => DeerClass)
  @SchemaDescription('Other does')
  @IsOptional()
  otherDoes?: DeerClass;

  @ValidateNested({ always: true })
  @Type(() => DeerClass)
  @SchemaDescription('Trade other does')
  @IsOptional()
  tradeOtherDoes?: DeerClass;

  @ValidateNested({ always: true })
  @Type(() => DeerClass)
  @SchemaDescription('Fawns')
  @IsOptional()
  fawn?: DeerClass;

  @ValidateNested({ always: true })
  @Type(() => DeerClass)
  @SchemaDescription('Trade fawns')
  @IsOptional()
  tradeFawn?: DeerClass;
}
