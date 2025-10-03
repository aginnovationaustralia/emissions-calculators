import { CalculationEnvironment, ConstantOverrides } from './environment';

// Package version - injected at build time
declare const PACKAGE_VERSION: string;

export class CalculatorConfig {
  static getOrganisation(): string | undefined {
    return (
      CalculationEnvironment.getOrganisation() ??
      process.env.CALCULATOR_METRICS_ORGANISATION
    );
  }

  static isMetricsEnabled(): boolean {
    return process.env.DISABLE_CALCULATOR_METRICS !== 'true';
  }

  static packageVersion(): string {
    return typeof PACKAGE_VERSION !== 'undefined' ? PACKAGE_VERSION : 'unknown';
  }

  static mixpanelKey(): string {
    return 'ed361d81702b467cfa90128d3969bb06';
  }

  static overrides(): ConstantOverrides | undefined {
    return CalculationEnvironment.getOverrides();
  }
}
