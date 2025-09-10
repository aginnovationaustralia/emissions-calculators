import { IsDefined, IsNumber } from 'class-validator';
import { SchemaDescription } from '../decorator.schema';

export class DairyEmissionsIntensities {
  @IsNumber()
  @SchemaDescription('Milk solids produced in tonnes')
  @IsDefined()
  milkSolidsProducedTonnes!: number;

  @IsNumber()
  @SchemaDescription(
    'Dairy intensities including carbon sequestration, in tonnes-CO2e',
  )
  @IsDefined()
  intensity!: number;
}
