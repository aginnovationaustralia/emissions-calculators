const DEFAULT_MARGIN = 0.75;

export type ToBeWithinRatioOfOptions = {
  margin?: number;
  keys?: string[];
  actualKey?: string;
  expectedKey?: string;
};

type NumericRecord = Record<string, number>;

function resolveKeys(
  received: NumericRecord,
  expected: NumericRecord,
  keys?: string[],
): string[] {
  if (keys) {
    return keys;
  }

  return Object.keys(expected).filter(
    (key) =>
      typeof expected[key] === 'number' && typeof received[key] === 'number',
  );
}

function isWithinRatio(
  actual: number,
  expected: number,
  margin: number,
): boolean {
  if (expected === 0) {
    return actual === 0;
  }

  return actual >= expected * margin && actual <= expected * (1 / margin);
}

function formatAllowedRange(expected: number, margin: number): string {
  if (expected === 0) {
    return '0';
  }

  const min = expected * margin;
  const max = expected * (1 / margin);
  return `${min}-${max}`;
}

export function toBeWithinRatioOf(
  received: NumericRecord,
  expected: NumericRecord,
  options: ToBeWithinRatioOfOptions = {},
) {
  const margin = options.margin ?? DEFAULT_MARGIN;
  const keys = resolveKeys(received, expected, options.keys);
  const failures: string[] = [];

  for (const key of keys) {
    const actual = received[key];
    const exp = expected[key];

    if (typeof actual !== 'number' || typeof exp !== 'number') {
      failures.push(
        `${key}: actual ${String(actual)}, expected ${String(exp)} (values must be numbers)`,
      );
      continue;
    }

    if (!isWithinRatio(actual, exp, margin)) {
      failures.push(
        `${key}: actual ${actual}, expected ${exp} (allowed range ${formatAllowedRange(exp, margin)})`,
      );
    }
  }

  const pass = failures.length === 0;

  return {
    pass,
    message: () =>
      pass
        ? `Expected objects not to be within a ${margin} ratio of each other`
        : `Expected objects to be within a ${margin} ratio of each other:\n${failures.join('\n')}\nexpectedKey: ${options.expectedKey}\nactualKey: ${options.actualKey}`,
  };
}

expect.extend({
  toBeWithinRatioOf,
});

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace jest {
    interface Matchers<R> {
      toBeWithinRatioOf(
        expected: NumericRecord,
        options?: ToBeWithinRatioOfOptions,
      ): R;
    }
  }
}

export {};
