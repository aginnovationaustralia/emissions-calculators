import {
  IsDefined,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import 'reflect-metadata';
import { SchemaDescription, TypeWithArraySchema } from '../decorator.schema';
import { DESCRIPTIONS } from '../descriptions.schema';
import { ElectricitySource, ElectricitySources, State, States } from '../types';
import { WildSeaFisheriesBaitPurchase } from './baitpurchase.input';
import { WildSeaFisheriesCommercialFlight } from './commercialflight.input';
import { WildSeaFisheriesCustomBaitPurchase } from './custombaitpurchase.input';
import { WildSeaFisheriesRefrigerant } from './refrigerant.input';
import { WildSeaFisheriesTransport } from './transport.input';

export class WildSeaFisheriesEnterprise {
  @IsString()
  @IsOptional()
  @SchemaDescription(DESCRIPTIONS.ACTIVITY_ID)
  id?: string;

  @IsEnum(States)
  @SchemaDescription(DESCRIPTIONS.STATE)
  @IsDefined()
  state!: State;

  @IsEnum(ElectricitySources)
  @SchemaDescription(DESCRIPTIONS.ELECTRICITY_SOURCE)
  @IsDefined()
  electricitySource!: ElectricitySource;

  @IsNumber()
  @Min(0)
  @Max(1)
  @SchemaDescription(DESCRIPTIONS.ELECTRICITY_RENEWABLE)
  @IsDefined()
  electricityRenewable!: number;

  @IsNumber()
  @SchemaDescription(DESCRIPTIONS.ELECTRICITY_USE)
  @IsDefined()
  electricityUse!: number;

  @IsNumber()
  @SchemaDescription('Total whole weight caught in kg')
  @IsDefined()
  totalWholeWeightCaught!: number;

  @IsNumber()
  @SchemaDescription(DESCRIPTIONS.DIESEL)
  @IsDefined()
  diesel!: number;

  @IsNumber()
  @SchemaDescription(DESCRIPTIONS.PETROL)
  @IsDefined()
  petrol!: number;

  @IsNumber()
  @SchemaDescription(DESCRIPTIONS.LPG)
  @IsDefined()
  lpg!: number;

  @TypeWithArraySchema(() => WildSeaFisheriesRefrigerant)
  @ValidateNested({ always: true, each: true })
  @IsDefined()
  refrigerants!: WildSeaFisheriesRefrigerant[];

  @ValidateNested({ always: true, each: true })
  @TypeWithArraySchema(() => WildSeaFisheriesTransport, 'Transportation')
  @IsDefined()
  transports!: WildSeaFisheriesTransport[];

  @ValidateNested({ always: true, each: true })
  @TypeWithArraySchema(
    () => WildSeaFisheriesCommercialFlight,
    'CommercialFlight',
  )
  @IsDefined()
  flights!: WildSeaFisheriesCommercialFlight[];

  @ValidateNested({ always: true, each: true })
  @TypeWithArraySchema(() => WildSeaFisheriesBaitPurchase, 'Bait')
  @IsDefined()
  bait!: WildSeaFisheriesBaitPurchase[];

  @ValidateNested({ always: true, each: true })
  @TypeWithArraySchema(() => WildSeaFisheriesCustomBaitPurchase, 'Custom bait')
  @IsDefined()
  custombait!: WildSeaFisheriesCustomBaitPurchase[];

  @IsNumber()
  @SchemaDescription(
    'Carbon offsets purchased, in t CO2. Offsetting 2 t CO2 would be 2.0 (not -2.0)',
  )
  @IsDefined()
  carbonOffset!: number;
}
