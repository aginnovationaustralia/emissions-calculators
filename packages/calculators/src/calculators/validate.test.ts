import { BeefHerdInput } from '@/calculators/Beef/types/beef-herd.input';
import { BeefInputSchema } from '@/calculators/Beef/types/input';
import { createBeefInput } from '@/modules/test/factory';
import { z } from 'zod';
import { validateCalculatorInput } from './validate';

const invalidIssues = <T extends object, I extends object>(
  schema: z.ZodType<T, I>,
  input: unknown,
) => {
  const result = validateCalculatorInput(schema, input);
  if (result.valid) {
    throw new Error('Expected input to be invalid');
  }
  return result;
};

// Builds a beef input with a single herd, deep merging deliberately invalid overrides into
// the default herd.
const beefInputWithHerd = (herdOverrides: object) =>
  createBeefInput({ herds: [herdOverrides as unknown as BeefHerdInput] });

describe('validateCalculatorInput', () => {
  test('returns the parsed result for valid input', () => {
    const input = createBeefInput();
    const result = validateCalculatorInput(BeefInputSchema, input);

    expect(result.valid).toBe(true);
    if (result.valid) {
      expect(result.original).toBe(input);
      expect(result.result.herds).toHaveLength(1);
    }
  });

  test('reports a plain issue with its full path', () => {
    const input = beefInputWithHerd({ region: 'Atlantis' });

    const { issues } = invalidIssues(BeefInputSchema, input);

    expect(issues).toHaveLength(1);
    expect(issues[0]).toMatchObject({
      path: 'herds.0.region',
      pathElements: ['herds', '0', 'region'],
    });
  });

  describe('beef herd fertiliser (union inside the input)', () => {
    test('reports the field that selects the branch when it matches no branch', () => {
      const input = beefInputWithHerd({
        fertiliser: { inorganic: { calculationMethodScope1: '3' } },
      });

      const result = invalidIssues(BeefInputSchema, input);

      expect(result.issues).toEqual([
        {
          path: 'herds.0.fertiliser.inorganic.calculationMethodScope1',
          pathElements: [
            'herds',
            '0',
            'fertiliser',
            'inorganic',
            'calculationMethodScope1',
          ],
          message: 'Invalid option: expected one of "1"|"2"',
        },
      ]);
      expect(result.message).toBe(
        'herds.0.fertiliser.inorganic.calculationMethodScope1: Invalid option: expected one of "1"|"2"',
      );
    });

    test('reports the issues of the closest matching branch', () => {
      const input = beefInputWithHerd({
        fertiliser: {
          inorganic: {
            applications: [
              { calculationMethodScope3: '1', fertiliserType: 'Urea' },
            ],
          },
        },
      });

      const { issues } = invalidIssues(BeefInputSchema, input);

      expect(issues.map((x) => x.path)).toEqual([
        'herds.0.fertiliser.inorganic.applications.0.massAppliedKg',
      ]);
    });

    test('reports an invalid discriminator in a nested discriminated union', () => {
      const input = beefInputWithHerd({
        fertiliser: {
          inorganic: { applications: [{ calculationMethodScope3: '9' }] },
        },
      });

      const { issues } = invalidIssues(BeefInputSchema, input);

      expect(issues).toEqual([
        expect.objectContaining({
          path: 'herds.0.fertiliser.inorganic.applications.0.calculationMethodScope3',
          message: 'Invalid option: expected one of "1"|"2"',
        }),
      ]);
    });
  });

  describe('union flattening', () => {
    const MethodSchema = z.xor([
      z.object({ method: z.literal('a'), aValue: z.number() }),
      z.object({ method: z.literal('b'), bValue: z.number() }),
    ]);

    test('prefixes branch issue paths with the path of the union', () => {
      const schema = z.object({ outer: z.object({ inner: MethodSchema }) });

      const { issues } = invalidIssues(schema, {
        outer: { inner: { method: 'a', aValue: 'not a number' } },
      });

      expect(issues).toEqual([
        expect.objectContaining({
          path: 'outer.inner.aValue',
          pathElements: ['outer', 'inner', 'aValue'],
        }),
      ]);
    });

    test('flattens unions nested inside union branches', () => {
      const schema = z.object({
        item: z.xor([
          z.object({ kind: z.literal('one'), detail: MethodSchema }),
          z.object({ kind: z.literal('two') }),
        ]),
      });

      const { issues } = invalidIssues(schema, {
        item: { kind: 'one', detail: { method: 'b', bValue: 'nope' } },
      });

      expect(issues.map((x) => x.path)).toEqual(['item.detail.bValue']);
    });

    test('reports every branch when branches tie for closest match', () => {
      const schema = z.xor([
        z.object({ a: z.number() }),
        z.object({ b: z.number() }),
      ]);

      const { issues } = invalidIssues(schema, {});

      expect(issues.map((x) => x.path).sort()).toEqual(['a', 'b']);
    });

    test('keeps the union issue when more than one branch matches', () => {
      const schema = z.xor([
        z.object({ a: z.string() }),
        z.object({ b: z.string() }),
      ]);

      const { issues } = invalidIssues(schema, { a: 'x', b: 'y' });

      expect(issues).toEqual([
        expect.objectContaining({
          path: '',
          message: 'Invalid input: more than one option matched',
        }),
      ]);
    });
  });
});
