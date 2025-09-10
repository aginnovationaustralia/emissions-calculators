import { Type } from 'class-transformer';
import { IsDefined, IsNumber, ValidateNested } from 'class-validator';
import { SchemaDescription, TypeWithArraySchema } from './decorator.schema';
import { DESCRIPTIONS } from './descriptions.schema';
import { StationaryFuelInput } from './stationaryFuel.input';
import { TransportFuelInput } from './transportFuel.input';

export class FuelInput {
  @ValidateNested({ always: true, each: true })
  @Type(() => TransportFuelInput)
  @TypeWithArraySchema(() => TransportFuelInput)
  @SchemaDescription(DESCRIPTIONS.FUEL_TRANSPORT)
  @IsDefined()
  transportFuel!: TransportFuelInput[];

  @ValidateNested({ always: true, each: true })
  @Type(() => StationaryFuelInput)
  @TypeWithArraySchema(() => StationaryFuelInput)
  @SchemaDescription(DESCRIPTIONS.FUEL_STATIONARY)
  @IsDefined()
  stationaryFuel!: StationaryFuelInput[];

  @IsNumber()
  @SchemaDescription(DESCRIPTIONS.NATURAL_GAS)
  @IsDefined()
  naturalGas!: number;
}
