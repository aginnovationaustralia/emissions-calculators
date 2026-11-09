export const createValueCheck =
  <T>(allowedValues: readonly T[], displayName: string) =>
  (type: string | undefined): T => {
    if (!allowedValues.includes(type as T)) {
      throw new Error(`Value check failed for ${displayName}: ${type}`);
    }
    return type as T;
  };
