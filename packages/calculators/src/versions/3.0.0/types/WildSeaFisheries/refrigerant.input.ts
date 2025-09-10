import { IsDefined, IsEnum, IsNumber } from 'class-validator';
import 'reflect-metadata';
import { SchemaDescription } from '../decorator.schema';
import { DESCRIPTIONS } from '../descriptions.schema';
import { Refrigerant, Refrigerants } from '../types';

export class WildSeaFisheriesRefrigerant {
  @IsEnum(Refrigerants)
  @SchemaDescription(DESCRIPTIONS.REFRIGERANT)
  @IsDefined()
  refrigerant!: Refrigerant;

  @IsNumber()
  @IsDefined()
  @SchemaDescription(
    'Amount of refrigerant annually recharged, kg product/year',
  )
  annualRecharge!: number;
}
