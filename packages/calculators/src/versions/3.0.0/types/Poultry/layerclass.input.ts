import { IsDefined, IsNumber } from 'class-validator';
import { SchemaDescription } from '../decorator.schema';

@SchemaDescription('Layer class with seasonal data')
export class LayerClass {
  @IsNumber()
  @SchemaDescription('Flock numbers in autumn')
  @IsDefined()
  autumn!: number;

  @IsNumber()
  @SchemaDescription('Flock numbers in winter')
  @IsDefined()
  winter!: number;

  @IsNumber()
  @SchemaDescription('Flock numbers in spring')
  @IsDefined()
  spring!: number;

  @IsNumber()
  @SchemaDescription('Flock numbers in summer')
  @IsDefined()
  summer!: number;
}
