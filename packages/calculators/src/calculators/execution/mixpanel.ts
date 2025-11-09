import { init } from 'mixpanel';
import { CalculatorConfig } from './config';

export const mixPanelInstance = CalculatorConfig.isMetricsEnabled()
  ? init(CalculatorConfig.mixpanelKey())
  : null;
