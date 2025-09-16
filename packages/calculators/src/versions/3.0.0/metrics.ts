import { init } from "mixpanel";

const isMetricsEnabled = () => process.env.DISABLE_CALCULATOR_METRICS !== 'true';

// Package version - injected at build time
declare const PACKAGE_VERSION: string;

const mixpanel = isMetricsEnabled() ? init('ed361d81702b467cfa90128d3969bb06') : null;

export function trackCalculatorExecution(calculator: string, calculatorVersion: string, failed: boolean) {
    if (isMetricsEnabled()) {
        mixpanel?.track('Execute package calculation', {
          calculator,
          calculatorVersion,
          packageVersion: typeof PACKAGE_VERSION !== 'undefined' ? PACKAGE_VERSION : 'unknown',
          failed,
          organisation: process.env.CALCULATOR_METRICS_ORGANISATION,
        });
    }
}