import { init, Mixpanel } from 'mixpanel';
import { mixpanelKey } from '../constants';

let mixpanelInstance: Mixpanel | null = null;
export const getMixpanelInstance = () => {
  if (!mixpanelInstance) {
    mixpanelInstance = init(mixpanelKey);
  }
  return mixpanelInstance;
};
