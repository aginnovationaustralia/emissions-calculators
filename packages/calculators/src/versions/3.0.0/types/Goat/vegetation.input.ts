import { Type } from 'class-transformer';
import { IsDefined, ValidateNested } from 'class-validator';
import { IsNumberArray, SchemaDescription } from '../decorator.schema';
import { Vegetation } from '../vegetation.input';

@SchemaDescription(
  'Non-productive vegetation inputs along with allocations to goat',
)
export class GoatVegetation {
  @ValidateNested({ always: true })
  @Type(() => Vegetation)
  @IsDefined()
  vegetation!: Vegetation;

  @IsNumberArray()
  @SchemaDescription(
    'The proportion of the sequestration that is allocated to goat',
  )
  @IsDefined()
  goatProportion!: number[];
}
