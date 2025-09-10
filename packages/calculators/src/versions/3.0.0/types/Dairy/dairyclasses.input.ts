import { Type } from 'class-transformer';
import { IsDefined, ValidateNested } from 'class-validator';
import { SchemaDescription } from '../decorator.schema';
import { DairyClass } from './dairyclass.input';

@SchemaDescription('Dairy classes of different types and age ranges')
export class DairyClasses {
  @ValidateNested({ always: true })
  @Type(() => DairyClass)
  @SchemaDescription('Milking cows')
  @IsDefined()
  milkingCows!: DairyClass;

  @ValidateNested({ always: true })
  @Type(() => DairyClass)
  @SchemaDescription('Heifers whose age is less than 1 year old')
  @IsDefined()
  heifersLt1!: DairyClass;

  @ValidateNested({ always: true })
  @Type(() => DairyClass)
  @SchemaDescription('Heifers whose age is greater than 1 year old')
  @IsDefined()
  heifersGt1!: DairyClass;

  @ValidateNested({ always: true })
  @Type(() => DairyClass)
  @SchemaDescription('Dairy bulls whose age is less than 1 year old')
  @IsDefined()
  dairyBullsLt1!: DairyClass;

  @ValidateNested({ always: true })
  @Type(() => DairyClass)
  @SchemaDescription('Dairy bulls whose age is greater than 1 year old')
  @IsDefined()
  dairyBullsGt1!: DairyClass;
}
