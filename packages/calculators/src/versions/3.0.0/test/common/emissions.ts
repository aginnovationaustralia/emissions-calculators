export const defaultPrecision = 7;

export type KeyValuePairs = {
  [key: string]: number | number[] | KeyValuePairs | KeyValuePairs[];
};

export type Emissions = KeyValuePairs;

const executeKeyValues = (
  path: string[],
  expectation: number,
  value: number,
) => {
  test(`test ${path.join(' -> ')}`, () => {
    expect(value).toBeCloseTo(expectation, defaultPrecision);
  });
};

const recurseExpectations = (
  expectations: KeyValuePairs,
  emissions: KeyValuePairs,
  path: string[] = [],
) => {
  Object.entries(expectations).forEach(([k1, v1]) => {
    try {
      if (typeof v1 === 'number') {
        if (emissions === undefined) {
          console.log(path, k1, emissions);
        }
        executeKeyValues([...path, k1], v1 as number, emissions[k1] as number);
      } else if (Array.isArray(v1)) {
        if (typeof v1[0] === 'number') {
          (v1 as number[]).forEach((v2, i) => {
            executeKeyValues([...path, k1], v2, (emissions[k1] as number[])[i]);
          });
        } else if (typeof v1[0] === 'object') {
          (v1 as KeyValuePairs[]).forEach((v2, i) => {
            recurseExpectations(v2, (emissions[k1] as KeyValuePairs[])[i], [
              ...path,
              k1,
            ]);
          });
        }
      } else if (typeof v1 === 'object') {
        recurseExpectations(
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
  });
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
