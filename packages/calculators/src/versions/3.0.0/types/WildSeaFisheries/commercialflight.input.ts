import { IsDefined, IsNumber } from 'class-validator';
import 'reflect-metadata';
import { SchemaDescription } from '../decorator.schema';

export class WildSeaFisheriesCommercialFlight {
  @IsNumber()
  @SchemaDescription('Commercial flight passengers per year')
  @IsDefined()
  commercialFlightPassengers!: number;

  @IsNumber()
  @SchemaDescription('Total commercial flight distance in km')
  @IsDefined()
  totalFlightDistance!: number;
}
