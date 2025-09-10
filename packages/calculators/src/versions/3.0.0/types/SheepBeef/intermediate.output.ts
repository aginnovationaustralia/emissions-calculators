import { Type } from 'class-transformer';
import { IsDefined, ValidateNested } from 'class-validator';
import { SchemaDescription } from '../decorator.schema';
import { BeefSummaryOutput } from './beef-summary.output';
import { SheepSummaryOutput } from './sheep-summary.output';

@SchemaDescription(
  'Intermediate emission output breakdown just for sheep and beef livestock. These combine to make up the total emission output for each scope',
)
export class SheepBeefIntermediateOutput {
  @ValidateNested({ always: true })
  @Type(() => BeefSummaryOutput)
  @SchemaDescription('Emission output breakdown just for beef livestock')
  @IsDefined()
  beef!: BeefSummaryOutput;

  @ValidateNested({ always: true })
  @Type(() => SheepSummaryOutput)
  @SchemaDescription('Emission output breakdown just for sheep livestock')
  @IsDefined()
  sheep!: SheepSummaryOutput;
}
