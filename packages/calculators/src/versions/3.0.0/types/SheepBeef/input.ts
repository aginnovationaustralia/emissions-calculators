import {
    IsBoolean,
    IsDefined,
    IsEnum,
    IsOptional,
    ValidateNested,
} from 'class-validator';
import { TransformSingleOrArray } from '../../common/tools';
import { BeefComplete } from '../Beef/beef.input';
import { SavannahBurning } from '../Beef/savannah.input';
import { SchemaDescription, TypeWithArraySchema } from '../decorator.schema';
import { DESCRIPTIONS } from '../descriptions.schema';
import { SheepComplete } from '../Sheep/sheep.input';
import { State, States } from '../types';
import { SheepBeefVegetation } from './vegetation.input';

@SchemaDescription('Input data required for the `sheepbeef` calculator')
export class SheepBeefInput {
  @IsEnum(States)
  @SchemaDescription(DESCRIPTIONS.STATE)
  @IsDefined()
  state!: State;

  @IsBoolean()
  @SchemaDescription(DESCRIPTIONS.NORTHOFTROPIC)
  @IsDefined()
  northOfTropicOfCapricorn!: boolean;

  @IsBoolean()
  @SchemaDescription(DESCRIPTIONS.RAINFALLABOVE600)
  @IsDefined()
  rainfallAbove600!: boolean;

  @ValidateNested({ always: true, each: true })
  @TypeWithArraySchema(() => BeefComplete)
  @TransformSingleOrArray(BeefComplete)
  @IsDefined()
  beef!: BeefComplete[];

  @ValidateNested({ always: true, each: true })
  @TypeWithArraySchema(() => SheepComplete)
  @TransformSingleOrArray(SheepComplete)
  @IsDefined()
  sheep!: SheepComplete[];

  @ValidateNested({ always: true, each: true })
  @TypeWithArraySchema(() => SavannahBurning)
  @TransformSingleOrArray(SavannahBurning)
  @IsDefined()
  burning!: SavannahBurning[];

  @ValidateNested({ always: true, each: true })
  @TypeWithArraySchema(() => SheepBeefVegetation)
  @IsOptional()
  vegetation: SheepBeefVegetation[] = [];
}


