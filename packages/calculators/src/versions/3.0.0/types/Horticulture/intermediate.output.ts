import { Type } from 'class-transformer';
import { IsDefined, IsString, ValidateNested } from 'class-validator';
import { NetOutput } from '../common/net.output';
import { SchemaDescription } from '../decorator.schema';
import { DESCRIPTIONS } from '../descriptions.schema';
import { Scope2Output } from '../scope2.output';
import { SequestrationTotalOutput } from '../sequestration.total.output';
import { HorticultureIntensitiesOutput } from './intensities.output';
import { HorticultureScope1Output } from './scope1.output';
import { HorticultureScope3Output } from './scope3.output';

@SchemaDescription(
  'Intermediate emissions calculation output for the Horticulture calculator',
)
export class HorticultureIntermediateOutput {
  @IsString()
  @SchemaDescription(DESCRIPTIONS.ACTIVITY_ID)
  @IsDefined()
  id!: string;

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
  @Type(() => HorticultureIntensitiesOutput)
  @IsDefined()
  intensitiesWithSequestration!: HorticultureIntensitiesOutput;

  @ValidateNested({ always: true })
  @Type(() => NetOutput)
  @IsDefined()
  net!: NetOutput;

  @ValidateNested({ always: true })
  @Type(() => SequestrationTotalOutput)
  @IsDefined()
  carbonSequestration!: SequestrationTotalOutput;
}
