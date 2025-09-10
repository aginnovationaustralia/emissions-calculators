import { Type } from 'class-transformer';
import { IsDefined, IsNumber, IsString, ValidateNested } from 'class-validator';
import { NetOutput } from '../common/net.output';
import { SchemaDescription } from '../decorator.schema';
import { DESCRIPTIONS, OUTPUTDESCRIPTIONS } from '../descriptions.schema';
import { Scope2Output } from '../scope2.output';
import { SugarIntensitiesOutput } from './intensities.output';
import { SugarScope1Output } from './scope1.output';
import { SugarScope3Output } from './scope3.output';

@SchemaDescription(
  'Intermediate emissions calculation output for the Sugar calculator',
)
export class SugarIntermediateOutput {
  @IsString()
  @SchemaDescription(DESCRIPTIONS.ACTIVITY_ID)
  @IsDefined()
  id!: string;

  @ValidateNested({ always: true })
  @Type(() => SugarScope1Output)
  @IsDefined()
  scope1!: SugarScope1Output;

  @ValidateNested({ always: true })
  @Type(() => Scope2Output)
  @IsDefined()
  scope2!: Scope2Output;

  @ValidateNested({ always: true })
  @Type(() => SugarScope3Output)
  @IsDefined()
  scope3!: SugarScope3Output;

  @IsNumber()
  @SchemaDescription(OUTPUTDESCRIPTIONS.sequestration)
  @IsDefined()
  carbonSequestration!: number;

  @ValidateNested({ always: true })
  @Type(() => SugarIntensitiesOutput)
  @IsDefined()
  intensities!: SugarIntensitiesOutput;

  @ValidateNested({ always: true })
  @Type(() => NetOutput)
  @IsDefined()
  net!: NetOutput;
}
