import { AllConstants } from '@/constants';

export type MetricsProperties = {
  calculator: string;
  calculatorVersion: string;
  failed: boolean;
  packageVersion: string;
  organisation: string | undefined;
};

export interface Environment {
  loadConstants: () => AllConstants;
  isMetricsEnabled: () => boolean;
  getOrganisation: () => string | undefined;
  trackCalculatorExecution: (calculatorName: string, failed: boolean) => void;
}

export type CalculatorOptions = {
  disableMetrics?: boolean;
  organisation?: string;
};
