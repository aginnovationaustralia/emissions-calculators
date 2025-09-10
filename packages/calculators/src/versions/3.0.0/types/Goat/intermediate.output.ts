import { Type } from 'class-transformer';
import { IsDefined, IsString, ValidateNested } from 'class-validator';
import { SchemaDescription } from '../decorator.schema';
import { DESCRIPTIONS } from '../descriptions.schema';
import { Scope2Output } from '../scope2.output';
import { SequestrationTotalOutput } from '../sequestration.total.output';
import { GoatEmissionsIntensities } from './intensities.output';
import { GoatNetOutput } from './net.output';
import { GoatScope1Output } from './scope1.output';
import { GoatScope3Output } from './scope3.output';

@SchemaDescription(
  'Intermediate emissions calculation output for the Goat calculator',
)
export class GoatIntermediateOutput {
  @IsString()
  @SchemaDescription(DESCRIPTIONS.ACTIVITY_ID)
  @IsDefined()
  id!: string;

  @ValidateNested({ always: true })
  @Type(() => GoatScope1Output)
  @IsDefined()
  scope1!: GoatScope1Output;

  @ValidateNested({ always: true })
  @Type(() => Scope2Output)
  @IsDefined()
  scope2!: Scope2Output;

  @ValidateNested({ always: true })
  @Type(() => GoatScope3Output)
  @IsDefined()
  scope3!: GoatScope3Output;

  @ValidateNested({ always: true })
  @Type(() => GoatNetOutput)
  @IsDefined()
  net!: GoatNetOutput;

  @ValidateNested({ always: true })
  @Type(() => GoatEmissionsIntensities)
  @IsDefined()
  intensities!: GoatEmissionsIntensities;

  @ValidateNested({ always: true })
  @Type(() => SequestrationTotalOutput)
  @IsDefined()
  carbonSequestration!: SequestrationTotalOutput;
}
