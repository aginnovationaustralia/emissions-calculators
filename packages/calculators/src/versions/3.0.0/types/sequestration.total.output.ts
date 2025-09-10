import { IsDefined, IsNumber } from 'class-validator';
import { SchemaDescription } from './decorator.schema';
import { OUTPUTDESCRIPTIONS } from './descriptions.schema';

@SchemaDescription(OUTPUTDESCRIPTIONS.sequestration)
export class SequestrationTotalOutput {
  @IsNumber()
  @SchemaDescription(OUTPUTDESCRIPTIONS.totalSequestration)
  @IsDefined()
  total!: number;
}
