import { IsBoolean, IsDefined, IsEnum, ValidateNested } from 'class-validator';
import { TransformSingleOrArray } from '../../common/tools';
import { SchemaDescription, TypeWithArraySchema } from '../decorator.schema';
import { DESCRIPTIONS } from '../descriptions.schema';
import {
  DairyProductionSystem,
  DairyProductionSystems,
  State,
  States,
} from '../types';
import { DairyComplete } from './dairy.input';
import { DairyVegetation } from './vegetation.input';

@SchemaDescription('Input data required for the `dairy` calculator')
export class DairyInput {
  @IsEnum(States)
  @SchemaDescription(DESCRIPTIONS.STATE)
  @IsDefined()
  state!: State;

  @IsBoolean()
  @IsDefined()
  @SchemaDescription(DESCRIPTIONS.RAINFALLABOVE600)
  rainfallAbove600!: boolean;

  @IsEnum(DairyProductionSystems)
  @SchemaDescription('Production system')
  @IsDefined()
  productionSystem!: DairyProductionSystem;

  @ValidateNested({ always: true, each: true })
  @TypeWithArraySchema(() => DairyComplete)
  @TransformSingleOrArray(DairyComplete)
  @IsDefined()
  dairy!: DairyComplete[];

  @ValidateNested({ always: true, each: true })
  @TypeWithArraySchema(() => DairyVegetation)
  @IsDefined()
  vegetation!: DairyVegetation[];
}
