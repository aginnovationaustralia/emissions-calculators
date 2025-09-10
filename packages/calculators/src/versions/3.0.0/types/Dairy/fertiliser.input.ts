import { IsDefined, IsNumber } from 'class-validator';
import { SchemaDescription } from '../decorator.schema';

@SchemaDescription('Nitrogen fertiliser application, each value is in kg N/ha')
export class NitrogenFertiliser {
  @IsNumber()
  @IsDefined()
  cropsIrrigated!: number;

  @IsNumber()
  @IsDefined()
  cropsDryland!: number;

  @IsNumber()
  @IsDefined()
  pastureIrrigated!: number;

  @IsNumber()
  @IsDefined()
  pastureDryland!: number;
}
