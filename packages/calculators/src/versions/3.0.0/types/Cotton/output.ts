import { Type } from 'class-transformer';
import { IsDefined, ValidateNested } from 'class-validator';
import { SchemaDescription, TypeWithArraySchema } from '../decorator.schema';
import { Scope2Output } from '../scope2.output';
import { SequestrationOutput } from '../sequestration.output';
import { CottonIntensitiesOutput } from './intensities.output';
import { CottonIntermediateOutput } from './intermediate.output';
import { CottonNetOutput } from './net.output';
import { CottonScope1Output } from './scope1.output';
import { CottonScope3Output } from './scope3.output';

@SchemaDescription('Emissions calculation output for the `cotton` calculator')
export class CottonOutput {
  @ValidateNested({ always: true })
  @Type(() => CottonScope1Output)
  @IsDefined()
  scope1!: CottonScope1Output;

  @ValidateNested({ always: true })
  @Type(() => Scope2Output)
  @IsDefined()
  scope2!: Scope2Output;

  @ValidateNested({ always: true })
  @Type(() => CottonScope3Output)
  @IsDefined()
  scope3!: CottonScope3Output;

  @ValidateNested({ always: true })
  @Type(() => SequestrationOutput)
  @IsDefined()
  carbonSequestration!: SequestrationOutput;

  @ValidateNested({ always: true, each: true })
  @TypeWithArraySchema(() => CottonIntermediateOutput)
  @IsDefined()
  intermediate!: CottonIntermediateOutput[];

  @ValidateNested({ always: true })
  @Type(() => CottonNetOutput)
  @IsDefined()
  net!: CottonNetOutput;

  @ValidateNested({ always: true, each: true })
  @TypeWithArraySchema(
    () => CottonIntensitiesOutput,
    'Emissions intensity for each crop (in order)',
  )
  @IsDefined()
  intensities!: CottonIntensitiesOutput[];
}


