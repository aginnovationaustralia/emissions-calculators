import { IsDefined, IsNumber } from 'class-validator';
import { SchemaDescription } from '../decorator.schema';
import { OUTPUTDESCRIPTIONS } from '../descriptions.schema';

@SchemaDescription(OUTPUTDESCRIPTIONS.scope1)
export class GroupScope1Output {
  @IsNumber()
  @SchemaDescription(OUTPUTDESCRIPTIONS.atmosphericN2O)
  @IsDefined()
  atmosphericDepositionN2O!: number;

  @IsNumber()
  @SchemaDescription(OUTPUTDESCRIPTIONS.manureDirectN2O)
  @IsDefined()
  manureDirectN2O!: number;

  @IsNumber()
  @SchemaDescription(OUTPUTDESCRIPTIONS.manureIndirectN2O)
  @IsDefined()
  manureIndirectN2O!: number;

  @IsNumber()
  @SchemaDescription(OUTPUTDESCRIPTIONS.manureCH4)
  @IsDefined()
  manureManagementCH4!: number;

  @IsNumber()
  @SchemaDescription(OUTPUTDESCRIPTIONS.manureAppliedToSoilN2O)
  @IsDefined()
  manureAppliedToSoilN2O!: number;

  @IsNumber()
  @SchemaDescription(OUTPUTDESCRIPTIONS.entericCH4)
  @IsDefined()
  entericCH4!: number;
}
