import { Type } from 'class-transformer';
import {
  IsDefined,
  IsNumber,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import {
  DeprecatedSchemaDescription,
  IsNumberArray,
  SchemaDescription,
} from '../decorator.schema';
import { Vegetation } from '../vegetation.input';

@SchemaDescription(
  'Non-productive vegetation inputs along with allocations to beef',
)
export class BeefVegetation {
  @ValidateNested({ always: true })
  @Type(() => Vegetation)
  @IsDefined()
  vegetation!: Vegetation;

  @IsNumber()
  @IsOptional()
  @DeprecatedSchemaDescription(
    'The proportion of the sequestration that is allocated to beef',
    'Please use `allocationToBeef` instead.',
  )
  beefProportion?: number;

  @SchemaDescription(
    'The proportion of the sequestration that is allocated to each beef',
  )
  @IsNumberArray()
  @IsDefined()
  allocationToBeef!: number[];
}
