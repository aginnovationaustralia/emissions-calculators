import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

/**
 * Validator which validates the current property, as well as any others must
 * sum to a specific number. It flattens arrays
 * @param properties
 * @param sum
 * @param validationOptions
 * @returns
 */
export function MustSumTo(
  sum: number,
  properties?: string[],
  validationOptions?: ValidationOptions,
) {
  return (object: object, propertyName: string) => {
    registerDecorator({
      name: 'mustSumTo',
      target: object.constructor,
      propertyName,
      constraints: properties || [],
      options: {
        message: `${[propertyName, ...(properties || [])].join('+')} must sum to ${sum.toFixed(2)}`,
        ...validationOptions,
      },
      validator: {
        validate(value: unknown, args: ValidationArguments) {
          const relatedPropertyNames = args.constraints;

          // value of current property is passed directly, others we have to get
          // via the object
          const valueAsArray = Array.isArray(value) ? value : [value];

          // get all values (either current property or related properties) then
          // flatten and filter out non-numbers
          const allValues = (
            [
              ...valueAsArray,
              ...relatedPropertyNames.map((x) => (args.object as never)[x]),
            ].filter((x) => typeof x === 'number' || Array.isArray(x)) as (
              | number[]
              | unknown[]
            )[]
          )
            .flat()
            .filter((x) => typeof x === 'number') as number[];

          const total = allValues.reduce(
            (acc: number, val: number) => acc + val,
            0,
          );

          return Math.abs(total - sum) < 0.0001;
        },
      },
    });
  };
}
