import { Type } from 'class-transformer';
import { IsDefined, ValidateNested } from 'class-validator';
import { SchemaDescription } from '../decorator.schema';
import { DairySeason } from './dairyseason.input';

@SchemaDescription('Dairy class with seasonal data')
export class DairyClass {
  @ValidateNested({ always: true })
  @Type(() => DairySeason)
  @IsDefined()
  autumn!: DairySeason;

  @ValidateNested({ always: true })
  @Type(() => DairySeason)
  @IsDefined()
  winter!: DairySeason;

  @ValidateNested({ always: true })
  @Type(() => DairySeason)
  @IsDefined()
  spring!: DairySeason;

  @ValidateNested({ always: true })
  @Type(() => DairySeason)
  @IsDefined()
  summer!: DairySeason;
}
