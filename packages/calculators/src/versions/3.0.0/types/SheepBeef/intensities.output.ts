import { IsDefined, IsNumber } from 'class-validator';
import { SchemaDescription } from '../decorator.schema';

export class SheepBeefEmissionsIntensities {
  @IsNumber()
  @SchemaDescription(
    'Beef including carbon sequestration, in kg-CO2e/kg liveweight',
  )
  @IsDefined()
  beefIncludingSequestration!: number;

  @IsNumber()
  @SchemaDescription(
    'Beef excluding carbon sequestration, in kg-CO2e/kg liveweight',
  )
  @IsDefined()
  beefExcludingSequestration!: number;

  @IsNumber()
  @SchemaDescription('Liveweight produced in kg')
  @IsDefined()
  liveweightBeefProducedKg!: number;

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

  @IsNumber()
  @SchemaDescription('Greasy wool produced in kg')
  @IsDefined()
  woolProducedKg!: number;

  @IsNumber()
  @SchemaDescription('Sheep meat produced in kg liveweight')
  @IsDefined()
  sheepMeatProducedKg!: number;
}
