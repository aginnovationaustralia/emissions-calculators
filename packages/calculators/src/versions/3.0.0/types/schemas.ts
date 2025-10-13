export const deprecated = (description: string, deprecationNote?: string) => {
  return {
    description: deprecationNote
      ? `${description}. Deprecation note: ${deprecationNote}`
      : description,
    deprecated: true,
  };
};
