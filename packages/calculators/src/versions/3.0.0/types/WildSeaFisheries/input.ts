import { IsDefined, ValidateNested } from 'class-validator';
import 'reflect-metadata';
import { SchemaDescription, TypeWithArraySchema } from '../decorator.schema';
import { WildSeaFisheriesEnterprise } from './enterprise.input';

@SchemaDescription('Input data required for the `wildseafisheries` calculator')
export class WildSeaFisheriesInput {
  @ValidateNested({ always: true, each: true })
  @TypeWithArraySchema(() => WildSeaFisheriesEnterprise)
  @IsDefined()
  enterprises!: WildSeaFisheriesEnterprise[];
}

