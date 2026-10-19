import { core, ZodType } from 'zod';

export type ValidationIssue = {
  /**
   * The path to the property that failed validation.
   */
  path: string;

  /**
   * The path to the property that failed validation, as an array of elements.
   */
  pathElements: string[];

  /**
   * Message explaining why the validation failed.
   */
  message: string;
};

export type ValidationResult<T extends object, O extends object> =
  | {
      valid: true;
      original: O;
      result: T;
    }
  | {
      valid: false;
      issues: ValidationIssue[];
      message: string;
    };

type PathElement = PropertyKey;

type FlatIssue = {
  path: PathElement[];
  message: string;
  /** The values that would have been accepted, when the issue is a value mismatch */
  expectedValues?: unknown[];
};

const pathKey = (path: PathElement[]) => path.map(String).join('.');

const formatExpected = (values: unknown[]) =>
  values.length === 1
    ? `Invalid input: expected ${JSON.stringify(values[0])}`
    : `Invalid option: expected one of ${values.map((v) => JSON.stringify(v)).join('|')}`;

/**
 * Picks the issues to report for a union where every branch failed. Each branch's issues
 * have already been flattened.
 */
function selectUnionIssues(branches: FlatIssue[][]): FlatIssue[] {
  // A field with a value mismatch in every branch is what selects the branch (e.g.
  // calculationMethodScope1), and it matched none of them. Report only that field, with
  // the expected values of all branches, as the other issues are only noise until it's
  // fixed.
  const [first, ...rest] = branches;
  const selectorIssues = first
    .filter((issue) => issue.expectedValues)
    .flatMap((issue) => {
      const key = pathKey(issue.path);
      const matches = rest.map((branch) =>
        branch.find((x) => x.expectedValues && pathKey(x.path) === key),
      );
      if (matches.some((x) => !x)) {
        return [];
      }
      const expectedValues = [
        ...new Set([issue, ...matches].flatMap((x) => x?.expectedValues ?? [])),
      ];
      return [
        {
          path: issue.path,
          expectedValues,
          message: formatExpected(expectedValues),
        },
      ];
    });
  if (selectorIssues.length > 0) {
    return selectorIssues;
  }

  // Otherwise report the closest matching branch. A value mismatch (like a literal method
  // or type field) is a strong sign the branch wasn't the intended one, so rank by those
  // first, then by the number of issues. Report every branch that ties for closest, as
  // there's no way to tell which was intended.
  const rank = (branch: FlatIssue[]) =>
    branch.filter((x) => x.expectedValues).length * 1000 + branch.length;
  const best = Math.min(...branches.map(rank));
  const seen = new Set<string>();
  return branches
    .filter((x) => rank(x) === best)
    .flat()
    .filter((issue) => {
      const key = `${pathKey(issue.path)}:${issue.message}`;
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
}

/**
 * Flattens zod issues so that the issues nested inside unions are reported with their full
 * path, rather than a single 'Invalid input' issue on the union itself.
 */
function flattenIssues(
  issues: core.$ZodIssue[],
  parentPath: PathElement[] = [],
): FlatIssue[] {
  return issues.flatMap((issue): FlatIssue[] => {
    const path = [...parentPath, ...issue.path];

    switch (issue.code) {
      case 'invalid_union':
        if (issue.errors.length > 0) {
          return selectUnionIssues(
            issue.errors.map((branch) => flattenIssues(branch, path)),
          );
        }
        // A discriminated union whose discriminator matched no option
        if ('options' in issue && Array.isArray(issue.options)) {
          return [
            {
              path,
              expectedValues: issue.options,
              message: formatExpected(issue.options),
            },
          ];
        }
        return [{ path, message: issue.message }];
      case 'invalid_key':
      case 'invalid_element':
        return flattenIssues(issue.issues, path);
      case 'invalid_value':
        return [{ path, expectedValues: issue.values, message: issue.message }];
      default:
        return [{ path, message: issue.message }];
    }
  });
}

export function validateCalculatorInput<T extends object, I extends object>(
  schema: ZodType<T, I>,
  input: unknown,
): ValidationResult<T, I> {
  const parseResult = schema.safeParse(input);

  if (parseResult.success) {
    return {
      valid: true,
      original: input as I,
      result: parseResult.data,
    };
  } else {
    const issues = flattenIssues(parseResult.error.issues).map((x) => ({
      path: pathKey(x.path),
      pathElements: x.path.map(String),
      message: x.message,
    }));
    return {
      valid: false,
      issues,
      message: issues.map((x) => `${x.path}: ${x.message}`).join(', '),
    };
  }
}
