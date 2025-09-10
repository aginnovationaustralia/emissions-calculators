import { Type } from 'class-transformer';
import { IsDefined, IsNumber, IsString, ValidateNested } from 'class-validator';
import { NetOutput } from '../common/net.output';
import { SchemaDescription } from '../decorator.schema';
import { DESCRIPTIONS, OUTPUTDESCRIPTIONS } from '../descriptions.schema';
import { Scope2Output } from '../scope2.output';
import { RiceEmissionsIntensities } from './intensities.output';
import { RiceScope1Output } from './scope1.output';
import { RiceScope3Output } from './scope3.output';

@SchemaDescription(
  'Intermediate emissions calculation output for the Rice calculator',
)
export class RiceIntermediateOutput {
  @IsString()
  @SchemaDescription(DESCRIPTIONS.ACTIVITY_ID)
  @IsDefined()
  id!: string;

  @ValidateNested({ always: true })
  @Type(() => RiceScope1Output)
  @IsDefined()
  scope1!: RiceScope1Output;

  @ValidateNested({ always: true })
  @Type(() => Scope2Output)
  @IsDefined()
  scope2!: Scope2Output;

  @ValidateNested({ always: true })
  @Type(() => RiceScope3Output)
  @IsDefined()
  scope3!: RiceScope3Output;

  @IsNumber()
  @SchemaDescription(OUTPUTDESCRIPTIONS.sequestration)
  @IsDefined()
  carbonSequestration!: number;

  @ValidateNested({ always: true })
  @Type(() => RiceEmissionsIntensities)
  @IsDefined()
  intensities!: RiceEmissionsIntensities;

  @ValidateNested({ always: true })
  @Type(() => NetOutput)
  @IsDefined()
  net!: NetOutput;
}
