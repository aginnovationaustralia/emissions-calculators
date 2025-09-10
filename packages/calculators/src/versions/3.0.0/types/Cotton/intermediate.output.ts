import { Type } from 'class-transformer';
import { IsDefined, IsString, ValidateNested } from 'class-validator';
import { NetOutput } from '../common/net.output';
import { SchemaDescription } from '../decorator.schema';
import { DESCRIPTIONS } from '../descriptions.schema';
import { Scope2Output } from '../scope2.output';
import { SequestrationTotalOutput } from '../sequestration.total.output';
import { CottonIntensitiesOutput } from './intensities.output';
import { CottonScope1Output } from './scope1.output';
import { CottonScope3Output } from './scope3.output';

@SchemaDescription(
  'Intermediate emissions calculation output for the Cotton calculator',
)
export class CottonIntermediateOutput {
  @IsString()
  @SchemaDescription(DESCRIPTIONS.ACTIVITY_ID)
  @IsDefined()
  id!: string;

  @ValidateNested({ always: true })
  @Type(() => CottonScope1Output)
  @IsDefined()
  scope1!: CottonScope1Output;

  @ValidateNested({ always: true })
  @Type(() => Scope2Output)
  @IsDefined()
  scope2!: Scope2Output;

  @ValidateNested({ always: true })
  @Type(() => CottonScope3Output)
  @IsDefined()
  scope3!: CottonScope3Output;

  @ValidateNested({ always: true })
  @Type(() => CottonIntensitiesOutput)
  @IsDefined()
  intensities!: CottonIntensitiesOutput;

  @ValidateNested({ always: true })
  @Type(() => NetOutput)
  @IsDefined()
  net!: NetOutput;

  @ValidateNested({ always: true })
  @Type(() => SequestrationTotalOutput)
  @IsDefined()
  carbonSequestration!: SequestrationTotalOutput;
}
