import { IsDefined, IsNumber } from 'class-validator';
import { SchemaDescription } from '../decorator.schema';
import { DESCRIPTIONS } from '../descriptions.schema';

export class SolidWasteInput {
  @IsNumber()
  @SchemaDescription(DESCRIPTIONS.SOLID_WASTE_SENT_OFFSITE)
  @IsDefined()
  sentOffsiteTonnes!: number;

  @IsNumber()
  @SchemaDescription(DESCRIPTIONS.SOLID_WASTE_COMPOSTED_ONSITE)
  @IsDefined()
  onsiteCompostingTonnes!: number;
}
