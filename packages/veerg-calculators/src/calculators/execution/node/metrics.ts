import { MetricsProperties } from '../types';
import { getMixpanelInstance } from './mixpanel';

export function trackCalculatorExecution(properties: MetricsProperties) {
  getMixpanelInstance()?.track('Execute package calculation', properties);
}
