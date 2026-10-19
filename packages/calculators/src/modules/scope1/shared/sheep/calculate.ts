import { isSheepClassPeriodInputWithLambing } from '@/calculators/Sheep/types/sheep-class-period.input';
import { selectConstant } from '@/tools/constants';
import { br, min, num } from '@/tools/containers';
import { e, oneMinus, tenToPowMinus3 } from '@/tools/sentinels';
import { massPerHeadPerDay, realNumber } from '@/tools/units';
import {
  getDryMatterAvailability,
  getDryMatterDigestibility,
  getLiveweight,
  SheepPeriodProps,
} from './helpers';

export function calculateProportionLactatingLEjk({
  periodInput,
  periodName,
  className,
}: SheepPeriodProps) {
  if (!isSheepClassPeriodInputWithLambing(periodInput)) {
    return num(0);
  }

  const { percentLambing, percentLambMarking } = periodInput;

  const LRjk = percentLambing.named(`LRj=${periodName},k=${className}`);
  const LMRjk = percentLambMarking.named(`LMRj=${periodName},k=${className}`);

  const LEjk = LRjk.divide(num(100))
    .multiply(min(LMRjk, num(100)).divide(num(100)))
    .named(`LEj=${periodName},k=${className}`)
    .reference('3.4.1.1 (8)');

  return LEjk;
}

function calculateAdditionalIntakeForMilkProductionMAjk(
  periodProps: SheepPeriodProps,
) {
  const { className, periodInput, periodName, context } = periodProps;
  if (!isSheepClassPeriodInputWithLambing(periodInput)) {
    return num(1);
  }

  const { constants } = context;

  const LEjk = calculateProportionLactatingLEjk(periodProps);

  const FAk = selectConstant(constants.SHEEP, 'FEED_ADJUSTMENT').named(
    `FAj=${periodName},k=${className}`,
  );

  return LEjk.multiply(FAk)
    .plus(oneMinus(LEjk))
    .named(`MAj=${periodName},k=${className}`);
}

export function calculateDailyFeedIntakeIjk(periodProps: SheepPeriodProps) {
  const { className, periodName } = periodProps;
  /*
  3.4.1.1 (3)
  Ijk = PIjk * RIjk * MAk=3,4
  
  qmjk = (0.795 * DMDjk) - 0.0014
  RIjk = 1 - e-2(DMAjk)2
  MAjk=3,4 = (LEjk=3,4 * FAk=3,4) + (1 - LEjk=3,4)
  */

  const dryMatterAvailability = getDryMatterAvailability(periodProps);
  /**
   * The equation for RIjk calls for this value to be in tonnes per hectare. It has
   * been normalised to kilograms per square metre, so we need to convert it back here.
   */
  const DMAjkInTonnesPerHectare = dryMatterAvailability
    .switchUnit((r) => realNumber(r.store))
    .multiply(num(10));

  const DMDjk = getDryMatterDigestibility(periodProps);

  const Wjk = getLiveweight(periodProps);

  const qmjk = num(0.795)
    .multiply(DMDjk)
    .minus(num(0.0014))
    .named(`qmj=${periodName},k=${className}`)
    .reference('3.4.1.1 (5)');

  /**
   * 3.4.1.1 (4)
   * PIjk = (104.7 * qmjk + 0.307 * Wjk - 15) * Wjk^0.75 * 10^-3
   * */
  const PIjk = br(
    num(104.7)
      .multiply(qmjk)
      .plus(num(0.307).multiply(Wjk))
      .switchUnit((r) => realNumber(r.store))
      .minus(num(15)),
  )
    .multiply(Wjk.power(num(0.75)))
    .switchUnit((r) => massPerHeadPerDay('DryMatter', r.store))
    .multiply(tenToPowMinus3)
    .named(`PIj=${periodName},k=${className}`)
    .reference('3.4.1.1 (4)');

  const RIjk = oneMinus(
    e.power(num(-2).multiply(DMAjkInTonnesPerHectare.squared())),
  )
    .named(`RIj=${periodName},k=${className}`)
    .reference('3.4.1.1 (6)');

  const MAjk = calculateAdditionalIntakeForMilkProductionMAjk(periodProps)
    .named(`MAj=${periodName},k=${className}`)
    .reference('3.4.1.1 (7)');

  return PIjk.multiply(RIjk)
    .multiply(MAjk)
    .named(`Ij=${periodName},k=${className}`)
    .reference('3.4.1.1 (3)');
}
