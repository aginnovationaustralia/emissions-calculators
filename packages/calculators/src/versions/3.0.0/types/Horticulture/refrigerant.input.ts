import { IsDefined, IsEnum, IsNumber } from 'class-validator';
import 'reflect-metadata';
import { SchemaDescription } from '../decorator.schema';
import { DESCRIPTIONS } from '../descriptions.schema';
import { Refrigerant, Refrigerants } from '../types';

export class HorticultureRefrigerant {
  @IsEnum(Refrigerants)
  @SchemaDescription(DESCRIPTIONS.REFRIGERANT)
  @IsDefined()
  refrigerant!: Refrigerant;

  @IsNumber()
  @SchemaDescription('Amount of refrigerant contained in the appliance, in kg')
  @IsDefined()
  chargeSize!: number;
}
