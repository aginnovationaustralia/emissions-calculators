import { Type } from 'class-transformer';
import { IsDefined, ValidateNested } from 'class-validator';
import { validationMetadatasToSchemas } from 'class-validator-jsonschema';
import { SchemaObject } from 'openapi3-ts/oas31';
import { SchemaDescription, TypeWithArraySchema } from '../decorator.schema';
import { Scope2Output } from '../scope2.output';
import { SequestrationOutput } from '../sequestration.output';
import { RiceEmissionsIntensities } from './intensities.output';
import { RiceIntermediateOutput } from './intermediate.output';
import { RiceNetOutput } from './net.output';
import { RiceScope1Output } from './scope1.output';
import { RiceScope3Output } from './scope3.output';

@SchemaDescription('Emissions calculation output for the `rice` calculator')
export class RiceOutput {
  @ValidateNested({ always: true })
  @Type(() => RiceScope1Output)
  @IsDefined()
  scope1!: RiceScope1Output;

  @ValidateNested({ always: true })
  @Type(() => Scope2Output)
  @IsDefined()
  scope2!: Scope2Output;

  @ValidateNested({ always: true })
  @Type(() => RiceScope3Output)
  @IsDefined()
  scope3!: RiceScope3Output;

  @ValidateNested({ always: true })
  @Type(() => SequestrationOutput)
  @IsDefined()
  carbonSequestration!: SequestrationOutput;

  @ValidateNested({ always: true, each: true })
  @TypeWithArraySchema(() => RiceIntermediateOutput)
  @IsDefined()
  intermediate!: RiceIntermediateOutput[];

  @ValidateNested({ always: true })
  @Type(() => RiceNetOutput)
  @IsDefined()
  net!: RiceNetOutput;

  @ValidateNested({ always: true })
  @Type(() => RiceEmissionsIntensities)
  @SchemaDescription('Emissions intensities for the crop')
  @IsDefined()
  intensities!: RiceEmissionsIntensities;
}

export const schemaRiceOutput: SchemaObject = validationMetadatasToSchemas();
