import { Type } from 'class-transformer';
import { IsDefined, ValidateNested } from 'class-validator';
import { LivestockManureSeason } from './livestockManureSeason.input';

export class LivestockManure {
  @ValidateNested({ always: true })
  @IsDefined()
  @Type(() => LivestockManureSeason)
  spring!: LivestockManureSeason;

  @ValidateNested({ always: true })
  @IsDefined()
  @Type(() => LivestockManureSeason)
  summer!: LivestockManureSeason;

  @ValidateNested({ always: true })
  @IsDefined()
  @Type(() => LivestockManureSeason)
  autumn!: LivestockManureSeason;

  @ValidateNested({ always: true })
  @IsDefined()
  @Type(() => LivestockManureSeason)
  winter!: LivestockManureSeason;
}
