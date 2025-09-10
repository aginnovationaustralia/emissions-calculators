import { IsDefined, IsNumber } from 'class-validator';
import { SchemaDescription } from '../decorator.schema';

export class SheepEmissionsIntensities {
  @IsNumber()
  @SchemaDescription('Greasy wool produced in kg')
  @IsDefined()
  woolProducedKg!: number;

  @IsNumber()
  @SchemaDescription('Sheep meat produced in kg liveweight')
  @IsDefined()
  sheepMeatProducedKg!: number;

  @IsNumber()
  @SchemaDescription(
    'Wool production including carbon sequestration, in kg-CO2e/kg greasy',
  )
  @IsDefined()
  woolIncludingSequestration!: number;

  @IsNumber()
  @SchemaDescription(
    'Wool production excluding carbon sequestration, in kg-CO2e/kg greasy',
  )
  @IsDefined()
  woolExcludingSequestration!: number;

  @IsNumber()
  @SchemaDescription(
    'Sheep meat (breeding herd) including carbon sequestration, in kg-CO2e/kg liveweight',
  )
  @IsDefined()
  sheepMeatBreedingIncludingSequestration!: number;

  @IsNumber()
  @SchemaDescription(
    'Sheep meat (breeding herd) excluding carbon sequestration, in kg-CO2e/kg liveweight',
  )
  @IsDefined()
  sheepMeatBreedingExcludingSequestration!: number;
}
