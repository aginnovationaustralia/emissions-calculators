import { IsDefined, IsEnum, IsNumber } from 'class-validator';
import { SchemaDescription } from '../decorator.schema';
import { DESCRIPTIONS } from '../descriptions.schema';
import { FluidWasteTreatmentType } from '../types';

export class FluidWasteInput {
  @IsNumber()
  @SchemaDescription(DESCRIPTIONS.FLUID_WASTE)
  @IsDefined()
  fluidWasteKl!: number;

  @IsEnum(FluidWasteTreatmentType)
  @SchemaDescription(DESCRIPTIONS.FLUID_WASTE_TREATMENT_TYPE)
  @IsDefined()
  fluidWasteTreatmentType!: FluidWasteTreatmentType;

  @IsNumber()
  @SchemaDescription(DESCRIPTIONS.AVERAGE_INLET_COD)
  @IsDefined()
  averageInletCOD!: number;

  @IsNumber()
  @SchemaDescription(DESCRIPTIONS.AVERAGE_OUTLET_COD)
  @IsDefined()
  averageOutletCOD!: number;

  @IsNumber()
  @SchemaDescription(DESCRIPTIONS.FLARED_COMBUSTED_FRACTION)
  @IsDefined()
  flaredCombustedFraction!: number;
}
