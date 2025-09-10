import {
  IsBoolean,
  IsDefined,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import 'reflect-metadata';
import { TransformCustomisedFertiliser } from '../../common/tools';
import {
  DeprecatedSchemaDescription,
  SchemaDescription,
} from '../decorator.schema';
import { DESCRIPTIONS } from '../descriptions.schema';
import {
  CustomisedFertiliser,
  CustomisedFertilisersWithLegacyKeys,
  State,
  States,
} from '../types';

export class CottonCrop {
  @IsString()
  @IsOptional()
  @SchemaDescription(DESCRIPTIONS.ACTIVITY_ID)
  id?: string;

  @IsEnum(States)
  @SchemaDescription(DESCRIPTIONS.STATE)
  @IsDefined()
  state!: State;

  @IsNumber()
  @SchemaDescription('Average cotton yield, in t/ha (tonnes per hectare)')
  @IsDefined()
  averageCottonYield!: number;

  @IsNumber()
  @SchemaDescription('Area sown, in ha (hectares)')
  @IsDefined()
  areaSown!: number;

  @IsNumber()
  @SchemaDescription('Average weight of unprocessed cotton per bale, in kg')
  @IsDefined()
  averageWeightPerBaleKg!: number;

  @IsNumber()
  @SchemaDescription('Average weight of cotton lint per bale, in kg')
  @IsDefined()
  cottonLintPerBaleKg!: number;

  @IsNumber()
  @SchemaDescription('Average weight of cotton seed produced per bale, in kg')
  @IsDefined()
  cottonSeedPerBaleKg!: number;

  @IsNumber()
  @SchemaDescription('Average weight of cotton waste produced per bale, in kg')
  @IsDefined()
  wastePerBaleKg!: number;

  // TODO!: group these fertilisers
  @IsNumber()
  @SchemaDescription(
    'Urea application, in kg Urea/ha (kilograms of urea per hectare)',
  )
  @IsDefined()
  ureaApplication!: number;

  @IsEnum(CustomisedFertilisersWithLegacyKeys)
  @IsOptional() // Until deprecated
  @DeprecatedSchemaDescription('Other N fertiliser type')
  @TransformCustomisedFertiliser()
  otherFertiliserType!: CustomisedFertiliser;

  @IsNumber()
  @SchemaDescription(
    'Other N fertiliser application, in kg/ha (kilograms per hectare)',
  )
  @IsDefined()
  otherFertiliserApplication!: number;

  @IsNumber()
  @IsOptional() // Optional while we continue to support otherFertiliserType
  @SchemaDescription(
    'Non-urea nitrogen application, in kg N/ha (kilograms of nitrogen per hectare)',
  )
  nonUreaNitrogen: number = 0;

  @IsNumber()
  @IsOptional() // Optional while we continue to support otherFertiliserType
  @SchemaDescription(
    'Urea-Ammonium nitrate application, in kg product/ha (kilograms of product per hectare)',
  )
  ureaAmmoniumNitrate: number = 0;

  @IsNumber()
  @IsOptional() // Optional while we continue to support otherFertiliserType
  @SchemaDescription(
    'Phosphorus application, in kg P/ha (kilograms of phosphorus per hectare)',
  )
  phosphorusApplication: number = 0;

  @IsNumber()
  @IsOptional() // Optional while we continue to support otherFertiliserType
  @SchemaDescription(
    'Potassium application, in kg K/ha (kilograms of potassium per hectare)',
  )
  potassiumApplication: number = 0;

  @IsNumber()
  @IsOptional() // Optional while we continue to support otherFertiliserType
  @SchemaDescription(
    'Sulfur application, in kg S/ha (kilograms of sulfur per hectare)',
  )
  sulfurApplication: number = 0;

  @IsNumber()
  @SchemaDescription(
    'Single superphosphate use, in kg/ha (kilograms per hectare)',
  )
  @IsDefined()
  singleSuperPhosphate!: number;

  @IsBoolean()
  @SchemaDescription(DESCRIPTIONS.RAINFALLIRRIGATIONABOVE600)
  @IsDefined()
  rainfallAbove600!: boolean;

  // WARNING: remove this as its always 0 for cotton
  @IsNumber()
  @IsOptional()
  @DeprecatedSchemaDescription(
    'Fraction of annual production of crop that is burnt. If included, this should only ever be 0 for cotton',
  )
  fractionOfAnnualCropBurnt: number = 0;

  @IsNumber()
  @SchemaDescription(
    'Total amount of active ingredients from general herbicide/pesticide use, in kg (kilogram)',
  )
  @IsDefined()
  herbicideUse!: number;

  @IsNumber()
  @SchemaDescription(
    'Total amount of active ingredients from other herbicide use (Paraquat, Diquat, Glyphosate), in kg (kilogram)',
  )
  @IsDefined()
  glyphosateOtherHerbicideUse!: number;

  @IsNumber()
  @SchemaDescription(
    'Percentage of electricity use to allocate to this crop, from 0 to 1',
  )
  @IsDefined()
  electricityAllocation!: number;

  @IsNumber()
  @SchemaDescription(DESCRIPTIONS.LIMESTONE)
  @IsDefined()
  limestone!: number;

  @IsNumber()
  @SchemaDescription(DESCRIPTIONS.LIMESTONEFRACTION)
  @IsDefined()
  limestoneFraction!: number;

  @IsNumber()
  @SchemaDescription(DESCRIPTIONS.DIESEL)
  @IsDefined()
  dieselUse!: number;

  @IsNumber()
  @SchemaDescription(DESCRIPTIONS.PETROL)
  @IsDefined()
  petrolUse!: number;

  @IsNumber()
  @SchemaDescription(DESCRIPTIONS.LPG)
  @IsDefined()
  lpg!: number;
}
