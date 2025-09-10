import { Type } from 'class-transformer';
import { IsDefined, IsNumber, IsString, ValidateNested } from 'class-validator';
import { NetOutput } from '../common/net.output';
import { SchemaDescription } from '../decorator.schema';
import { DESCRIPTIONS, OUTPUTDESCRIPTIONS } from '../descriptions.schema';
import { PurchasedOffsetsOutput } from '../purchasedOffsets.output';
import { Scope2Output } from '../scope2.output';
import { WildSeaFisheriesIntensitiesOutput } from './intensities.output';
import { WildSeaFisheriesScope1Output } from './scope1.output';
import { WildSeaFisheriesScope3Output } from './scope3.output';

@SchemaDescription(
  'Intermediate emissions calculation output for the Wild Sea Fisheries calculator',
)
export class WildSeaFisheriesIntermediateOutput {
  @IsString()
  @SchemaDescription(DESCRIPTIONS.ACTIVITY_ID)
  @IsDefined()
  id!: string;

  @ValidateNested({ always: true })
  @Type(() => WildSeaFisheriesScope1Output)
  @IsDefined()
  scope1!: WildSeaFisheriesScope1Output;

  @ValidateNested({ always: true })
  @Type(() => Scope2Output)
  @IsDefined()
  scope2!: Scope2Output;

  @ValidateNested({ always: true })
  @Type(() => WildSeaFisheriesScope3Output)
  @IsDefined()
  scope3!: WildSeaFisheriesScope3Output;

  @ValidateNested({ always: true })
  @Type(() => PurchasedOffsetsOutput)
  @IsDefined()
  purchasedOffsets!: PurchasedOffsetsOutput;

  @IsNumber()
  @SchemaDescription(OUTPUTDESCRIPTIONS.sequestration)
  @IsDefined()
  carbonSequestration!: number;

  @ValidateNested({ always: true })
  @Type(() => WildSeaFisheriesIntensitiesOutput)
  @IsDefined()
  intensities!: WildSeaFisheriesIntensitiesOutput;

  @ValidateNested({ always: true })
  @Type(() => NetOutput)
  @IsDefined()
  net!: NetOutput;
}
