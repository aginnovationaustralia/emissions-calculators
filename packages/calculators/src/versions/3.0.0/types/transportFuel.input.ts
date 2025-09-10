import { IsDefined, IsEnum, IsNumber } from 'class-validator';
import { SchemaDescription } from './decorator.schema';
import { DESCRIPTIONS } from './descriptions.schema';
import { TransportFuelTypes } from './types';

export class TransportFuelInput {
  @IsEnum(TransportFuelTypes)
  @SchemaDescription(DESCRIPTIONS.FUEL_TYPE)
  @IsDefined()
  type!: TransportFuelTypes;

  @IsNumber()
  @SchemaDescription(DESCRIPTIONS.FUEL_CONSUMPTION)
  @IsDefined()
  amountLitres!: number;
}
