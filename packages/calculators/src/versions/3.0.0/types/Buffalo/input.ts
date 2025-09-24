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
import { BuffaloComplete } from './buffalo.input';
import { BuffaloVegetation } from './vegetation.input';

const TransformNonNestedVegetation = () =>
  Transform(
    ({ value }: { value: Vegetation[] | BuffaloVegetation[] }) =>
      value.map((v) => {
        if ('vegetation' in v) {
          return plainToClass(BuffaloVegetation, v);
        }
        return plainToClass(BuffaloVegetation, {
          vegetation: v,
          buffaloProportion: 1,
        });
      }),
    {
      toClassOnly: true,
    },
  );

@SchemaDescription('Input data required for the `Buffalo` calculator')
export class BuffaloInput {
  @IsEnum(States)
  @SchemaDescription(DESCRIPTIONS.STATE)
  @IsDefined()
  state!: State;

  @IsBoolean()
  @SchemaDescription(DESCRIPTIONS.RAINFALLABOVE600)
  @IsDefined()
  rainfallAbove600!: boolean;

  @ValidateNested({ always: true, each: true })
  @TypeWithArraySchema(() => BuffaloComplete)
  @TransformSingleOrArray(BuffaloComplete)
  @IsDefined()
  buffalos!: BuffaloComplete[];

  @ValidateNested({ always: true, each: true })
  @TypeWithArraySchema(() => BuffaloVegetation)
  @TransformNonNestedVegetation()
  @IsOptional()
  vegetation: BuffaloVegetation[] = [];
}
