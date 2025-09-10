import { IsNumber, IsOptional } from 'class-validator';
import { SchemaDescription } from './decorator.schema';
import { DESCRIPTIONS } from './descriptions.schema';

@SchemaDescription('Supplementation for livestock')
export class MineralSupplementation {
  @IsNumber()
  @SchemaDescription('Mineral block product used, in tonnes')
  @IsOptional()
  mineralBlock: number = 0;

  @IsNumber()
  @SchemaDescription(DESCRIPTIONS.UREACONTENT)
  @IsOptional()
  mineralBlockUrea: number = 0;

  @IsNumber()
  @SchemaDescription('Weaner block product used, in tonnes')
  @IsOptional()
  weanerBlock: number = 0;

  @IsNumber()
  @SchemaDescription(DESCRIPTIONS.UREACONTENT)
  @IsOptional()
  weanerBlockUrea: number = 0;

  @IsNumber()
  @SchemaDescription('Dry season mix product used, in tonnes')
  @IsOptional()
  drySeasonMix: number = 0;

  @IsNumber()
  @SchemaDescription(DESCRIPTIONS.UREACONTENT)
  @IsOptional()
  drySeasonMixUrea: number = 0;
}
