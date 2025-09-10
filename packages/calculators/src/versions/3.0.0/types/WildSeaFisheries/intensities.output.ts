import { IsDefined, IsNumber } from 'class-validator';
import { SchemaDescription } from '../decorator.schema';

export class WildSeaFisheriesIntensitiesOutput {
  @IsNumber()
  @SchemaDescription(
    'Wild sea fisheries emissions intensity excluding carbon offsets, in kg-CO2e/kg',
  )
  @IsDefined()
  intensityExcludingCarbonOffset!: number;

  @IsNumber()
  @SchemaDescription(
    'Wild sea fisheries emissions intensity including carbon offsets, in kg-CO2e/kg',
  )
  @IsDefined()
  intensityIncludingCarbonOffset!: number;

  @IsNumber()
  @SchemaDescription('Total harvest weight in tonnes')
  @IsDefined()
  totalHarvestWeightTonnes!: number;
}
