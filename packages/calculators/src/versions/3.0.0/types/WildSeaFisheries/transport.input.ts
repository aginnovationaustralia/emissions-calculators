import { IsDefined, IsEnum, IsNumber } from 'class-validator';
import 'reflect-metadata';
import { SchemaDescription } from '../decorator.schema';
import {
  WildSeaFisheriesFuel,
  WildSeaFisheriesFuels,
  WildSeaFisheriesTransportType,
  WildSeaFisheriesTransportTypes,
} from '../types';

export class WildSeaFisheriesTransport {
  @IsEnum(WildSeaFisheriesTransportTypes)
  @SchemaDescription('Transport type')
  @IsDefined()
  type!: WildSeaFisheriesTransportType;

  @IsEnum(WildSeaFisheriesFuels)
  @SchemaDescription('Fuel type')
  @IsDefined()
  fuel!: WildSeaFisheriesFuel;

  @IsNumber()
  @SchemaDescription('Distance in km')
  @IsDefined()
  distance!: number;
}
