import { Type } from 'class-transformer';
import { IsDefined, ValidateNested } from 'class-validator';
import { validationMetadatasToSchemas } from 'class-validator-jsonschema';
import { SchemaObject } from 'openapi3-ts';
import { SchemaDescription, TypeWithArraySchema } from '../decorator.schema';
import { Scope2Output } from '../scope2.output';
import { SequestrationOutput } from '../sequestration.output';
import { BuffaloEmissionsIntensities } from './intensities.output';
import { BuffaloIntermediateOutput } from './intermediate.output';
import { BuffaloNetOutput } from './net.output';
import { BuffaloScope1Output } from './scope1.output';
import { BuffaloScope3Output } from './scope3.output';

@SchemaDescription('Emissions calculation output for the `Buffalo` calculator')
export class BuffaloOutput {
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
  @Type(() => SequestrationOutput)
  @IsDefined()
  carbonSequestration!: SequestrationOutput;

  @ValidateNested({ always: true })
  @Type(() => BuffaloNetOutput)
  @IsDefined()
  net!: BuffaloNetOutput;

  @ValidateNested({ always: true })
  @Type(() => BuffaloEmissionsIntensities)
  @IsDefined()
  intensities!: BuffaloEmissionsIntensities;

  @ValidateNested({ always: true, each: true })
  @TypeWithArraySchema(() => BuffaloIntermediateOutput)
  @IsDefined()
  intermediate!: BuffaloIntermediateOutput[];
}

const schema: Record<string, SchemaObject> = validationMetadatasToSchemas();
export { schema };
