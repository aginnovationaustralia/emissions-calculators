import { IsDefined, IsNumber, IsOptional } from 'class-validator';
import { SchemaDescription } from '../decorator.schema';
import { DESCRIPTIONS } from '../descriptions.schema';

const optionalDietInputNote =
  'Note: If no value is provided, zero will be assumed. This will result in large, negative output values. This input will become mandatory in a future version.';

export class DairySeason {
  @IsNumber()
  @SchemaDescription(DESCRIPTIONS.HEAD)
  @IsDefined()
  head!: number;

  @IsNumber()
  @SchemaDescription(DESCRIPTIONS.LIVEWEIGHT)
  @IsDefined()
  liveweight!: number;

  @IsNumber()
  @SchemaDescription(DESCRIPTIONS.LIVEWEIGHTGAIN)
  @IsDefined()
  liveweightGain!: number;

  @IsNumber()
  @IsOptional()
  @SchemaDescription(`${DESCRIPTIONS.CRUDEPROTEIN}. ${optionalDietInputNote}`)
  crudeProtein?: number;

  @IsNumber()
  @IsOptional()
  @SchemaDescription(
    `${DESCRIPTIONS.DRYMATTERDIGESTIBILITY}. ${optionalDietInputNote}`,
  )
  dryMatterDigestibility?: number;

  @IsNumber()
  @IsOptional()
  @SchemaDescription(DESCRIPTIONS.MILK_PRODUCTION)
  milkProduction?: number;
}
