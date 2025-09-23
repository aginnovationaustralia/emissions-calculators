import { Type } from 'class-transformer';
import { IsDefined, ValidateNested } from 'class-validator';
import { validationMetadatasToSchemas } from 'class-validator-jsonschema';
import { SchemaObject } from 'openapi3-ts/oas31';
import { SchemaDescription, TypeWithArraySchema } from '../decorator.schema';
import { PurchasedOffsetsOutput } from '../purchasedOffsets.output';
import { Scope2Output } from '../scope2.output';
import { SequestrationOutput } from '../sequestration.output';
import { ProcessingIntensitiesOutput } from './intensities.output';
import { ProcessingIntermediateOutput } from './intermediate.output';
import { ProcessingNetOutput } from './net.output';
import { ProcessingScope1Output } from './scope1.output';
import { ProcessingScope3Output } from './scope3.output';

@SchemaDescription(
  'Emissions calculation output for the `processing` calculator',
)
export class ProcessingOutput {
  @ValidateNested({ always: true })
  @Type(() => ProcessingScope1Output)
  @IsDefined()
  scope1!: ProcessingScope1Output;

  @ValidateNested({ always: true })
  @Type(() => Scope2Output)
  @IsDefined()
  scope2!: Scope2Output;

  @ValidateNested({ always: true })
  @Type(() => ProcessingScope3Output)
  @IsDefined()
  scope3!: ProcessingScope3Output;

  @ValidateNested({ always: true })
  @Type(() => PurchasedOffsetsOutput)
  @IsDefined()
  purchasedOffsets!: PurchasedOffsetsOutput;

  @ValidateNested({ always: true })
  @Type(() => ProcessingNetOutput)
  @IsDefined()
  net!: ProcessingNetOutput;

  @ValidateNested({ always: true, each: true })
  @TypeWithArraySchema(() => ProcessingIntensitiesOutput)
  @IsDefined()
  intensities!: ProcessingIntensitiesOutput[];

  @ValidateNested({ always: true })
  @Type(() => SequestrationOutput)
  @IsDefined()
  carbonSequestration!: SequestrationOutput;

  @ValidateNested({ always: true, each: true })
  @TypeWithArraySchema(() => ProcessingIntermediateOutput)
  @IsDefined()
  intermediate!: ProcessingIntermediateOutput[];
}

const schema: SchemaObject = validationMetadatasToSchemas();

export { schema };
