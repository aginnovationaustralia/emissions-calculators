import { IsDefined, ValidateNested } from 'class-validator';
import 'reflect-metadata';
import { SchemaDescription, TypeWithArraySchema } from '../decorator.schema';
import { VineyardVegetation } from './vineyard-vegetation.input';
import { VineyardCrop } from './vineyard.input';

@SchemaDescription('Input data required for the `vineyard` calculator')
export class VineyardInput {
  @ValidateNested({ always: true, each: true })
  @TypeWithArraySchema(() => VineyardCrop)
  @IsDefined()
  vineyards!: VineyardCrop[];

  @ValidateNested({ always: true, each: true })
  @TypeWithArraySchema(() => VineyardVegetation)
  @IsDefined()
  vegetation!: VineyardVegetation[];
}
