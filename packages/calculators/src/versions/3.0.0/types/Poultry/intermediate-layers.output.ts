import { Type } from 'class-transformer';
import { IsDefined, IsString, ValidateNested } from 'class-validator';
import { BaseScopesOutput } from '../base';
import { NetOutput } from '../common/net.output';
import { Scope2Output } from '../scope2.output';
import { SequestrationTotalOutput } from '../sequestration.total.output';
import { PoultryEmissionsIntensitiesLayer } from './intensities-layer.output';
import { PoultryScope1Output } from './scope1.output';
import { PoultryScope3Output } from './scope3.output';

export class PoultryIntermediateLayersOutput extends BaseScopesOutput {
  @IsString()
  @IsDefined()
  id!: string;

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
  @Type(() => SequestrationTotalOutput)
  @IsDefined()
  carbonSequestration!: SequestrationTotalOutput;

  @ValidateNested({ always: true })
  @Type(() => PoultryEmissionsIntensitiesLayer)
  @IsDefined()
  intensities!: PoultryEmissionsIntensitiesLayer;

  @ValidateNested({ always: true })
  @Type(() => NetOutput)
  @IsDefined()
  net!: NetOutput;
}
