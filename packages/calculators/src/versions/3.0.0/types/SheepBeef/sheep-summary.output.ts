import { Type } from 'class-transformer';
import { IsDefined, IsNumber, ValidateNested } from 'class-validator';
import { BaseScopesOutput } from '../base';
import { NetOutput } from '../common/net.output';
import { SchemaDescription } from '../decorator.schema';
import { OUTPUTDESCRIPTIONS } from '../descriptions.schema';
import { Scope2Output } from '../scope2.output';
import { SheepEmissionsIntensities } from '../Sheep/intensities.output';
import { SheepBeefScope1Output } from './scope1.output';
import { SheepBeefScope3Output } from './scope3.output';

export class SheepSummaryOutput extends BaseScopesOutput {
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

  @IsNumber()
  @SchemaDescription(OUTPUTDESCRIPTIONS.sequestration)
  @IsDefined()
  carbonSequestration!: number;

  @ValidateNested({ always: true })
  @Type(() => NetOutput)
  @IsDefined()
  net!: NetOutput;

  @ValidateNested({ always: true })
  @Type(() => SheepEmissionsIntensities)
  @IsDefined()
  intensities!: SheepEmissionsIntensities;
}
