import { Type } from 'class-transformer';
import { IsDefined, ValidateNested } from 'class-validator';
import { SchemaDescription, TypeWithArraySchema } from '../decorator.schema';
import { PurchasedOffsetsOutput } from '../purchasedOffsets.output';
import { Scope2Output } from '../scope2.output';
import { WildSeaFisheriesIntensitiesOutput } from './intensities.output';
import { WildSeaFisheriesIntermediateOutput } from './intermediate.output';
import { WildSeaFisheriesNetOutput } from './net.output';
import { WildSeaFisheriesScope1Output } from './scope1.output';
import { WildSeaFisheriesScope3Output } from './scope3.output';

@SchemaDescription(
  'Emissions calculation output for the `wildseafisheries` calculator',
)
export class WildSeaFisheriesOutput {
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

  @ValidateNested({ always: true, each: true })
  @TypeWithArraySchema(() => WildSeaFisheriesIntermediateOutput)
  @IsDefined()
  intermediate!: WildSeaFisheriesIntermediateOutput[];

  @ValidateNested({ always: true })
  @Type(() => WildSeaFisheriesNetOutput)
  @IsDefined()
  net!: WildSeaFisheriesNetOutput;

  @ValidateNested({ always: true, each: true })
  @TypeWithArraySchema(
    () => WildSeaFisheriesIntensitiesOutput,
    'Emissions intensity for each enterprise (in order), in t-CO2e/t product caught',
  )
  @IsDefined()
  intensities!: WildSeaFisheriesIntensitiesOutput[];
}
