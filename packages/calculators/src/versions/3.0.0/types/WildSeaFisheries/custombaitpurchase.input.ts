import { IsDefined, IsNumber } from 'class-validator';
import 'reflect-metadata';
import { SchemaDescription } from '../decorator.schema';

export class WildSeaFisheriesCustomBaitPurchase {
  @IsNumber()
  @SchemaDescription('Purchased product in tonnes')
  @IsDefined()
  purchased!: number;

  @IsNumber()
  @SchemaDescription('Emissions intensity of product, in kg CO2e/kg')
  @IsDefined()
  emissionsIntensity!: number;
}
