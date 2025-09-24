import { IsBoolean, IsDefined, IsEnum, ValidateNested } from 'class-validator';
import { TransformSingleOrArray } from '../../common/tools';
import { AllocatedVegetation } from '../allocated-vegetation.input';
import {
  DeprecatedSchemaDescription,
  SchemaDescription,
  TypeWithArraySchema,
} from '../decorator.schema';
import { DESCRIPTIONS } from '../descriptions.schema';
import { State, States } from '../types';
import { PorkComplete } from './pork.input';

@SchemaDescription('Input data required for the `pork` calculator')
export class PorkInput {
  @IsEnum(States)
  @SchemaDescription(DESCRIPTIONS.STATE)
  @IsDefined()
  state!: State;

  @IsBoolean()
  @DeprecatedSchemaDescription(DESCRIPTIONS.NORTHOFTROPIC)
  @IsDefined()
  northOfTropicOfCapricorn!: boolean;

  @IsBoolean()
  @SchemaDescription(DESCRIPTIONS.RAINFALLABOVE600)
  @IsDefined()
  rainfallAbove600!: boolean;

  @ValidateNested({ always: true, each: true })
  @TypeWithArraySchema(() => PorkComplete)
  @TransformSingleOrArray(PorkComplete)
  @IsDefined()
  pork!: PorkComplete[];

  @ValidateNested({ always: true, each: true })
  @TypeWithArraySchema(() => AllocatedVegetation)
  @IsDefined()
  vegetation!: AllocatedVegetation[];
}
