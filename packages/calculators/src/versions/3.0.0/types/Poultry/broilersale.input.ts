import { Type } from 'class-transformer';
import { IsDefined, ValidateNested } from 'class-validator';
import { SchemaDescription } from '../decorator.schema';
import { PoultrySale } from './sale.input';

@SchemaDescription('Poultry broiler sales')
export class BroilerSale {
  @ValidateNested({ always: true })
  @Type(() => PoultrySale)
  @IsDefined()
  meatChickenGrowersSales!: PoultrySale;

  @ValidateNested({ always: true })
  @Type(() => PoultrySale)
  @IsDefined()
  meatChickenLayers!: PoultrySale;

  @ValidateNested({ always: true })
  @Type(() => PoultrySale)
  @IsDefined()
  meatOther!: PoultrySale;
}
