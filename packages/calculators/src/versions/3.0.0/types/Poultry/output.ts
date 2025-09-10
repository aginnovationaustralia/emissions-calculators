import { Type } from 'class-transformer';
import { IsDefined, ValidateNested } from 'class-validator';
import { validationMetadatasToSchemas } from 'class-validator-jsonschema';
import { SchemaObject } from 'openapi3-ts';
import { SchemaDescription, TypeWithArraySchema } from '../decorator.schema';
import { Scope2Output } from '../scope2.output';
import { SequestrationOutput } from '../sequestration.output';
import { PoultryEmissionsIntensities } from './intensities.output';
import { PoultryIntermediateBroilersOutput } from './intermediate-broilers.output';
import { PoultryIntermediateLayersOutput } from './intermediate-layers.output';
import { PoultryNet } from './net.output';
import { PoultryScope1Output } from './scope1.output';
import { PoultryScope3Output } from './scope3.output';

@SchemaDescription('Emissions calculation output for the `poultry` calculator')
export class PoultryOutput {
  @ValidateNested({ always: true })
  @Type(() => PoultryScope1Output)
  @IsDefined()
  scope1!: PoultryScope1Output;

  @ValidateNested({ always: true })
  @Type(() => Scope2Output)
  @IsDefined()
  scope2!: Scope2Output;

  @ValidateNested({ always: true })
  @Type(() => PoultryScope3Output)
  @IsDefined()
  scope3!: PoultryScope3Output;

  @ValidateNested({ always: true })
  @Type(() => SequestrationOutput)
  @IsDefined()
  carbonSequestration!: SequestrationOutput;

  @ValidateNested({ always: true, each: true })
  @TypeWithArraySchema(() => PoultryIntermediateBroilersOutput)
  @IsDefined()
  intermediateBroilers!: PoultryIntermediateBroilersOutput[];

  @ValidateNested({ always: true, each: true })
  @TypeWithArraySchema(() => PoultryIntermediateLayersOutput)
  @IsDefined()
  intermediateLayers!: PoultryIntermediateLayersOutput[];

  @ValidateNested({ always: true })
  @Type(() => PoultryNet)
  @IsDefined()
  net!: PoultryNet;

  @ValidateNested({ always: true })
  @Type(() => PoultryEmissionsIntensities)
  @IsDefined()
  intensities!: PoultryEmissionsIntensities;
}

const schema: Record<string, SchemaObject> = validationMetadatasToSchemas();

export { schema };
