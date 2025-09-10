import { Type } from 'class-transformer';
import { IsDefined, ValidateNested } from 'class-validator';
import { IsNumberArray, SchemaDescription } from '../decorator.schema';
import { SavannahBurning } from './savannah.input';

@SchemaDescription('Savannah burning along with allocations to beef')
export class BeefSavannahBurning {
  @ValidateNested({ always: true })
  @Type(() => SavannahBurning)
  @IsDefined()
  burning!: SavannahBurning;

  @SchemaDescription(
    'The proportion of the burning that is allocated to each beef',
  )
  @IsNumberArray()
  @IsDefined()
  allocationToBeef: number[] = [];
}
