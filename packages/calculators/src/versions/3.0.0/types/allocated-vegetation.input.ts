import { Type } from 'class-transformer';
import { IsDefined, ValidateNested } from 'class-validator';
import { IsNumberArray, SchemaDescription } from './decorator.schema';
import { Vegetation } from './vegetation.input';

@SchemaDescription(
  'Non-productive vegetation inputs allocated to a particular activity type',
)
export class AllocatedVegetation {
  @ValidateNested({ always: true })
  @Type(() => Vegetation)
  @IsDefined()
  vegetation!: Vegetation;

  @IsNumberArray()
  @SchemaDescription(
    'The proportion of the sequestration that is allocated to the activity',
  )
  @IsDefined()
  allocatedProportion!: number[];
}
