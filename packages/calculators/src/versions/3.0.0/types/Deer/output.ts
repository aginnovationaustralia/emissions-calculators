import { Type } from 'class-transformer';
import { IsDefined, ValidateNested } from 'class-validator';
import { validationMetadatasToSchemas } from 'class-validator-jsonschema';
import { SchemaObject } from 'openapi3-ts';
import { SchemaDescription, TypeWithArraySchema } from '../decorator.schema';
import { Scope2Output } from '../scope2.output';
import { SequestrationOutput } from '../sequestration.output';
import { DeerEmissionsIntensities } from './intensities.output';
import { DeerIntermediateOutput } from './intermediate.output';
import { DeerNetOutput } from './net.output';
import { DeerScope1Output } from './scope1.output';
import { DeerScope3Output } from './scope3.output';

@SchemaDescription('Emissions calculation output for the `deer` calculator')
export class DeerOutput {
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
  @Type(() => SequestrationOutput)
  @IsDefined()
  carbonSequestration!: SequestrationOutput;

  @ValidateNested({ always: true })
  @Type(() => DeerNetOutput)
  @IsDefined()
  net!: DeerNetOutput;

  @ValidateNested({ always: true })
  @Type(() => DeerEmissionsIntensities)
  @IsDefined()
  intensities!: DeerEmissionsIntensities;

  @ValidateNested({ always: true, each: true })
  @TypeWithArraySchema(() => DeerIntermediateOutput)
  @IsDefined()
  intermediate!: DeerIntermediateOutput[];
}

const schema: Record<string, SchemaObject> = validationMetadatasToSchemas();
export { schema };
