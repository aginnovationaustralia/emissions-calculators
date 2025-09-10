import { IsDefined, IsEnum, IsNumber } from 'class-validator';
import { SchemaDescription } from './decorator.schema';
import { DESCRIPTIONS } from './descriptions.schema';
import { StationaryFuelTypes } from './types';

export class StationaryFuelInput {
  @IsEnum(StationaryFuelTypes)
  @SchemaDescription(DESCRIPTIONS.FUEL_TYPE)
  @IsDefined()
  type!: StationaryFuelTypes;

  @IsNumber()
  @SchemaDescription(DESCRIPTIONS.FUEL_CONSUMPTION)
  @IsDefined()
  amountLitres!: number;
}
