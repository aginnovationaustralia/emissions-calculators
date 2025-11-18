import { init, Mixpanel } from 'mixpanel';
import { MIXPANEL_KEY } from '../constants';

let mixpanelInstance: Mixpanel | null = null;
export const getMixpanelInstance = () => {
  if (!mixpanelInstance) {
    mixpanelInstance = init(MIXPANEL_KEY);
  }
  return mixpanelInstance;
};
