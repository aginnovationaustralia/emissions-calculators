/**
 * Substances are the keys of this interface, added with module augmentation:
 *
 *   declare module '@aginnovationaustralia/calculator-units-globals' {
 *     interface SubstanceRegistry {
 *       Biochar: true;
 *     }
 *   }
 *
 * The core declares none. Importing `@aginnovationaustralia/calculator-units-globals/defaults` adds the
 * default set. While the registry is empty, `Substance` is `string`, so a blank slate works before
 * any substances are declared.
 */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface SubstanceRegistry {}

export type Substance = [keyof SubstanceRegistry] extends [never]
  ? string
  : keyof SubstanceRegistry & string;
