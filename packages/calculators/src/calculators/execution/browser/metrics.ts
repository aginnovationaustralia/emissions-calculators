import mixpanel from 'mixpanel-browser';
import { MIXPANEL_KEY } from '../constants';
import { MetricsProperties } from '../types';

export function trackCalculatorExecution(properties: MetricsProperties) {
  mixpanel.init(MIXPANEL_KEY);
  mixpanel.track('Execute package calculation', properties);
}
