export const LivestockSourceLocations = [
  'Dairy origin',
  'nth/sth/central QLD',
  'nth/sth NSW/VIC/sth SA',
  'NSW/SA pastoral zone',
  'sw WA',
  'WA pastoral',
  'TAS',
  'NT',
] as const;
export type LivestockSourceLocation = typeof LivestockSourceLocations[number];
