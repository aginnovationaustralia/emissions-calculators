import { IsDefined, IsNumber } from 'class-validator';
import { SchemaDescription } from '../decorator.schema';

@SchemaDescription('Net emissions for feedlot')
export class FeedlotNetOutput {
  @IsNumber()
  @IsDefined()
  total!: number;
}
