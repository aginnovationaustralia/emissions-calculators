import { Type } from 'class-transformer';
import { IsDefined, ValidateNested } from 'class-validator';
import { validationMetadatasToSchemas } from 'class-validator-jsonschema';
import { SchemaObject } from 'openapi3-ts/oas31';
import {
  IsNumberArray,
  SchemaDescription,
  TypeWithArraySchema,
} from '../decorator.schema';
import { Scope2Output } from '../scope2.output';
import { SequestrationOutput } from '../sequestration.output';
import { GrainsIntensitiesOutput } from './intensities.output';
import { GrainsIntermediateOutput } from './intermediate.output';
import { GrainsNetOutput } from './net.output';
import { GrainsScope1Output } from './scope1.output';
import { GrainsScope3Output } from './scope3.output';

@SchemaDescription('Emissions calculation output for the `grains` calculator')
export class GrainsOutput {
  @ValidateNested({ always: true })
  @Type(() => GrainsScope1Output)
  @IsDefined()
  scope1!: GrainsScope1Output;

  @ValidateNested({ always: true })
  @Type(() => Scope2Output)
  @IsDefined()
  scope2!: Scope2Output;

  @ValidateNested({ always: true })
  @Type(() => GrainsScope3Output)
  @IsDefined()
  scope3!: GrainsScope3Output;

  @ValidateNested({ always: true })
  @Type(() => SequestrationOutput)
  @IsDefined()
  carbonSequestration!: SequestrationOutput;

  @ValidateNested({ always: true, each: true })
  @TypeWithArraySchema(() => GrainsIntermediateOutput)
  @IsDefined()
  intermediate!: GrainsIntermediateOutput[];

  @ValidateNested({ always: true })
  @Type(() => GrainsNetOutput)
  @IsDefined()
  net!: GrainsNetOutput;

  @ValidateNested({ always: true, each: true })
  @TypeWithArraySchema(
    () => GrainsIntensitiesOutput,
    'Emissions intensity for each crop (in order), in t-CO2e/t crop',
  )
  @IsDefined()
  intensitiesWithSequestration!: GrainsIntensitiesOutput[];

  @IsNumberArray()
  @SchemaDescription(
    'Emissions intensity for each crop (in order), in t-CO2e/t crop',
  )
  @IsDefined()
  intensities!: number[];
}

export const schemaGrainsOutput: SchemaObject = validationMetadatasToSchemas();
