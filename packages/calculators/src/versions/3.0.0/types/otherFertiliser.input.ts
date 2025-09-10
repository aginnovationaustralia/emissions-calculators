import { IsDefined, IsEnum, IsNumber } from 'class-validator';
import { TransformCustomisedFertiliser } from '../common/tools/transform';
import { SchemaDescription } from './decorator.schema';
import {
  CustomisedFertiliser,
  CustomisedFertilisersWithLegacyKeys,
} from './types';

@SchemaDescription(
  'Other fertiliser, of a specific type, used for different applications (such as dryland pasture)',
)
export class OtherFertiliser {
  @IsEnum(CustomisedFertilisersWithLegacyKeys)
  @SchemaDescription('Other N fertiliser type')
  @TransformCustomisedFertiliser()
  @IsDefined()
  otherType!: CustomisedFertiliser;

  @IsNumber()
  @SchemaDescription(
    'Other N fertiliser used for dryland. From v1.1.0, supply tonnes of product. For earlier versions, supply tonnes of N',
  )
  @IsDefined()
  otherDryland!: number;

  @IsNumber()
  @SchemaDescription(
    'Other N fertiliser used for irrigated. From v1.1.0, supply tonnes of product. For earlier versions, supply tonnes of N',
  )
  @IsDefined()
  otherIrrigated!: number;
}
