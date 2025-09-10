import { Type } from 'class-transformer';
import { IsDefined, ValidateNested } from 'class-validator';
import { SchemaDescription, TypeWithArraySchema } from '../decorator.schema';
import { Scope2Output } from '../scope2.output';
import { SequestrationOutput } from '../sequestration.output';
import { FeedlotEmissionIntensities } from './intensities.output';
import { FeedlotIntermediateOutput } from './intermediate.output';
import { FeedlotNetOutput } from './net.output';
import { FeedlotScope1Output } from './scope1.output';
import { FeedlotScope3Output } from './scope3.output';

@SchemaDescription('Emissions calculation output for the `feedlot` calculator')
export class FeedlotOutput {
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
  @Type(() => SequestrationOutput)
  @IsDefined()
  carbonSequestration!: SequestrationOutput;

  @ValidateNested({ always: true, each: true })
  @TypeWithArraySchema(() => FeedlotIntermediateOutput)
  @IsDefined()
  intermediate!: FeedlotIntermediateOutput[];

  @ValidateNested({ always: true })
  @Type(() => FeedlotNetOutput)
  @IsDefined()
  net!: FeedlotNetOutput;

  @ValidateNested({ always: true })
  @Type(() => FeedlotEmissionIntensities)
  @IsDefined()
  intensities!: FeedlotEmissionIntensities;
}


