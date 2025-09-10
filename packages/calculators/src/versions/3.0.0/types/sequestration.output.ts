import { IsDefined, IsNumber } from 'class-validator';
import { IsNumberArray, SchemaDescription } from './decorator.schema';
import { OUTPUTDESCRIPTIONS } from './descriptions.schema';

@SchemaDescription(OUTPUTDESCRIPTIONS.sequestration)
export class SequestrationOutput {
  @IsNumber()
  @SchemaDescription(OUTPUTDESCRIPTIONS.totalSequestration)
  @IsDefined()
  total!: number;

  @IsNumberArray()
  @IsDefined()
  intermediate!: number[];
}
