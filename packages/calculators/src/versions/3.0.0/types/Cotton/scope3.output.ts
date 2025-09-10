import { IsDefined, IsNumber } from 'class-validator';
import { SchemaDescription } from '../decorator.schema';
import { OUTPUTDESCRIPTIONS } from '../descriptions.schema';

@SchemaDescription(OUTPUTDESCRIPTIONS.scope3)
export class CottonScope3Output {
  @IsNumber()
  @SchemaDescription(OUTPUTDESCRIPTIONS.fertiliser)
  @IsDefined()
  fertiliser!: number;

  @IsNumber()
  @SchemaDescription(OUTPUTDESCRIPTIONS.herbicide)
  @IsDefined()
  herbicide!: number;

  @IsNumber()
  @SchemaDescription(OUTPUTDESCRIPTIONS.electricity)
  @IsDefined()
  electricity!: number;

  @IsNumber()
  @SchemaDescription(OUTPUTDESCRIPTIONS.fuel)
  @IsDefined()
  fuel!: number;

  @IsNumber()
  @SchemaDescription(OUTPUTDESCRIPTIONS.lime)
  @IsDefined()
  lime!: number;

  @IsNumber()
  @SchemaDescription(OUTPUTDESCRIPTIONS.scope3Total)
  @IsDefined()
  total!: number;
}
