import { Type } from 'class-transformer';
import { IsDefined, IsString, ValidateNested } from 'class-validator';
import { NetOutput } from '../common/net.output';
import { SchemaDescription } from '../decorator.schema';
import { DESCRIPTIONS } from '../descriptions.schema';
import { Scope2Output } from '../scope2.output';
import { SequestrationTotalOutput } from '../sequestration.total.output';
import { WildCatchFisheryIntensitiesOutput } from './intensities.output';
import { WildCatchFisheryScope1Output } from './scope1.output';
import { WildCatchFisheryScope3Output } from './scope3.output';

@SchemaDescription(
  'Intermediate emissions calculation output for the `wildcatchfishery` calculator',
)
export class WildCatchFisheryIntermediateOutput {
  @IsString()
  @SchemaDescription(DESCRIPTIONS.ACTIVITY_ID)
  @IsDefined()
  id!: string;

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
  @Type(() => WildCatchFisheryIntensitiesOutput)
  @IsDefined()
  intensities!: WildCatchFisheryIntensitiesOutput;

  @ValidateNested({ always: true })
  @Type(() => NetOutput)
  @IsDefined()
  net!: NetOutput;

  @ValidateNested({ always: true })
  @Type(() => SequestrationTotalOutput)
  @IsDefined()
  carbonSequestration!: SequestrationTotalOutput;
}
