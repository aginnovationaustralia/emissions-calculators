import { IsDefined, IsNumber } from 'class-validator';
import { SchemaDescription } from '../decorator.schema';
import { DESCRIPTIONS } from '../descriptions.schema';

// 'Domestic, Export and Japan ox' are related to how long they stay in the
// feedlot for, this type is for each of them. 3 of them make up a group
@SchemaDescription('A class of cattle with a specific feedlot stay duration')
export class FeedlotStay {
  @IsNumber()
  @SchemaDescription(DESCRIPTIONS.HEAD)
  @IsDefined()
  livestock!: number;

  @IsNumber()
  @SchemaDescription('Average stay length in feedlot, in days')
  @IsDefined()
  stayAverageDuration!: number;

  @IsNumber()
  @SchemaDescription(DESCRIPTIONS.LIVEWEIGHT)
  @IsDefined()
  liveweight!: number;

  @IsNumber()
  @SchemaDescription(
    'Percent dry matter digestibility of the feed eaten, from 0 to 100',
  )
  @IsDefined()
  dryMatterDigestibility!: number;

  @IsNumber()
  @SchemaDescription('Percent crude protein of the whole diet, from 0 to 100')
  @IsDefined()
  crudeProtein!: number;

  @IsNumber()
  @SchemaDescription('Percent nitrogen retention of intake, from 0 to 100')
  @IsDefined()
  nitrogenRetention!: number;

  @IsNumber()
  @SchemaDescription('Daily intake of dry matter in kilograms per head per day')
  @IsDefined()
  dailyIntake!: number;

  @IsNumber()
  @SchemaDescription(
    'Percent Neutral detergent fibre (NDF) of intake, from 0 to 100',
  )
  @IsDefined()
  ndf!: number;

  @IsNumber()
  @SchemaDescription('Percent ether extract of intake, from 0 to 100')
  @IsDefined()
  etherExtract!: number;
}
