/**
 * `Omit` applied to each member of a union separately. Plain `Omit` on a union keeps only
 * the keys common to every member, losing the members' own keys.
 */
export type DistributiveOmit<T, K extends PropertyKey> = T extends unknown
  ? Omit<T, K>
  : never;
