import { Type } from 'class-transformer';
import { IsDefined, ValidateNested } from 'class-validator';
import { IsNumberArray } from '../decorator.schema';
import { Vegetation } from '../vegetation.input';

export class SugarVegetation {
  @ValidateNested({ always: true })
  @Type(() => Vegetation)
  @IsDefined()
  vegetation!: Vegetation;

  @IsNumberArray()
  @IsDefined()
  allocationToCrops!: number[];
}
