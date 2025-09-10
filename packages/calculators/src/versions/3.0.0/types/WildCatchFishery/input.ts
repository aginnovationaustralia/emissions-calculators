import { Type } from 'class-transformer';
import { IsDefined, ValidateNested } from 'class-validator';
import 'reflect-metadata';
import { SchemaDescription, TypeWithArraySchema } from '../decorator.schema';
import { WildCatchFisheryEnterpriseInput } from './wildcatchfishery.input';

@SchemaDescription('Input data required for the `wildcatchfishery` calculator')
export class WildCatchFisheryInput {
  @ValidateNested({ always: true, each: true })
  @Type(() => WildCatchFisheryEnterpriseInput)
  @TypeWithArraySchema(() => WildCatchFisheryEnterpriseInput)
  @IsDefined()
  enterprises!: WildCatchFisheryEnterpriseInput[];
}


