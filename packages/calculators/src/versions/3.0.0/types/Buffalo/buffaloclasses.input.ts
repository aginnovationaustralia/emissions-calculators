import { Type } from 'class-transformer';
import { IsOptional, ValidateNested } from 'class-validator';
import { SchemaDescription } from '../decorator.schema';
import { BuffaloClass } from './buffaloclass.input';

@SchemaDescription('Buffalo classes of different types')
export class BuffaloClasses {
  @ValidateNested({ always: true })
  @Type(() => BuffaloClass)
  @SchemaDescription('Bulls')
  @IsOptional()
  bulls?: BuffaloClass;

  @ValidateNested({ always: true })
  @Type(() => BuffaloClass)
  @SchemaDescription('Trade bulls')
  @IsOptional()
  tradeBulls?: BuffaloClass;

  @ValidateNested({ always: true })
  @Type(() => BuffaloClass)
  @SchemaDescription('Cows')
  @IsOptional()
  cows?: BuffaloClass;

  @ValidateNested({ always: true })
  @Type(() => BuffaloClass)
  @SchemaDescription('Trade cows')
  @IsOptional()
  tradeCows?: BuffaloClass;

  @ValidateNested({ always: true })
  @Type(() => BuffaloClass)
  @SchemaDescription('Steers')
  @IsOptional()
  steers?: BuffaloClass;

  @ValidateNested({ always: true })
  @Type(() => BuffaloClass)
  @SchemaDescription('Trade steers')
  @IsOptional()
  tradeSteers?: BuffaloClass;

  @ValidateNested({ always: true })
  @Type(() => BuffaloClass)
  @SchemaDescription('Calfs')
  @IsOptional()
  calfs?: BuffaloClass;

  @ValidateNested({ always: true })
  @Type(() => BuffaloClass)
  @SchemaDescription('Trade calfs')
  @IsOptional()
  tradeCalfs?: BuffaloClass;
}
