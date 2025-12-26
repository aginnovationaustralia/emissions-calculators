// import { HasMetadata, ValueMetadata } from './metadata';
// import { Origin } from './origins';
// import { CanPrint, DecimalValue } from './values';

// export type Variable = CanPrint &
//   DecimalValue &
//   HasMetadata & {
//     name: string;
//     valueType: 'variable';
//     from: Origin;
//   };

// export const variable = (
//   name: string,
//   from: Origin,
//   metadata?: ValueMetadata,
// ): Variable => {
//   return {
//     name,
//     valueType: 'variable',
//     from,
//     value: () => from.value(),
//     metadata,
//     printValue: () => from.printValue(),
//     printWithUnits: () => from.printWithUnits(),
//   };
// };
