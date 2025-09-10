import { IsDefined, IsEnum, IsNumber } from 'class-validator';

export enum ProductUnit {
  LITRE = 'litre',
  TONNE = 'tonne',
  UNIT = 'unit',
  BOTTLE = 'bottle',
  DOZEN = 'dozen',
}

export class ProcessingProduct {
  @IsEnum(ProductUnit)
  @IsDefined()
  unit!: ProductUnit;

  @IsNumber()
  @IsDefined()
  amountMadePerYear!: number;
}
