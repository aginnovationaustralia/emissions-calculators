import { plainToClass, Transform } from 'class-transformer';
import {
  IsBoolean,
  IsDefined,
  IsEnum,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { singleToArray, TransformSingleOrArray } from '../../common/tools';
import { SchemaDescription, TypeWithArraySchema } from '../decorator.schema';
import { DESCRIPTIONS } from '../descriptions.schema';
import { State, States } from '../types';
import { BeefComplete } from './beef.input';
import { BeefSavannahBurning } from './beefsavannah.input';
import { SavannahBurning } from './savannah.input';
import { BeefVegetation } from './vegetation.input';

const TransformNonNestedBurning = () =>
  Transform(
    ({ value }: { value: SavannahBurning[] | BeefSavannahBurning[] }) => {
      const res = singleToArray(
        value.map((v) => {
          if ('burning' in v) {
            return plainToClass(BeefSavannahBurning, v);
          }
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          const { allocationToBeef: _, ...withoutAllocation } = v;
          return plainToClass(BeefSavannahBurning, {
            burning: withoutAllocation,
            allocationToBeef: 1,
          });
        }),
        BeefSavannahBurning,
      );

      return res;
    },
    {
      toClassOnly: true,
    },
  );

@SchemaDescription('Input data required for the `beef` calculator')
export class BeefInput {
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
  @TypeWithArraySchema(() => BeefSavannahBurning)
  @TransformNonNestedBurning()
  @IsDefined()
  burning!: BeefSavannahBurning[];

  @ValidateNested({ always: true, each: true })
  @TypeWithArraySchema(() => BeefVegetation)
  @IsOptional()
  vegetation: BeefVegetation[] = [];
}
