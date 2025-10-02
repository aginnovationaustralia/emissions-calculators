import { Type } from 'class-transformer';
import { IsDefined, ValidateNested } from 'class-validator';
import { validationMetadatasToSchemas } from 'class-validator-jsonschema';
import { SchemaObject } from 'openapi3-ts/oas31';
import { NetOutput } from '../common/net.output';
import { SchemaDescription, TypeWithArraySchema } from '../decorator.schema';
import { PurchasedOffsetsOutput } from '../purchasedOffsets.output';
import { Scope2Output } from '../scope2.output';
import { SequestrationOutput } from '../sequestration.output';
import { WildCatchFisheryIntensitiesOutput } from './intensities.output';
import { WildCatchFisheryIntermediateOutput } from './intermediate.output';
import { WildCatchFisheryScope1Output } from './scope1.output';
import { WildCatchFisheryScope3Output } from './scope3.output';

@SchemaDescription(
  'Emissions calculation output for the `wildcatchfishery` calculator',
)
export class WildCatchFisheryOutput {
  @ValidateNested({ always: true })
  @Type(() => WildCatchFisheryScope1Output)
  @IsDefined()
  scope1!: WildCatchFisheryScope1Output;

  @ValidateNested({ always: true })
  @Type(() => Scope2Output)
  @IsDefined()
  scope2!: Scope2Output;

  @ValidateNested({ always: true })
  @Type(() => WildCatchFisheryScope3Output)
  @IsDefined()
  scope3!: WildCatchFisheryScope3Output;

  @ValidateNested({ always: true })
  @Type(() => PurchasedOffsetsOutput)
  @IsDefined()
  purchasedOffsets!: PurchasedOffsetsOutput;

  @ValidateNested({ always: true })
  @Type(() => NetOutput)
  @IsDefined()
  net!: NetOutput;

  @ValidateNested({ always: true })
  @Type(() => WildCatchFisheryIntensitiesOutput)
  @IsDefined()
  intensities!: WildCatchFisheryIntensitiesOutput;

  @ValidateNested({ always: true })
  @Type(() => SequestrationOutput)
  @IsDefined()
  carbonSequestration!: SequestrationOutput;

  @TypeWithArraySchema(() => WildCatchFisheryIntermediateOutput)
  @ValidateNested({ always: true, each: true })
  @Type(() => WildCatchFisheryIntermediateOutput)
  @IsDefined()
  intermediate!: WildCatchFisheryIntermediateOutput[];
}

export const schemaWildCatchFisheryOutput: SchemaObject = validationMetadatasToSchemas();
