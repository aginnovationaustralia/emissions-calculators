import { IsDefined, IsNumber } from 'class-validator';
import { SchemaDescription } from '../decorator.schema';

export class GrainsIntensitiesOutput {
  @IsNumber()
  @SchemaDescription('Grain produced in tonnes')
  @IsDefined()
  grainProducedTonnes!: number;

  @IsNumber()
  @SchemaDescription('Grains excluding sequestration, in t-CO2e/t grain')
  @IsDefined()
  grainsExcludingSequestration!: number;

  @IsNumber()
  @SchemaDescription('Grains including sequestration, in t-CO2e/t grain')
  @IsDefined()
  grainsIncludingSequestration!: number;
}


