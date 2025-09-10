import { Type } from 'class-transformer';
import { IsOptional, ValidateNested } from 'class-validator';
import { SchemaDescription } from '../decorator.schema';
import { BeefClass } from './beefclass.input';

@SchemaDescription('Beef classes of different types and age ranges')
export class BeefClasses {
  @ValidateNested({ always: true })
  @Type(() => BeefClass)
  @SchemaDescription('Bulls whose age is greater than 1 year old')
  @IsOptional()
  bullsGt1?: BeefClass;

  @ValidateNested({ always: true })
  @Type(() => BeefClass)
  @SchemaDescription('Traded bulls whose age is greater than 1 year old')
  @IsOptional()
  bullsGt1Traded?: BeefClass;

  @ValidateNested({ always: true })
  @Type(() => BeefClass)
  @SchemaDescription('Steers whose age is less than 1 year old')
  @IsOptional()
  steersLt1?: BeefClass;

  @ValidateNested({ always: true })
  @Type(() => BeefClass)
  @SchemaDescription('Traded steers whose age is less than 1 year old')
  @IsOptional()
  steersLt1Traded?: BeefClass;

  @ValidateNested({ always: true })
  @Type(() => BeefClass)
  @SchemaDescription('Steers whose age is between 1 and 2 years old')
  @IsOptional()
  steers1To2?: BeefClass;

  @ValidateNested({ always: true })
  @Type(() => BeefClass)
  @SchemaDescription('Traded steers whose age is between 1 and 2 years old')
  @IsOptional()
  steers1To2Traded?: BeefClass;

  @ValidateNested({ always: true })
  @Type(() => BeefClass)
  @SchemaDescription('Steers whose age is greater than 2 years old')
  @IsOptional()
  steersGt2?: BeefClass;

  @ValidateNested({ always: true })
  @Type(() => BeefClass)
  @SchemaDescription('Traded steers whose age is greater than 2 years old')
  @IsOptional()
  steersGt2Traded?: BeefClass;

  @ValidateNested({ always: true })
  @Type(() => BeefClass)
  @SchemaDescription('Cows whose age is greater than 2 years old')
  @IsOptional()
  cowsGt2?: BeefClass;

  @ValidateNested({ always: true })
  @Type(() => BeefClass)
  @SchemaDescription('Traded cows whose age is greater than 2 years old')
  @IsOptional()
  cowsGt2Traded?: BeefClass;

  @ValidateNested({ always: true })
  @Type(() => BeefClass)
  @SchemaDescription('Heifers whose age is less than 1 year old')
  @IsOptional()
  heifersLt1?: BeefClass;

  @ValidateNested({ always: true })
  @Type(() => BeefClass)
  @SchemaDescription('Traded heifers whose age is less than 1 year old')
  @IsOptional()
  heifersLt1Traded?: BeefClass;

  @ValidateNested({ always: true })
  @Type(() => BeefClass)
  @SchemaDescription('Heifers whose age is between 1 and 2 years old')
  @IsOptional()
  heifers1To2?: BeefClass;

  @ValidateNested({ always: true })
  @Type(() => BeefClass)
  @SchemaDescription('Traded heifers whose age is between 1 and 2 years old')
  @IsOptional()
  heifers1To2Traded?: BeefClass;

  @ValidateNested({ always: true })
  @Type(() => BeefClass)
  @SchemaDescription('Heifers whose age is greater than 2 years old')
  @IsOptional()
  heifersGt2?: BeefClass;

  @ValidateNested({ always: true })
  @Type(() => BeefClass)
  @SchemaDescription('Traded heifers whose age is greater than 2 years old')
  @IsOptional()
  heifersGt2Traded?: BeefClass;
}
