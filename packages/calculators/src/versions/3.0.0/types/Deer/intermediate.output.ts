import { Type } from 'class-transformer';
import { IsDefined, IsString, ValidateNested } from 'class-validator';
import { SchemaDescription } from '../decorator.schema';
import { DESCRIPTIONS } from '../descriptions.schema';
import { Scope2Output } from '../scope2.output';
import { SequestrationTotalOutput } from '../sequestration.total.output';
import { DeerEmissionsIntensities } from './intensities.output';
import { DeerNetOutput } from './net.output';
import { DeerScope1Output } from './scope1.output';
import { DeerScope3Output } from './scope3.output';

@SchemaDescription(
  'Intermediate emissions calculation output for the Deer calculator',
)
export class DeerIntermediateOutput {
  @IsString()
  @SchemaDescription(DESCRIPTIONS.ACTIVITY_ID)
  @IsDefined()
  id!: string;

  @ValidateNested({ always: true })
  @Type(() => DeerScope1Output)
  @IsDefined()
  scope1!: DeerScope1Output;

  @ValidateNested({ always: true })
  @Type(() => Scope2Output)
  @IsDefined()
  scope2!: Scope2Output;

  @ValidateNested({ always: true })
  @Type(() => DeerScope3Output)
  @IsDefined()
  scope3!: DeerScope3Output;

  @ValidateNested({ always: true })
  @Type(() => DeerNetOutput)
  @IsDefined()
  net!: DeerNetOutput;

  @ValidateNested({ always: true })
  @Type(() => DeerEmissionsIntensities)
  @IsDefined()
  intensities!: DeerEmissionsIntensities;

  @ValidateNested({ always: true })
  @Type(() => SequestrationTotalOutput)
  @IsDefined()
  carbonSequestration!: SequestrationTotalOutput;
}
