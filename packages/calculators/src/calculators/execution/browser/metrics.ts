import mixpanel from 'mixpanel-browser';
import { mixpanelKey } from '../constants';
import { MetricsProperties } from '../types';

export function trackCalculatorExecution(properties: MetricsProperties) {
  mixpanel.init(mixpanelKey);
  mixpanel.track('Execute package calculation', properties);
}
