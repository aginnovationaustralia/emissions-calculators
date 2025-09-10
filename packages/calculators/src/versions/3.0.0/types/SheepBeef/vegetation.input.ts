import { Type } from 'class-transformer';
import { IsDefined, ValidateNested } from 'class-validator';
import { IsNumberArray, SchemaDescription } from '../decorator.schema';
import { Vegetation } from '../vegetation.input';

// Note: this is the `Data input - vegetation` tab in the spreadsheets
@SchemaDescription(
  'Non-productive vegetation inputs along with allocations to sheep and beef',
)
export class SheepBeefVegetation {
  @ValidateNested({ always: true })
  @Type(() => Vegetation)
  @IsDefined()
  vegetation!: Vegetation;

  @IsNumberArray()
  @SchemaDescription(
    'The proportion of the sequestration that is allocated to beef',
  )
  @IsDefined()
  beefProportion!: number[];

  @IsNumberArray()
  @SchemaDescription(
    'The proportion of the sequestration that is allocated to sheep',
  )
  @IsDefined()
  sheepProportion!: number[];
}
