import { Type } from 'class-transformer';
import { IsDefined, ValidateNested } from 'class-validator';
import { NetOutput } from '../common/net.output';
import { SchemaDescription, TypeWithArraySchema } from '../decorator.schema';
import { PurchasedOffsetsOutput } from '../purchasedOffsets.output';
import { Scope2Output } from '../scope2.output';
import { SequestrationOutput } from '../sequestration.output';
import { AquacultureIntensitiesOutput } from './intensities.output';
import { AquacultureIntermediateOutput } from './intermediate.output';
import { AquacultureScope1Output } from './scope1.output';
import { AquacultureScope3Output } from './scope3.output';

@SchemaDescription(
  'Emissions calculation output for the `aquaculture` calculator',
)
export class AquacultureOutput {
  @ValidateNested({ always: true })
  @Type(() => AquacultureScope1Output)
  @IsDefined()
  scope1!: AquacultureScope1Output;

  @ValidateNested({ always: true })
  @Type(() => Scope2Output)
  @IsDefined()
  scope2!: Scope2Output;

  @ValidateNested({ always: true })
  @Type(() => AquacultureScope3Output)
  @IsDefined()
  scope3!: AquacultureScope3Output;

  @ValidateNested({ always: true })
  @Type(() => PurchasedOffsetsOutput)
  @IsDefined()
  purchasedOffsets!: PurchasedOffsetsOutput;

  @ValidateNested({ always: true })
  @Type(() => NetOutput)
  @IsDefined()
  net!: NetOutput;

  @ValidateNested({ always: true })
  @Type(() => AquacultureIntensitiesOutput)
  @IsDefined()
  intensities!: AquacultureIntensitiesOutput;

  @ValidateNested({ always: true })
  @Type(() => SequestrationOutput)
  @IsDefined()
  carbonSequestration!: SequestrationOutput;

  @TypeWithArraySchema(() => AquacultureIntermediateOutput)
  @ValidateNested({ always: true, each: true })
  @Type(() => AquacultureIntermediateOutput)
  @IsDefined()
  intermediate!: AquacultureIntermediateOutput[];
}


