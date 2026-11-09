function quoteString(value: string): string {
  if (value?.includes(' ')) {
    return `"${value}"`;
  }
  return value;
}

export { quoteString };
