import { Type } from 'class-transformer';
import { IsDefined, IsNumber, IsString, ValidateNested } from 'class-validator';
import { BaseScopesOutput } from '../base';
import { NetOutput } from '../common/net.output';
import { SchemaDescription } from '../decorator.schema';
import { DESCRIPTIONS, OUTPUTDESCRIPTIONS } from '../descriptions.schema';
import { Scope2Output } from '../scope2.output';
import { SheepEmissionsIntensities } from './intensities.output';
import { SheepScope1Output } from './scope1.output';
import { SheepScope3Output } from './scope3.output';

export class SheepIntermediateOutput extends BaseScopesOutput {
  @IsString()
  @SchemaDescription(DESCRIPTIONS.ACTIVITY_ID)
  @IsDefined()
  id!: string;

  @ValidateNested({ always: true })
  @Type(() => SheepScope1Output)
  @IsDefined()
  scope1!: SheepScope1Output;

  @ValidateNested({ always: true })
  @Type(() => Scope2Output)
  @IsDefined()
  scope2!: Scope2Output;

  @ValidateNested({ always: true })
  @Type(() => SheepScope3Output)
  @IsDefined()
  scope3!: SheepScope3Output;

  @IsNumber()
  @SchemaDescription(OUTPUTDESCRIPTIONS.sequestration)
  @IsDefined()
  carbonSequestration!: number;

  @ValidateNested({ always: true })
  @Type(() => SheepEmissionsIntensities)
  @IsDefined()
  intensities!: SheepEmissionsIntensities;

  @ValidateNested({ always: true })
  @Type(() => NetOutput)
  @IsDefined()
  net!: NetOutput;
}
