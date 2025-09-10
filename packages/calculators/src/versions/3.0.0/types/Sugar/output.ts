import { Type } from 'class-transformer';
import { IsDefined, ValidateNested } from 'class-validator';
import { validationMetadatasToSchemas } from 'class-validator-jsonschema';
import { SchemaObject } from 'openapi3-ts';
import { SchemaDescription, TypeWithArraySchema } from '../decorator.schema';
import { Scope2Output } from '../scope2.output';
import { SequestrationOutput } from '../sequestration.output';
import { SugarIntensitiesOutput } from './intensities.output';
import { SugarIntermediateOutput } from './intermediate.output';
import { SugarNetOutput } from './net.output';
import { SugarScope1Output } from './scope1.output';
import { SugarScope3Output } from './scope3.output';

@SchemaDescription('Emissions calculation output for the `sugar` calculator')
export class SugarOutput {
  @ValidateNested({ always: true })
  @Type(() => SugarScope1Output)
  @IsDefined()
  scope1!: SugarScope1Output;

  @ValidateNested({ always: true })
  @Type(() => Scope2Output)
  @IsDefined()
  scope2!: Scope2Output;

  @ValidateNested({ always: true })
  @Type(() => SugarScope3Output)
  @IsDefined()
  scope3!: SugarScope3Output;

  @ValidateNested({ always: true })
  @Type(() => SequestrationOutput)
  @IsDefined()
  carbonSequestration!: SequestrationOutput;

  @ValidateNested({ always: true, each: true })
  @TypeWithArraySchema(() => SugarIntermediateOutput)
  @IsDefined()
  intermediate!: SugarIntermediateOutput[];

  @ValidateNested({ always: true })
  @Type(() => SugarNetOutput)
  @IsDefined()
  net!: SugarNetOutput;

  @ValidateNested({ always: true, each: true })
  @TypeWithArraySchema(() => SugarIntensitiesOutput)
  @SchemaDescription(
    'Emissions intensity for each crop (in order), in t-CO2e/t crop',
  )
  @IsDefined()
  intensities!: SugarIntensitiesOutput[];
}

const schema: Record<string, SchemaObject> = validationMetadatasToSchemas();

export { schema };
