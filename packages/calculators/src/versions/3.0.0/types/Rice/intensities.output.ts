import { IsDefined, IsNumber } from 'class-validator';
import {
  DeprecatedSchemaDescription,
  SchemaDescription,
} from '../decorator.schema';

export class RiceEmissionsIntensities {
  @IsNumber()
  @SchemaDescription('Rice produced in tonnes')
  @IsDefined()
  riceProducedTonnes!: number;

  @IsNumber()
  @SchemaDescription('Rice excluding sequestration, in t-CO2e/t rice')
  @IsDefined()
  riceExcludingSequestration!: number;

  @IsNumber()
  @SchemaDescription('Rice including sequestration, in t-CO2e/t rice')
  @IsDefined()
  riceIncludingSequestration!: number;

  @IsNumber()
  @DeprecatedSchemaDescription('Use `riceIncludingSequestration` instead')
  @IsDefined()
  intensity!: number;
}
