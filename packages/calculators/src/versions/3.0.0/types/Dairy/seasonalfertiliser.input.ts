import { Type } from 'class-transformer';
import { IsDefined, ValidateNested } from 'class-validator';
import { SchemaDescription } from '../decorator.schema';
import { NitrogenFertiliser } from './fertiliser.input';

@SchemaDescription('Seasonal nitrogen fertiliser use')
export class SeasonalFertiliser {
  @ValidateNested({ always: true })
  @Type(() => NitrogenFertiliser)
  @IsDefined()
  autumn!: NitrogenFertiliser;

  @ValidateNested({ always: true })
  @Type(() => NitrogenFertiliser)
  @IsDefined()
  winter!: NitrogenFertiliser;

  @ValidateNested({ always: true })
  @Type(() => NitrogenFertiliser)
  @IsDefined()
  spring!: NitrogenFertiliser;

  @ValidateNested({ always: true })
  @Type(() => NitrogenFertiliser)
  @IsDefined()
  summer!: NitrogenFertiliser;
}
