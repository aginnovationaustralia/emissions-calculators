export const defaultPrecision = 7;

export type KeyValuePairs = {
  [key: string]: string | number | number[] | KeyValuePairs | KeyValuePairs[];
};

export type Emissions = KeyValuePairs;

const executeKeyValues = (
  path: string[],
  expectation: number,
  value: number,
) => {
  return {
    path: path.join(' -> '),
    test: () => expect(value).toBeCloseTo(expectation, defaultPrecision),
  };
};

export type GeneratedTest = {
  path: string;
  test: () => void;
};

export const traverseTree = (
  generator: (
    path: string[],
    expectation: number,
    value: number,
  ) => GeneratedTest,
  expectations: KeyValuePairs,
  emissions: KeyValuePairs,
  path: string[] = [],
): GeneratedTest[] => {
  return Object.entries(expectations).flatMap(([k1, v1]) => {
    try {
      if (typeof v1 === 'number') {
        if (emissions === undefined) {
          console.log(path, k1, emissions);
        }
        return [
          generator([...path, k1], v1 as number, emissions[k1] as number),
        ];
      } else if (Array.isArray(v1)) {
        if (typeof v1[0] === 'number') {
          return (v1 as number[]).flatMap((v2, i) => {
            return generator([...path, k1], v2, (emissions[k1] as number[])[i]);
          });
        } else if (typeof v1[0] === 'object') {
          return (v1 as KeyValuePairs[]).flatMap((v2, i) => {
            return traverseTree(
              generator,
              v2,
              (emissions[k1] as KeyValuePairs[])[i],
              [...path, k1],
            );
          });
        }
      } else if (typeof v1 === 'object') {
        return traverseTree(
          generator,
          v1 as KeyValuePairs,
          emissions[k1] as KeyValuePairs,
          [...path, k1],
        );
      } else if (typeof v1 !== 'string') {
        throw new Error(`Invalid expectations ${typeof v1} for ${k1}`);
      }
    } catch (error) {
      throw new Error(
        `Error in recurseExpectations for key ${k1} at path '${path.join(
          ' -> ',
        )}': ${error}`,
      );
    }

    return [];
  });
};

export const traverseExpectations = (
  expectations: KeyValuePairs,
  emissions: KeyValuePairs,
) => {
  return traverseTree(executeKeyValues, expectations, emissions);
};

export const recurseExpectations = (
  expectations: KeyValuePairs,
  emissions: KeyValuePairs,
  path: string[] = [],
) => {
  const tests = traverseTree(executeKeyValues, expectations, emissions, path);
  tests.forEach((t) => test(`test ${t.path}`, t.test));
};

export const executeEmissionsSpec = (
  emissionsInput: object,
  expectations: Emissions,
) => {
  describe(`Emissions tests (${global.CURRENT_VERSION})`, () => {
    const emissions = emissionsInput as Emissions;

    recurseExpectations(expectations, emissions);
  });
};

// Recurse through an object making sure that every leaf value is not undefined
export const ensureEveryKeyIsDefined = (emissions: KeyValuePairs) => {
  Object.entries(emissions).forEach(([key, value]) => {
    if (typeof value === 'number') {
      test(`test ${key} is a defined number`, () => {
        expect(value).not.toBeUndefined();
        expect(value).not.toBeNaN();
        expect(value).not.toBeNull();
      });
    } else if (value !== emissions) {
      // Avoid cycling on string values
      ensureEveryKeyIsDefined(value as KeyValuePairs);
    }
  });
};
