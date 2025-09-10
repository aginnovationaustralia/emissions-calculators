import { Transform, plainToClass } from 'class-transformer';
import {
  IsBoolean,
  IsDefined,
  IsEnum,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { validationMetadatasToSchemas } from 'class-validator-jsonschema';
import { SchemaObject } from 'openapi3-ts';
import { TransformSingleOrArray } from '../../common/tools';
import { SchemaDescription, TypeWithArraySchema } from '../decorator.schema';
import { DESCRIPTIONS } from '../descriptions.schema';
import { State, States } from '../types';
import { Vegetation } from '../vegetation.input';
import { DeerComplete } from './deer.input';
import { DeerVegetation } from './vegetation.input';

const TransformNonNestedVegetation = () =>
  Transform(
    ({ value }: { value: Vegetation[] | DeerVegetation[] }) =>
      value.map((v) => {
        if ('vegetation' in v) {
          return plainToClass(DeerVegetation, v);
        }
        return plainToClass(DeerVegetation, {
          vegetation: v,
          deerProportion: 1,
        });
      }),
    {
      toClassOnly: true,
    },
  );

@SchemaDescription('Input data required for the `deer` calculator')
export class DeerInput {
  @IsEnum(States)
  @SchemaDescription(DESCRIPTIONS.STATE)
  @IsDefined()
  state!: State;

  @IsBoolean()
  @SchemaDescription(DESCRIPTIONS.RAINFALLABOVE600)
  @IsDefined()
  rainfallAbove600!: boolean;

  @ValidateNested({ always: true, each: true })
  @TypeWithArraySchema(() => DeerComplete)
  @TransformSingleOrArray(DeerComplete)
  @IsDefined()
  deers!: DeerComplete[];

  @ValidateNested({ always: true, each: true })
  @TypeWithArraySchema(() => DeerVegetation)
  @TransformNonNestedVegetation()
  @IsOptional()
  vegetation: DeerVegetation[] = [];
}

const schema: Record<string, SchemaObject> = validationMetadatasToSchemas();
export { schema };
