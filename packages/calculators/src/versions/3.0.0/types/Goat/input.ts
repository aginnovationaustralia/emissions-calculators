import { Transform, plainToClass } from 'class-transformer';
import {
  IsBoolean,
  IsDefined,
  IsEnum,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { TransformSingleOrArray } from '../../common/tools';
import { SchemaDescription, TypeWithArraySchema } from '../decorator.schema';
import { DESCRIPTIONS } from '../descriptions.schema';
import { State, States } from '../types';
import { Vegetation } from '../vegetation.input';
import { GoatComplete } from './goat.input';
import { GoatVegetation } from './vegetation.input';

const TransformNonNestedVegetation = () =>
  Transform(
    ({ value }: { value: Vegetation[] | GoatVegetation[] }) =>
      value.map((v) => {
        if ('vegetation' in v) {
          return plainToClass(GoatVegetation, v);
        }
        return plainToClass(GoatVegetation, {
          vegetation: v,
          goatProportion: 1,
        });
      }),
    {
      toClassOnly: true,
    },
  );

@SchemaDescription('Input data required for the `goat` calculator')
export class GoatInput {
  @IsEnum(States)
  @SchemaDescription(DESCRIPTIONS.STATE)
  @IsDefined()
  state!: State;

  @IsBoolean()
  @SchemaDescription(DESCRIPTIONS.RAINFALLABOVE600)
  @IsDefined()
  rainfallAbove600!: boolean;

  @ValidateNested({ always: true, each: true })
  @TypeWithArraySchema(() => GoatComplete)
  @TransformSingleOrArray(GoatComplete)
  @IsDefined()
  goats!: GoatComplete[];

  @ValidateNested({ always: true, each: true })
  @TypeWithArraySchema(() => GoatVegetation)
  @TransformNonNestedVegetation()
  @IsOptional()
  vegetation: GoatVegetation[] = [];
}
