import { IsDefined, IsNumber } from 'class-validator';
import 'reflect-metadata';
import { SchemaDescription } from '../decorator.schema';

export class AquacultureCustomBaitPurchase {
  @IsNumber()
  @SchemaDescription('Purchased product in tonnes')
  @IsDefined()
  purchasedTonnes!: number;

  @IsNumber()
  @SchemaDescription('Emissions intensity of product, in kg CO2e/kg bait')
  @IsDefined()
  emissionsIntensity!: number;
}
