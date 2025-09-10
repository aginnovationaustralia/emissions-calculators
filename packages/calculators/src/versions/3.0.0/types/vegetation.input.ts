import { IsDefined, IsEnum, IsNumber } from 'class-validator';
import { SchemaDescription } from './decorator.schema';
import {
  RainfallRegion,
  RainfallRegions,
  SoilType,
  SoilTypes,
  TreeType,
  TreeTypes,
} from './types';

// Note: this is the `Data input - vegetation` tab in the spreadsheets
@SchemaDescription(
  'Inputs required for non-productive vegetation in order to calculate carbon sequestration',
)
export class Vegetation {
  @IsEnum(RainfallRegions)
  @SchemaDescription('The rainfall region that the vegetation is in')
  @IsDefined()
  region!: RainfallRegion;

  @IsEnum(TreeTypes)
  @SchemaDescription('The species of tree')
  @IsDefined()
  treeSpecies!: TreeType;

  @IsEnum(SoilTypes)
  @SchemaDescription('The soil type the tree is in')
  @IsDefined()
  soil!: SoilType;

  @IsNumber()
  @SchemaDescription('The area of trees, in ha (hectares)')
  @IsDefined()
  area!: number;

  @IsNumber()
  @SchemaDescription('The age of the trees, in years')
  @IsDefined()
  age!: number;
}
