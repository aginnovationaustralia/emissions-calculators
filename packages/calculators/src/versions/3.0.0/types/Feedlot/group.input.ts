import { IsDefined, ValidateNested } from 'class-validator';
import 'reflect-metadata';
import { TypeWithArraySchema } from '../decorator.schema';
import { FeedlotStay } from './stay.input';

export class FeedlotGroup {
  @ValidateNested({ always: true, each: true })
  @TypeWithArraySchema(() => FeedlotStay)
  @IsDefined()
  stays!: FeedlotStay[];
}
