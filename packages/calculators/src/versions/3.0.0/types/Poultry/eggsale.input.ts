import { IsDefined, IsNumber } from 'class-validator';
import { SchemaDescription } from '../decorator.schema';

export class EggSale {
  @IsNumber()
  @IsDefined()
  @SchemaDescription('Number of eggs produced in a year per bird')
  eggsProduced!: number;

  @IsNumber()
  @IsDefined()
  @SchemaDescription('Average egg weight in grams')
  averageWeight!: number;
}
