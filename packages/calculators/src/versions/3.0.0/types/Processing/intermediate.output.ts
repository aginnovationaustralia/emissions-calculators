import { Type } from 'class-transformer';
import { IsDefined, IsString, ValidateNested } from 'class-validator';
import { BaseScopesOutput } from '../base';
import { NetOutput } from '../common/net.output';
import { SchemaDescription } from '../decorator.schema';
import { DESCRIPTIONS, OUTPUTDESCRIPTIONS } from '../descriptions.schema';
import { Scope2Output } from '../scope2.output';
import { SequestrationTotalOutput } from '../sequestration.total.output';
import { ProcessingIntensitiesOutput } from './intensities.output';
import { ProcessingScope1Output } from './scope1.output';
import { ProcessingScope3Output } from './scope3.output';

export class ProcessingIntermediateOutput extends BaseScopesOutput {
  @IsString()
  @SchemaDescription(DESCRIPTIONS.ACTIVITY_ID)
  @IsDefined()
  id!: string;

  @ValidateNested({ always: true })
  @Type(() => ProcessingScope1Output)
  @IsDefined()
  scope1!: ProcessingScope1Output;

  @ValidateNested({ always: true })
  @Type(() => Scope2Output)
  @IsDefined()
  scope2!: Scope2Output;

  @ValidateNested({ always: true })
  @Type(() => ProcessingScope3Output)
  @IsDefined()
  scope3!: ProcessingScope3Output;

  @ValidateNested({ always: true })
  @Type(() => SequestrationTotalOutput)
  @SchemaDescription(OUTPUTDESCRIPTIONS.sequestration)
  @IsDefined()
  carbonSequestration!: SequestrationTotalOutput;

  @ValidateNested({ always: true })
  @Type(() => ProcessingIntensitiesOutput)
  @IsDefined()
  intensities!: ProcessingIntensitiesOutput;

  @ValidateNested({ always: true })
  @Type(() => NetOutput)
  @IsDefined()
  net!: NetOutput;
}
