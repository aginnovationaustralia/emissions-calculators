/**
 * Information attached to a container: its name, the references it was calculated from, and
 * anything a consumer adds with module augmentation:
 *
 *   declare module '@aginnovationaustralia/calculator-units' {
 *     interface Metadata {
 *       quality?: QualityTable;
 *     }
 *   }
 *
 * Like `SubstanceRegistry`, this is types only.
 */
export interface Metadata {
  name?: string;
  references?: string[];
}
