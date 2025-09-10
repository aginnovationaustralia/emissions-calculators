import { IsDefined, IsNumber } from 'class-validator';
import { SchemaDescription } from '../decorator.schema';
import { OUTPUTDESCRIPTIONS } from '../descriptions.schema';

@SchemaDescription(OUTPUTDESCRIPTIONS.scope1)
export class RiceScope1Output {
  @IsNumber()
  @SchemaDescription(OUTPUTDESCRIPTIONS.fuelCO2)
  @IsDefined()
  fuelCO2!: number;

  @IsNumber()
  @SchemaDescription(OUTPUTDESCRIPTIONS.limeCO2)
  @IsDefined()
  limeCO2!: number;

  @IsNumber()
  @SchemaDescription(OUTPUTDESCRIPTIONS.ureaCO2)
  @IsDefined()
  ureaCO2!: number;

  @IsNumber()
  @SchemaDescription(OUTPUTDESCRIPTIONS.fieldBurningCH4)
  @IsDefined()
  fieldBurningCH4!: number;

  @IsNumber()
  @SchemaDescription(OUTPUTDESCRIPTIONS.riceCultivationCH4)
  @IsDefined()
  riceCultivationCH4!: number;

  @IsNumber()
  @SchemaDescription(OUTPUTDESCRIPTIONS.fuelCH4)
  @IsDefined()
  fuelCH4!: number;

  @IsNumber()
  @SchemaDescription(OUTPUTDESCRIPTIONS.fertiliserN2O)
  @IsDefined()
  fertiliserN2O!: number;

  @IsNumber()
  @SchemaDescription(OUTPUTDESCRIPTIONS.atmosphericN2O)
  @IsDefined()
  atmosphericDepositionN2O!: number;

  @IsNumber()
  @SchemaDescription(OUTPUTDESCRIPTIONS.fieldBurningN2O)
  @IsDefined()
  fieldBurningN2O!: number;

  @IsNumber()
  @SchemaDescription(OUTPUTDESCRIPTIONS.cropResidueN2O)
  @IsDefined()
  cropResidueN2O!: number;

  @IsNumber()
  @SchemaDescription(OUTPUTDESCRIPTIONS.leechingN2O)
  @IsDefined()
  leachingAndRunoffN2O!: number;

  @IsNumber()
  @SchemaDescription(OUTPUTDESCRIPTIONS.fuelN2O)
  @IsDefined()
  fuelN2O!: number;

  @IsNumber()
  @SchemaDescription(OUTPUTDESCRIPTIONS.scope1TotalCO2)
  @IsDefined()
  totalCO2!: number;

  @IsNumber()
  @SchemaDescription(OUTPUTDESCRIPTIONS.scope1TotalCH4)
  @IsDefined()
  totalCH4!: number;

  @IsNumber()
  @SchemaDescription(OUTPUTDESCRIPTIONS.scope1TotalN2O)
  @IsDefined()
  totalN2O!: number;

  @IsNumber()
  @SchemaDescription(OUTPUTDESCRIPTIONS.scope1Total)
  @IsDefined()
  total!: number;
}
