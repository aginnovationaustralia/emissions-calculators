import { Type } from 'class-transformer';
import { IsDefined, IsString, ValidateNested } from 'class-validator';
import { NetOutput } from '../common/net.output';
import { SchemaDescription } from '../decorator.schema';
import { DESCRIPTIONS } from '../descriptions.schema';
import { Scope2Output } from '../scope2.output';
import { SequestrationTotalOutput } from '../sequestration.total.output';
import { AquacultureIntensitiesOutput } from './intensities.output';
import { AquacultureScope1Output } from './scope1.output';
import { AquacultureScope3Output } from './scope3.output';

@SchemaDescription(
  'Intermediate emissions calculation output for the Aquaculture calculator',
)
export class AquacultureIntermediateOutput {
  @IsString()
  @SchemaDescription(DESCRIPTIONS.ACTIVITY_ID)
  @IsDefined()
  id!: string;

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
  @Type(() => AquacultureIntensitiesOutput)
  @IsDefined()
  intensities!: AquacultureIntensitiesOutput;

  @ValidateNested({ always: true })
  @Type(() => NetOutput)
  @IsDefined()
  net!: NetOutput;

  @ValidateNested({ always: true })
  @Type(() => SequestrationTotalOutput)
  @IsDefined()
  carbonSequestration!: SequestrationTotalOutput;
}
