import { init, Mixpanel } from 'mixpanel';

const mixpanelKey = 'ed361d81702b467cfa90128d3969bb06';

let mixpanelInstance: Mixpanel | null = null;
export const getMixpanelInstance = () => {
  if (!mixpanelInstance) {
    mixpanelInstance = init(mixpanelKey);
  }
  return mixpanelInstance;
};
