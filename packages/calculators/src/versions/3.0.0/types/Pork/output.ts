import { Type } from 'class-transformer';
import { IsDefined, ValidateNested } from 'class-validator';
import { validationMetadatasToSchemas } from 'class-validator-jsonschema';
import { SchemaObject } from 'openapi3-ts';
import { SchemaDescription, TypeWithArraySchema } from '../decorator.schema';
import { Scope2Output } from '../scope2.output';
import { SequestrationOutput } from '../sequestration.output';
import { PorkEmissionsIntensities } from './intensities.output';
import { PorkIntermediateOutput } from './intermediate.output';
import { PorkNetOutput } from './net.output';
import { PorkScope1Output } from './scope1.output';
import { PorkScope3Output } from './scope3.output';

@SchemaDescription('Emissions calculation output for the `pork` calculator')
export class PorkOutput {
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

  @ValidateNested({ always: true })
  @Type(() => SequestrationOutput)
  @IsDefined()
  carbonSequestration!: SequestrationOutput;

  @ValidateNested({ always: true })
  @Type(() => PorkNetOutput)
  @IsDefined()
  net!: PorkNetOutput;

  @ValidateNested({ always: true })
  @Type(() => PorkEmissionsIntensities)
  @IsDefined()
  intensities!: PorkEmissionsIntensities;

  @ValidateNested({ always: true, each: true })
  @TypeWithArraySchema(() => PorkIntermediateOutput)
  @IsDefined()
  intermediate!: PorkIntermediateOutput[];
}

const schema: Record<string, SchemaObject> = validationMetadatasToSchemas();

export { schema };
