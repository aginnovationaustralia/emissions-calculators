import { Type } from 'class-transformer';
import { IsDefined, ValidateNested } from 'class-validator';
import { validationMetadatasToSchemas } from 'class-validator-jsonschema';
import { SchemaObject } from 'openapi3-ts/oas31';
import { SchemaDescription, TypeWithArraySchema } from '../decorator.schema';
import { Scope2Output } from '../scope2.output';
import { SequestrationOutput } from '../sequestration.output';
import { HorticultureIntensitiesOutput } from './intensities.output';
import { HorticultureIntermediateOutput } from './intermediate.output';
import { HorticultureNetOutput } from './net.output';
import { HorticultureScope1Output } from './scope1.output';
import { HorticultureScope3Output } from './scope3.output';

@SchemaDescription(
  'Emissions calculation output for the `horticulture` calculator',
)
export class HorticultureOutput {
  @ValidateNested({ always: true })
  @Type(() => HorticultureScope1Output)
  @IsDefined()
  scope1!: HorticultureScope1Output;

  @ValidateNested({ always: true })
  @Type(() => Scope2Output)
  @IsDefined()
  scope2!: Scope2Output;

  @ValidateNested({ always: true })
  @Type(() => HorticultureScope3Output)
  @IsDefined()
  scope3!: HorticultureScope3Output;

  @ValidateNested({ always: true })
  @Type(() => SequestrationOutput)
  @IsDefined()
  carbonSequestration!: SequestrationOutput;

  @ValidateNested({ always: true, each: true })
  @TypeWithArraySchema(() => HorticultureIntermediateOutput)
  @IsDefined()
  intermediate!: HorticultureIntermediateOutput[];

  @ValidateNested({ always: true })
  @Type(() => HorticultureNetOutput)
  @IsDefined()
  net!: HorticultureNetOutput;

  @ValidateNested({ always: true, each: true })
  @TypeWithArraySchema(
    () => HorticultureIntensitiesOutput,
    'Emissions intensity for each crop (in order)',
  )
  @IsDefined()
  intensities!: HorticultureIntensitiesOutput[];
}

export const schemaHorticultureOutput: SchemaObject =
  validationMetadatasToSchemas();
