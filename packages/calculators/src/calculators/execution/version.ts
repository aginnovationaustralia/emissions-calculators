// Package version - injected at build time
declare const PACKAGE_VERSION: string;

export function packageVersion(): string {
  return typeof PACKAGE_VERSION !== 'undefined' ? PACKAGE_VERSION : 'unknown';
}
