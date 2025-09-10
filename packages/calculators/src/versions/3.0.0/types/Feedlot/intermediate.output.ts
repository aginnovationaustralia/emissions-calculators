import { Type } from 'class-transformer';
import { IsDefined, IsString, ValidateNested } from 'class-validator';
import { SchemaDescription } from '../decorator.schema';
import { DESCRIPTIONS } from '../descriptions.schema';
import { Scope2Output } from '../scope2.output';
import { SequestrationTotalOutput } from '../sequestration.total.output';
import { FeedlotEmissionIntensities } from './intensities.output';
import { FeedlotNetOutput } from './net.output';
import { FeedlotScope1Output } from './scope1.output';
import { FeedlotScope3Output } from './scope3.output';

export class FeedlotIntermediateOutput {
  @IsString()
  @SchemaDescription(DESCRIPTIONS.ACTIVITY_ID)
  @IsDefined()
  id!: string;

  @ValidateNested({ always: true })
  @Type(() => FeedlotScope1Output)
  @IsDefined()
  scope1!: FeedlotScope1Output;

  @ValidateNested({ always: true })
  @Type(() => Scope2Output)
  @IsDefined()
  scope2!: Scope2Output;

  @ValidateNested({ always: true })
  @Type(() => FeedlotScope3Output)
  @IsDefined()
  scope3!: FeedlotScope3Output;

  @ValidateNested({ always: true })
  @Type(() => SequestrationTotalOutput)
  @IsDefined()
  carbonSequestration!: SequestrationTotalOutput;

  @ValidateNested({ always: true })
  @Type(() => FeedlotNetOutput)
  @IsDefined()
  net!: FeedlotNetOutput;

  @ValidateNested({ always: true })
  @Type(() => FeedlotEmissionIntensities)
  @IsDefined()
  intensities!: FeedlotEmissionIntensities;
}
