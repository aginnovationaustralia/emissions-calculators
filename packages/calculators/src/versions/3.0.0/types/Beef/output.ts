import { Type } from 'class-transformer';
import { IsDefined, ValidateNested } from 'class-validator';
import { SchemaDescription, TypeWithArraySchema } from '../decorator.schema';
import { Scope2Output } from '../scope2.output';
import { SequestrationOutput } from '../sequestration.output';
import { BeefEmissionsIntensities } from './intensities.output';
import { BeefIntermediateOutput } from './intermediate.output';
import { BeefNet } from './net.output';
import { BeefScope1Output } from './scope1.output';
import { BeefScope3Output } from './scope3.output';

@SchemaDescription('Emissions calculation output for the `beef` calculator')
export class BeefOutput {
  @ValidateNested({ always: true })
  @Type(() => BeefScope1Output)
  @IsDefined()
  scope1!: BeefScope1Output;

  @ValidateNested({ always: true })
  @Type(() => Scope2Output)
  @IsDefined()
  scope2!: Scope2Output;

  @ValidateNested({ always: true })
  @Type(() => BeefScope3Output)
  @IsDefined()
  scope3!: BeefScope3Output;

  @ValidateNested({ always: true })
  @Type(() => SequestrationOutput)
  @IsDefined()
  carbonSequestration!: SequestrationOutput;

  @ValidateNested({ always: true, each: true })
  @TypeWithArraySchema(() => BeefIntermediateOutput)
  @IsDefined()
  intermediate!: BeefIntermediateOutput[];

  @ValidateNested({ always: true })
  @Type(() => BeefNet)
  @IsDefined()
  net!: BeefNet;

  @ValidateNested({ always: true })
  @Type(() => BeefEmissionsIntensities)
  @IsDefined()
  intensities!: BeefEmissionsIntensities;
}


