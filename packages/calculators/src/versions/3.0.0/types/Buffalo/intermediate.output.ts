import { Type } from 'class-transformer';
import { IsDefined, IsString, ValidateNested } from 'class-validator';
import { SchemaDescription } from '../decorator.schema';
import { DESCRIPTIONS } from '../descriptions.schema';
import { Scope2Output } from '../scope2.output';
import { SequestrationTotalOutput } from '../sequestration.total.output';
import { BuffaloEmissionsIntensities } from './intensities.output';
import { BuffaloNetOutput } from './net.output';
import { BuffaloScope1Output } from './scope1.output';
import { BuffaloScope3Output } from './scope3.output';

@SchemaDescription(
  'Intermediate emissions calculation output for the Buffalo calculator',
)
export class BuffaloIntermediateOutput {
  @IsString()
  @SchemaDescription(DESCRIPTIONS.ACTIVITY_ID)
  @IsDefined()
  id!: string;

  @ValidateNested({ always: true })
  @Type(() => BuffaloScope1Output)
  @IsDefined()
  scope1!: BuffaloScope1Output;

  @ValidateNested({ always: true })
  @Type(() => Scope2Output)
  @IsDefined()
  scope2!: Scope2Output;

  @ValidateNested({ always: true })
  @Type(() => BuffaloScope3Output)
  @IsDefined()
  scope3!: BuffaloScope3Output;

  @ValidateNested({ always: true })
  @Type(() => BuffaloNetOutput)
  @IsDefined()
  net!: BuffaloNetOutput;

  @ValidateNested({ always: true })
  @Type(() => BuffaloEmissionsIntensities)
  @IsDefined()
  intensities!: BuffaloEmissionsIntensities;

  @ValidateNested({ always: true })
  @Type(() => SequestrationTotalOutput)
  @IsDefined()
  carbonSequestration!: SequestrationTotalOutput;
}
