import { Type } from 'class-transformer';
import { IsDefined, ValidateNested } from 'class-validator';
import { validationMetadatasToSchemas } from 'class-validator-jsonschema';
import { SchemaObject } from 'openapi3-ts/oas31';
import { SchemaDescription, TypeWithArraySchema } from '../decorator.schema';
import { Scope2Output } from '../scope2.output';
import { SequestrationOutput } from '../sequestration.output';
import { GoatEmissionsIntensities } from './intensities.output';
import { GoatIntermediateOutput } from './intermediate.output';
import { GoatNetOutput } from './net.output';
import { GoatScope1Output } from './scope1.output';
import { GoatScope3Output } from './scope3.output';

@SchemaDescription('Emissions calculation output for the `goat` calculator')
export class GoatOutput {
  @ValidateNested({ always: true })
  @Type(() => GoatScope1Output)
  @IsDefined()
  scope1!: GoatScope1Output;

  @ValidateNested({ always: true })
  @Type(() => Scope2Output)
  @IsDefined()
  scope2!: Scope2Output;

  @ValidateNested({ always: true })
  @Type(() => GoatScope3Output)
  @IsDefined()
  scope3!: GoatScope3Output;

  @ValidateNested({ always: true })
  @Type(() => SequestrationOutput)
  @IsDefined()
  carbonSequestration!: SequestrationOutput;

  @ValidateNested({ always: true })
  @Type(() => GoatNetOutput)
  @IsDefined()
  net!: GoatNetOutput;

  @ValidateNested({ always: true })
  @Type(() => GoatEmissionsIntensities)
  @IsDefined()
  intensities!: GoatEmissionsIntensities;

  @ValidateNested({ always: true, each: true })
  @TypeWithArraySchema(() => GoatIntermediateOutput)
  @IsDefined()
  intermediate!: GoatIntermediateOutput[];
}

const schema: SchemaObject = validationMetadatasToSchemas();

export { schema };
