import { Type } from 'class-transformer';
import { IsDefined, ValidateNested } from 'class-validator';
import { validationMetadatasToSchemas } from 'class-validator-jsonschema';
import { SchemaObject } from 'openapi3-ts/oas31';
import { SchemaDescription, TypeWithArraySchema } from '../decorator.schema';
import { Scope2Output } from '../scope2.output';
import { SequestrationOutput } from '../sequestration.output';
import { SheepEmissionsIntensities } from './intensities.output';
import { SheepIntermediateOutput } from './intermediate.output';
import { SheepNet } from './net.output';
import { SheepScope1Output } from './scope1.output';
import { SheepScope3Output } from './scope3.output';

@SchemaDescription('Emissions calculation output for the `sheep` calculator')
export class SheepOutput {
  @ValidateNested({ always: true })
  @Type(() => SheepScope1Output)
  @IsDefined()
  scope1!: SheepScope1Output;

  @ValidateNested({ always: true })
  @Type(() => Scope2Output)
  @IsDefined()
  scope2!: Scope2Output;

  @ValidateNested({ always: true })
  @Type(() => SheepScope3Output)
  @IsDefined()
  scope3!: SheepScope3Output;

  @ValidateNested({ always: true })
  @Type(() => SequestrationOutput)
  @IsDefined()
  carbonSequestration!: SequestrationOutput;

  @ValidateNested({ always: true, each: true })
  @TypeWithArraySchema(() => SheepIntermediateOutput)
  @IsDefined()
  intermediate!: SheepIntermediateOutput[];

  @ValidateNested({ always: true })
  @Type(() => SheepNet)
  @IsDefined()
  net!: SheepNet;

  @ValidateNested({ always: true })
  @Type(() => SheepEmissionsIntensities)
  @IsDefined()
  intensities!: SheepEmissionsIntensities;
}

export const schemaSheepOutput: SchemaObject = validationMetadatasToSchemas();
