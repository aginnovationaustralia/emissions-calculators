import {
  num,
  root,
} from '@aginnovationaustralia/emissions-calculators/internal/containers';
import { ifTrueElse } from '@aginnovationaustralia/emissions-calculators/internal/if-else';
import {
  booleanInput,
  enumInput,
  isNonNegative,
  isProportion,
  numberInput,
  nv,
} from '@aginnovationaustralia/emissions-calculators/internal/inputs';
import { ENTERIC_OTHER_3_6 } from '@aginnovationaustralia/emissions-calculators/internal/modules';
import { scope1Output } from '@aginnovationaustralia/emissions-calculators/internal/outputs';
import { sum } from '@aginnovationaustralia/emissions-calculators/internal/sum';
import { selectSwitch } from '@aginnovationaustralia/emissions-calculators/internal/switch';
import {
  head,
  mass,
  massPerHead,
  realNumber,
} from '@aginnovationaustralia/emissions-calculators/internal/units';
import { z } from 'zod';

/**
 * A mini calculator module, built from the same unit and container building blocks the real
 * calculators use. These come from the `internal/*` subpaths, which are not part of the public
 * API and may change without notice.
 *
 * Every input schema parses its raw value into an input container, which carries both the
 * value and its unit (e.g. `Head`, `MassPerHead<'CH4'>`). Arithmetic on containers is checked
 * against the units: `Head * MassPerHead<'CH4'>` gives `Mass<'CH4'>`, and the compiler rejects
 * combinations that don't balance, such as adding a `Mass<'CH4'>` to a `Head`.
 */

// The module that consumes each input. Every input has to name at least one.
const modules = [ENTERIC_OTHER_3_6] as const;

const housingTypes = ['Paddock', 'Barn', 'Feedlot'] as const;

export const MiniInputSchema = z.strictObject({
  // Numbers: `{ value, quality? }`, converted to a container of the given unit
  head: numberInput(
    head,
    { name: 'head', description: 'Number of animals', modules: [...modules] },
    isNonNegative,
  ),
  entericFactor: numberInput(
    (value) => massPerHead('CH4', value),
    {
      name: 'entericFactor',
      description: 'Enteric methane per head per year',
      modules: [...modules],
    },
    isNonNegative,
  ),
  fractionAbated: numberInput(
    realNumber,
    {
      name: 'fractionAbated',
      description: 'Fraction of enteric methane abated by a feed additive',
      modules: [...modules],
    },
    isProportion,
  ),
  // Booleans: converted to a boolean container
  isGrazing: booleanInput(
    'isGrazing',
    'Whether the animals graze, which raises enteric methane by 10%',
    [...modules],
  ),
  // Enums: converted to a string container that can drive a switch
  housing: enumInput(housingTypes, {
    name: 'housing',
    description: 'How the animals are housed',
    modules: [...modules],
  }),
});

/** Raw input, before parsing, e.g. `{ head: { value: 100 } }` */
export type MiniInput = z.input<typeof MiniInputSchema>;
/** Parsed input, where each field is a container */
export type MiniInputTransformed = z.output<typeof MiniInputSchema>;

/**
 * CH4 = Head * EF * (1 - fractionAbated) * grazing adjustment + housing CH4
 */
export const calculateMini = (input: MiniInputTransformed) => {
  const { head, entericFactor, fractionAbated, isGrazing, housing } = input;

  // Head * MassPerHead<'CH4'> = Mass<'CH4'>
  const unabated = head.multiply(entericFactor).named('unabated');

  // RealNumber - RealNumber = RealNumber, and Mass * RealNumber keeps the Mass unit
  const fractionRemaining = num(1).minus(fractionAbated).named('remaining');
  const abated = unabated.multiply(fractionRemaining).named('abated');

  // A boolean input chooses between two containers of the same unit
  const grazingAdjustment = ifTrueElse(isGrazing, num(1.1), num(1)).named(
    'grazingAdjustment',
  );
  const enteric = abated.multiply(grazingAdjustment).named('enteric');

  // An enum input selects one container per case. The cases must cover every enum value.
  const housingCH4 = selectSwitch(housing, {
    Paddock: root(mass('CH4', 0)),
    Barn: root(mass('CH4', 25)),
    Feedlot: root(mass('CH4', 60)),
  }).named('housingCH4');

  // Mass<'CH4'> + Mass<'CH4'> = Mass<'CH4'>
  const total = enteric.plus(housingCH4).named('total');

  // `sum` adds a list of containers with the same unit, and is zero when the list is empty
  const totalFromSum = sum([enteric, housingCH4]).named('totalFromSum');

  return {
    // A raw number, read straight from the container
    totalCH4Kg: total.unit.store.toNumber(),
    totalFromSumCH4Kg: totalFromSum.unit.store.toNumber(),
    // A full output, with CO2e and the inputs that fed into it
    output: scope1Output('miniCH4', total),
  };
};

export const miniInput: MiniInput = {
  head: nv(100),
  entericFactor: nv(10),
  fractionAbated: nv(0.2),
  isGrazing: true,
  housing: 'Barn',
};

/**
 * Parse the raw input into containers, then calculate.
 *
 * 100 head * 10 kg CH4 = 1,000 kg, abated by 20% = 800 kg, grazing * 1.1 = 880 kg,
 * plus 25 kg for a barn = 905 kg CH4
 */
export const calculateMiniExample = () => {
  const parsed = MiniInputSchema.safeParse(miniInput);
  if (!parsed.success) {
    console.error('Input was not valid', z.prettifyError(parsed.error));
    return undefined;
  }

  const result = calculateMini(parsed.data);
  console.log('Mini calculator CH4 (kg)', result.totalCH4Kg);
  console.log(
    'Mini calculator CO2e (kg)',
    result.output.amountKgCO2e.toNumber(),
  );
  console.log(
    'Mini calculator inputs used',
    result.output.inputs.map((i) => i.name),
  );

  return result;
};
