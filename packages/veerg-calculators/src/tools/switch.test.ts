import { num } from './containers';
import { input } from './inputs';
import { selectSwitch, SwitchContainer } from './switch';

// `selectSwitch` backs every by-state / by-region / by-category factor lookup in the
// calculators. It must pick exactly the case matching the subject's runtime value.

describe('selectSwitch', () => {
  const cases = {
    NSW: num(1).named('NSW factor'),
    VIC: num(2).named('VIC factor'),
    QLD: num(3).named('QLD factor'),
  };

  it('selects the case matching the subject value', () => {
    const subject = input('VIC' as const, { name: 'state', modules: [] });
    const result = selectSwitch(subject, cases);

    expect(result).toBeInstanceOf(SwitchContainer);
    expect(result.originType).toBe('switch');
    expect(result.selected).toBe(cases.VIC);
    expect(result.subject).toBe(subject);
    expect(result.unit.store.toNumber()).toBe(2);
  });

  it('selects a different case when the subject value differs', () => {
    const subject = input('QLD' as const, { name: 'state', modules: [] });
    const result = selectSwitch(subject, cases);

    expect(result.selected).toBe(cases.QLD);
    expect(result.unit.store.toNumber()).toBe(3);
  });
});
