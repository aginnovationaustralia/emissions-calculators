import { IsDefined, IsNumber } from 'class-validator';
import { SchemaDescription } from './decorator.schema';
import { OUTPUTDESCRIPTIONS } from './descriptions.schema';

@SchemaDescription(OUTPUTDESCRIPTIONS.scope2)
export class Scope2Output {
  @IsNumber()
  @SchemaDescription(OUTPUTDESCRIPTIONS.electricity)
  @IsDefined()
  electricity!: number;

  @IsNumber()
  @SchemaDescription(OUTPUTDESCRIPTIONS.scope2Total)
  @IsDefined()
  total!: number;
}
