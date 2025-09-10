import {
  IsDefined,
  IsEnum,
  IsNumber,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { TransformCustomisedFertiliser } from '../common/tools';
import {
  DeprecatedSchemaDescription,
  SchemaDescription,
  TypeWithArraySchema,
} from './decorator.schema';
import { OtherFertiliser } from './otherFertiliser.input';
import {
  CustomisedFertiliser,
  CustomisedFertilisersWithLegacyKeys,
} from './types';

@SchemaDescription(
  'Fertiliser used for different applications (such as dryland pasture)',
)
export class Fertiliser {
  @IsNumber()
  @SchemaDescription('Single superphosphate usage in tonnes')
  @IsDefined()
  singleSuperphosphate!: number;

  @IsOptional()
  @IsEnum(CustomisedFertilisersWithLegacyKeys)
  @DeprecatedSchemaDescription(
    'Other N fertiliser type',
    'Use `otherFertilisers` instead',
  )
  @TransformCustomisedFertiliser()
  otherType?: CustomisedFertiliser;

  @IsNumber()
  @SchemaDescription('Urea fertiliser used for dryland pasture, in tonnes Urea')
  @IsDefined()
  pastureDryland!: number;

  @IsNumber()
  @SchemaDescription(
    'Urea fertiliser used for irrigated pasture, in tonnes Urea',
  )
  @IsDefined()
  pastureIrrigated!: number;

  @IsNumber()
  @SchemaDescription('Urea fertiliser used for dryland crops, in tonnes Urea')
  @IsDefined()
  cropsDryland!: number;

  @IsNumber()
  @SchemaDescription('Urea fertiliser used for irrigated crops, in tonnes Urea')
  @IsDefined()
  cropsIrrigated!: number;

  @IsOptional()
  @IsNumber()
  @DeprecatedSchemaDescription(
    'Other N fertiliser used for dryland, in tonnes N',
    'Use `otherFertilisers` instead',
  )
  otherDryland?: number;

  @IsOptional()
  @IsNumber()
  @DeprecatedSchemaDescription(
    'Other N fertiliser used for irrigated, in tonnes N',
    'Use `otherFertilisers` instead',
  )
  otherIrrigated?: number;

  @IsOptional()
  @ValidateNested({ always: true, each: true })
  @TypeWithArraySchema(
    () => OtherFertiliser,
    'Array of Other N fertiliser. Version note: If this field is set and has a length > 0, the `other` fields within this object are ignored, and this array is used instead',
  )
  otherFertilisers?: OtherFertiliser[];
}
