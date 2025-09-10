import { Type } from 'class-transformer';
import { IsDefined, IsNumber, IsString, ValidateNested } from 'class-validator';
import { NetOutput } from '../common/net.output';
import { SchemaDescription } from '../decorator.schema';
import { DESCRIPTIONS, OUTPUTDESCRIPTIONS } from '../descriptions.schema';
import { Scope2Output } from '../scope2.output';
import { BeefEmissionsIntensities } from './intensities.output';
import { BeefScope1Output } from './scope1.output';
import { BeefScope3Output } from './scope3.output';

@SchemaDescription(
  'Intermediate emissions calculation output for the Beef calculator',
)
export class BeefIntermediateOutput {
  @IsString()
  @SchemaDescription(DESCRIPTIONS.ACTIVITY_ID)
  @IsDefined()
  id!: string;

  @ValidateNested({ always: true })
  @Type(() => BeefScope1Output)
  @IsDefined()
  scope1!: BeefScope1Output;

  @ValidateNested({ always: true })
  @Type(() => Scope2Output)
  @IsDefined()
  scope2!: Scope2Output;

  @ValidateNested({ always: true })
  @Type(() => BeefScope3Output)
  @IsDefined()
  scope3!: BeefScope3Output;

  @IsNumber()
  @SchemaDescription(OUTPUTDESCRIPTIONS.sequestration)
  @IsDefined()
  carbonSequestration!: number;

  @ValidateNested({ always: true })
  @Type(() => BeefEmissionsIntensities)
  @IsDefined()
  intensities!: BeefEmissionsIntensities;

  @ValidateNested({ always: true })
  @Type(() => NetOutput)
  @IsDefined()
  net!: NetOutput;
}
