import { IsDefined, IsNumber } from 'class-validator';
import { SchemaDescription } from '../decorator.schema';
import { OUTPUTDESCRIPTIONS } from '../descriptions.schema';

@SchemaDescription(OUTPUTDESCRIPTIONS.scope1)
export class WildSeaFisheriesScope1Output {
  @IsNumber()
  @SchemaDescription(OUTPUTDESCRIPTIONS.fuelCO2)
  @IsDefined()
  fuelCO2!: number;

  @IsNumber()
  @SchemaDescription(OUTPUTDESCRIPTIONS.fuelCH4)
  @IsDefined()
  fuelCH4!: number;

  @IsNumber()
  @SchemaDescription(OUTPUTDESCRIPTIONS.fuelN2O)
  @IsDefined()
  fuelN2O!: number;

  @IsNumber()
  @SchemaDescription(OUTPUTDESCRIPTIONS.hfcsRefrigerant)
  @IsDefined()
  hfcsRefrigerantLeakage!: number;

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
  @SchemaDescription(OUTPUTDESCRIPTIONS.scope1TotalHFCs)
  @IsDefined()
  totalHFCs!: number;

  @IsNumber()
  @SchemaDescription(OUTPUTDESCRIPTIONS.scope1Total)
  @IsDefined()
  total!: number;
}
