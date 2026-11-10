import mixpanel from 'mixpanel-browser';
import { CALCULATION_EVENT_NAME, MIXPANEL_KEY } from '../constants';
import { MetricsProperties } from '../types';

export function trackCalculatorExecution(properties: MetricsProperties) {
  mixpanel.init(MIXPANEL_KEY);
  mixpanel.track(CALCULATION_EVENT_NAME, properties);
}
