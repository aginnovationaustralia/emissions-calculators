export type ValidationErrorResult = {
  /**
   * The path to the property that failed validation.
   */
  path: string;

  /**
   * Message explaining why the validation failed.
   */
  message: string;

  /**
   * Property key name.
   */
  property: string;

  /**
   * Name of constraint.
   */
  constraint: string;

  /**
   * Input/current value.
   */
  value: unknown;
};

export class InputValidationError extends Error {
  public errors: ValidationErrorResult[];

  constructor(...errors: ValidationErrorResult[]) {
    super(errors.map((x) => x.message).join(', '));
    Object.setPrototypeOf(this, InputValidationError.prototype);

    this.errors = errors;
  }
}
