import { init } from 'mixpanel';
import { CalculatorConfig } from './config';

export const mixPanelinstance = CalculatorConfig.isMetricsEnabled()
  ? init(CalculatorConfig.mixpanelKey())
  : null;
