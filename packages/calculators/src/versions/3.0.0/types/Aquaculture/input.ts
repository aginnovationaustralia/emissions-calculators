import { Type } from 'class-transformer';
import { IsDefined, ValidateNested } from 'class-validator';
import 'reflect-metadata';
import { SchemaDescription } from '../decorator.schema';
import { AquacultureEnterpriseInput } from './aquaculture.input';

@SchemaDescription('Input data required for the `aquaculture` calculator')
export class AquacultureInput {
  @ValidateNested({ always: true, each: true })
  @Type(() => AquacultureEnterpriseInput)
  @IsDefined()
  enterprises!: AquacultureEnterpriseInput[];
}
