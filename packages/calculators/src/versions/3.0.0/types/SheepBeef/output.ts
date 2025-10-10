import { Type } from 'class-transformer';
import { IsDefined, ValidateNested } from 'class-validator';
import { validationMetadatasToSchemas } from 'class-validator-jsonschema';
import { SchemaObject } from 'openapi3-ts/oas31';
import { BeefIntermediateOutput } from '../Beef/intermediate.output';
import { SchemaDescription, TypeWithArraySchema } from '../decorator.schema';
import { Scope2Output } from '../scope2.output';
import { SequestrationOutput } from '../sequestration.output';
import { SheepIntermediateOutput } from '../Sheep/intermediate.output';
import { SheepBeefEmissionsIntensities } from './intensities.output';
import { SheepBeefIntermediateOutput } from './intermediate.output';
import { SheepBeefNet } from './net.output';
import { SheepBeefScope1Output } from './scope1.output';
import { SheepBeefScope3Output } from './scope3.output';

@SchemaDescription(
  'Emissions calculation output for the `sheepbeef` calculator',
)
export class SheepBeefOutput {
  @ValidateNested({ always: true })
  @Type(() => SheepBeefScope1Output)
  @IsDefined()
  scope1!: SheepBeefScope1Output;

  @ValidateNested({ always: true })
  @Type(() => Scope2Output)
  @IsDefined()
  scope2!: Scope2Output;

  @ValidateNested({ always: true })
  @Type(() => SheepBeefScope3Output)
  @IsDefined()
  scope3!: SheepBeefScope3Output;

  @ValidateNested({ always: true })
  @Type(() => SequestrationOutput)
  @IsDefined()
  carbonSequestration!: SequestrationOutput;

  @ValidateNested({ always: true })
  @Type(() => SheepBeefIntermediateOutput)
  @IsDefined()
  intermediate!: SheepBeefIntermediateOutput;

  @ValidateNested({ always: true, each: true })
  @TypeWithArraySchema(() => BeefIntermediateOutput)
  @IsDefined()
  intermediateBeef!: BeefIntermediateOutput[];

  @ValidateNested({ always: true, each: true })
  @TypeWithArraySchema(() => SheepIntermediateOutput)
  @IsDefined()
  intermediateSheep!: SheepIntermediateOutput[];

  @ValidateNested({ always: true })
  @Type(() => SheepBeefNet)
  @IsDefined()
  net!: SheepBeefNet;

  @ValidateNested({ always: true })
  @Type(() => SheepBeefEmissionsIntensities)
  @IsDefined()
  intensities!: SheepBeefEmissionsIntensities;
}
export const schemaSheepBeefOutput: SchemaObject =
  validationMetadatasToSchemas();

