import { Type } from 'class-transformer';
import { IsDefined, ValidateNested } from 'class-validator';
import { validationMetadatasToSchemas } from 'class-validator-jsonschema';
import { SchemaObject } from 'openapi3-ts';
import { SchemaDescription, TypeWithArraySchema } from '../decorator.schema';
import { Scope2Output } from '../scope2.output';
import { SequestrationOutput } from '../sequestration.output';
import { VineyardIntensitiesOutput } from './intensities.output';
import { VineyardIntermediateOutput } from './intermediate.output';
import { VineyardNetOutput } from './net.output';
import { VineyardScope1Output } from './scope1.output';
import { VineyardScope3Output } from './scope3.output';

@SchemaDescription('Emissions calculation output for the `vineyard` calculator')
export class VineyardOutput {
  @ValidateNested({ always: true })
  @Type(() => VineyardScope1Output)
  @IsDefined()
  scope1!: VineyardScope1Output;

  @ValidateNested({ always: true })
  @Type(() => Scope2Output)
  @IsDefined()
  scope2!: Scope2Output;

  @ValidateNested({ always: true })
  @Type(() => VineyardScope3Output)
  @IsDefined()
  scope3!: VineyardScope3Output;

  @ValidateNested({ always: true })
  @Type(() => SequestrationOutput)
  @IsDefined()
  carbonSequestration!: SequestrationOutput;

  @ValidateNested({ always: true, each: true })
  @TypeWithArraySchema(() => VineyardIntermediateOutput)
  @IsDefined()
  intermediate!: VineyardIntermediateOutput[];

  @ValidateNested({ always: true })
  @Type(() => VineyardNetOutput)
  @IsDefined()
  net!: VineyardNetOutput;

  @ValidateNested({ always: true, each: true })
  @TypeWithArraySchema(() => VineyardIntensitiesOutput)
  @SchemaDescription(
    'Emissions intensity for each vineyard (in order), in t-CO2e/t yield',
  )
  @IsDefined()
  intensities!: VineyardIntensitiesOutput[];
}

const schema: Record<string, SchemaObject> = validationMetadatasToSchemas();

export { schema };
