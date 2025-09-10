import { IsDefined, IsNumber, IsOptional } from 'class-validator';
import { SchemaDescription } from '../decorator.schema';

@SchemaDescription('Broiler class with seasonal data')
export class BroilerClass {
  @IsNumber()
  @SchemaDescription('Total number of birds/head')
  @IsDefined()
  birds!: number;

  @IsNumber()
  @SchemaDescription(
    'Average length of stay until 50% of the flock is depleted, in days',
  )
  @IsDefined()
  averageStayLength50!: number;

  @IsNumber()
  @SchemaDescription(
    'Average liveweight during the 50% depletion period, in kg',
  )
  @IsDefined()
  liveweight50!: number;

  @IsNumber()
  @SchemaDescription(
    'Average length of stay until 100% of the flock is depleted, in days',
  )
  @IsDefined()
  averageStayLength100!: number;

  @IsNumber()
  @SchemaDescription(
    'Average liveweight during the 100% depletion period, in kg',
  )
  @IsDefined()
  liveweight100!: number;

  @IsNumber()
  @IsOptional()
  @SchemaDescription('Dry matter intake, in kg/head/day')
  dryMatterIntake?: number;

  @IsNumber()
  @IsOptional()
  @SchemaDescription('Dry matter digestibility fraction, from 0 to 1')
  dryMatterDigestibility?: number;

  @IsNumber()
  @IsOptional()
  @SchemaDescription('Crude protein fraction, from 0 to 1')
  crudeProtein?: number;

  @IsNumber()
  @IsOptional()
  @SchemaDescription('Manure ash fraction, from 0 to 1')
  manureAsh?: number;

  @IsNumber()
  @IsOptional()
  @SchemaDescription('Nitrogen retention rate fraction, from 0 to 1')
  nitrogenRetentionRate?: number;
}
