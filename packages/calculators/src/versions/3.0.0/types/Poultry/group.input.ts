import { Type } from 'class-transformer';
import { IsDefined, IsNumber, ValidateNested } from 'class-validator';
import { SchemaDescription, TypeWithArraySchema } from '../decorator.schema';
import { BroilerClass } from './broilerclass.input';
import { PoultryFeed } from './feed.input';

@SchemaDescription('Poultry broiler group')
export class BroilerGroup {
  @ValidateNested({ always: true })
  @Type(() => BroilerClass)
  @IsDefined()
  meatChickenGrowers!: BroilerClass;

  @ValidateNested({ always: true })
  @Type(() => BroilerClass)
  @IsDefined()
  meatChickenLayers!: BroilerClass;

  @ValidateNested({ always: true })
  @Type(() => BroilerClass)
  @IsDefined()
  meatOther!: BroilerClass;

  @ValidateNested({ always: true, each: true })
  @TypeWithArraySchema(() => PoultryFeed)
  @IsDefined()
  feed!: PoultryFeed[];

  @IsNumber()
  @SchemaDescription('Custom feed purchased, in tonnes')
  @IsDefined()
  customFeedPurchased!: number;

  @IsNumber()
  @SchemaDescription(
    'Emissions intensity of custom feed in GHG (kg CO2-e/kg input)',
  )
  @IsDefined()
  customFeedEmissionIntensity!: number;
}
