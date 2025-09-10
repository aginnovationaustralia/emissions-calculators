import { Type } from 'class-transformer';
import { IsDefined, IsNumber, IsString, ValidateNested } from 'class-validator';
import { BaseScopesOutput } from '../base';
import { SchemaDescription } from '../decorator.schema';
import { OUTPUTDESCRIPTIONS } from '../descriptions.schema';
import { Scope2Output } from '../scope2.output';
import { PorkEmissionsIntensities } from './intensities.output';
import { PorkNetOutput } from './net.output';
import { PorkScope1Output } from './scope1.output';
import { PorkScope3Output } from './scope3.output';

export class PorkIntermediateOutput extends BaseScopesOutput {
  @IsString()
  @IsDefined()
  id!: string;

  @ValidateNested({ always: true })
  @Type(() => PorkScope1Output)
  @IsDefined()
  scope1!: PorkScope1Output;

  @ValidateNested({ always: true })
  @Type(() => Scope2Output)
  @IsDefined()
  scope2!: Scope2Output;

  @ValidateNested({ always: true })
  @Type(() => PorkScope3Output)
  @IsDefined()
  scope3!: PorkScope3Output;

  @IsNumber()
  @SchemaDescription(OUTPUTDESCRIPTIONS.sequestration)
  @IsDefined()
  carbonSequestration!: number;

  @ValidateNested({ always: true })
  @Type(() => PorkNetOutput)
  @IsDefined()
  net!: PorkNetOutput;

  @ValidateNested({ always: true })
  @Type(() => PorkEmissionsIntensities)
  @IsDefined()
  intensities!: PorkEmissionsIntensities;
}
