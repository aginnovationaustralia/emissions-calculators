import { IsDefined, IsNumber } from 'class-validator';
import { SchemaDescription } from '../decorator.schema';

export class GoatEmissionsIntensities {
  @IsNumber()
  @SchemaDescription('Amount of goat meat produced in kg liveweight')
  @IsDefined()
  amountMeatProduced!: number;

  @IsNumber()
  @SchemaDescription('Amount of wool produced in kg greasy')
  @IsDefined()
  amountWoolProduced!: number;

  @IsNumber()
  @SchemaDescription(
    'Goat meat (breeding herd) including carbon sequestration, in kg-CO2e/kg liveweight',
  )
  @IsDefined()
  goatMeatBreedingIncludingSequestration!: number;

  @IsNumber()
  @SchemaDescription(
    'Goat meat (breeding herd) excluding carbon sequestration, in kg-CO2e/kg liveweight',
  )
  @IsDefined()
  goatMeatBreedingExcludingSequestration!: number;

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
}
