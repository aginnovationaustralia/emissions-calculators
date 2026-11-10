import { CALCULATION_EVENT_NAME } from '../constants';
import { MetricsProperties } from '../types';
import { getMixpanelInstance } from './mixpanel';

export function trackCalculatorExecution(properties: MetricsProperties) {
  getMixpanelInstance()?.track(CALCULATION_EVENT_NAME, properties);
}
