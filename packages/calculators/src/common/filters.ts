export const isDefined = <T>(o: T | undefined | null): o is T => {
  return o !== undefined && o !== null;
};
