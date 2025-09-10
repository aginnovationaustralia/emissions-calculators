import { Type } from 'class-transformer';
import { IsDefined, IsString, ValidateNested } from 'class-validator';
import { SchemaDescription } from '../decorator.schema';
import { DESCRIPTIONS } from '../descriptions.schema';
import { Scope2Output } from '../scope2.output';
import { SequestrationTotalOutput } from '../sequestration.total.output';
import { DairyEmissionsIntensities } from './intensities.output';
import { DairyNet } from './net.output';
import { DairyScope1Output } from './scope1.output';
import { DairyScope3Output } from './scope3.output';

@SchemaDescription(
  'Intermediate emissions calculation output for the Dairy calculator',
)
export class DairyIntermediateOutput {
  @IsString()
  @SchemaDescription(DESCRIPTIONS.ACTIVITY_ID)
  @IsDefined()
  id!: string;

  @ValidateNested({ always: true })
  @Type(() => DairyScope1Output)
  @IsDefined()
  scope1!: DairyScope1Output;

  @ValidateNested({ always: true })
  @Type(() => Scope2Output)
  @IsDefined()
  scope2!: Scope2Output;

  @ValidateNested({ always: true })
  @Type(() => DairyScope3Output)
  @IsDefined()
  scope3!: DairyScope3Output;

  @ValidateNested({ always: true })
  @Type(() => DairyNet)
  @IsDefined()
  net!: DairyNet;

  @ValidateNested({ always: true })
  @Type(() => DairyEmissionsIntensities)
  @IsDefined()
  intensities!: DairyEmissionsIntensities;

  @ValidateNested({ always: true })
  @Type(() => SequestrationTotalOutput)
  @IsDefined()
  carbonSequestration!: SequestrationTotalOutput;
}
