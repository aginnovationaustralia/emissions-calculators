import { Type } from 'class-transformer';
import { IsDefined, ValidateNested } from 'class-validator';
import { validationMetadatasToSchemas } from 'class-validator-jsonschema';
import { SchemaObject } from 'openapi3-ts/oas31';
import 'reflect-metadata';
import { SchemaDescription, TypeWithArraySchema } from '../decorator.schema';
import { Scope2Output } from '../scope2.output';
import { SequestrationOutput } from '../sequestration.output';
import { DairyEmissionsIntensities } from './intensities.output';
import { DairyIntermediateOutput } from './intermediate.output';
import { DairyNet } from './net.output';
import { DairyScope1Output } from './scope1.output';
import { DairyScope3Output } from './scope3.output';

@SchemaDescription('Emissions calculation output for the `dairy` calculator')
export class DairyOutput {
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
  @Type(() => SequestrationOutput)
  @IsDefined()
  carbonSequestration!: SequestrationOutput;

  @ValidateNested({ always: true })
  @Type(() => DairyNet)
  @IsDefined()
  net!: DairyNet;

  @ValidateNested({ always: true })
  @Type(() => DairyEmissionsIntensities)
  @IsDefined()
  intensities!: DairyEmissionsIntensities;

  @ValidateNested({ always: true, each: true })
  @TypeWithArraySchema(() => DairyIntermediateOutput)
  @IsDefined()
  intermediate!: DairyIntermediateOutput[];
}

const schema: SchemaObject = validationMetadatasToSchemas();

export { schema };
