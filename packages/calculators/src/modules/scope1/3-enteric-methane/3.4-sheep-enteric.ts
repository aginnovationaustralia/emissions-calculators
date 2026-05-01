import { entriesFromObject } from '@/calculators/common/tools';
import { ExecutionContext } from '@/calculators/executionContext';
import { ConstantsForGrainsCalculator } from '@/calculators/Grains/constants';
import { SheepInputTransformed } from '@/calculators/Sheep/types/input';
import { isSheepClassWithLambing } from '@/calculators/Sheep/types/sheep-class.input';
import { SheepSpecificClassInputTransformed } from '@/calculators/Sheep/types/sheep-classes.input';
import { SheepFlockInputTransformed } from '@/calculators/Sheep/types/sheep-flock.input';
import { isDefined } from '@/common/filters';
import { Season } from '@/constants/enums';
import { selectConstant } from '@/tools/constants';
import { br, num } from '@/tools/containers';
import { daysInSeason, e, oneMinus, tenToPowMinus3 } from '@/tools/sentinels';
import { sum } from '@/tools/sum';
import { massPerHeadPerDay, realNumber } from '@/tools/units';

function calculateAdditionalIntakeForMilkProductionMAjk(
  input: SheepInputTransformed,
  classInput: SheepSpecificClassInputTransformed,
  seasonName: Season,
  context: ExecutionContext<ConstantsForGrainsCalculator>,
) {
  if (!isSheepClassWithLambing(classInput)) {
    return num(1);
  }

  const { name } = classInput;
  const { constants } = context;
  const { percentLambing, percentLambMarking } = classInput[seasonName];

  const LRjk = percentLambing.named(`LRjk=${name}k=${seasonName}`);
  const LMRjk = percentLambMarking.named(`LMRjk=${name}k=${seasonName}`);

  const LEjk = LRjk.divide(num(100))
    .multiply(LMRjk.limitedTo(100).divide(num(100)))
    .named(`LEjk=${name}k=${seasonName}`);

  const FAk = selectConstant(constants.SHEEP, 'FEED_ADJUSTMENT').named(
    `FAk=${name}k=${seasonName}`,
  );

  return LEjk.multiply(FAk)
    .plus(oneMinus(LEjk))
    .named(`MAjk=${name}k=${seasonName}`);
}

function calculateDailyFeedIntakeIjk(
  input: SheepInputTransformed,
  classInput: SheepSpecificClassInputTransformed,
  seasonName: Season,
  context: ExecutionContext<ConstantsForGrainsCalculator>,
) {
  const { constants } = context;
  /*
  Ijk = PIjk * RIjk * MAk=3,4
  
  qmjk = (0.795 * DMDjk) - 0.0014
  RIjk = 1 - e-2(DMAjk)2
  MAjk=3,4 = (LEjk=3,4 * FAk=3,4) + (1 - LEjk=3,4)
  */

  const { name } = classInput;

  const DMAjk = selectConstant(
    constants.SHEEP,
    'SEASONAL_FACTORS',
    input.state,
    name,
    seasonName,
    'dryMatterAvailability',
  ).named(`DMAjk=${name}k=${seasonName}`);

  const DMDjk = selectConstant(
    constants.SHEEP,
    'SEASONAL_FACTORS',
    input.state,
    name,
    seasonName,
    'dryMatterDigestibility',
  ).named(`DMDjk=${name}k=${seasonName}`);

  const Wjk = selectConstant(
    constants.SHEEP,
    'SEASONAL_FACTORS',
    input.state,
    name,
    seasonName,
    'liveweight',
  ).named(`Wj=${name},k=${seasonName}`);

  const qmjk = num(0.795)
    .multiply(DMDjk)
    .minus(num(0.0014))
    .named(`qmj=${name},k=${seasonName}`);

  // PIjk = (104.7 * qmjk + 0.307 * Wjk - 15) * Wjk * 10^-3 line 296
  const PIjk = br(
    num(104.7)
      .multiply(qmjk)
      .plus(num(0.307).multiply(Wjk))
      .switchUnit((r) => realNumber(r.value))
      .minus(num(15)),
  )
    .multiply(Wjk.power(num(0.75)))
    .switchUnit((r) => massPerHeadPerDay('DryMatter', r.value))
    .multiply(tenToPowMinus3)
    .named(`PIj=${name},k=${seasonName}`);

  const RIjk = oneMinus(
    e
      .power(
        num(-2).multiply(
          DMAjk.squared().switchUnit((r) => realNumber(r.value)),
        ),
      )
      .named(`RIjk=${name}k=${seasonName}`),
  );

  const MAjk = calculateAdditionalIntakeForMilkProductionMAjk(
    input,
    classInput,
    seasonName,
    context,
  ).named(`MAjk=${name}k=${seasonName}`);

  return PIjk.multiply(RIjk).multiply(MAjk).named(`Ijk=${name}k=${seasonName}`);
}

function calculateClassMethaneForSeason(
  input: SheepInputTransformed,
  classInput: SheepSpecificClassInputTransformed,
  seasonName: Season,
  context: ExecutionContext<ConstantsForGrainsCalculator>,
) {
  const { name } = classInput;
  const { head } = classInput[seasonName];
  const Nj = head.named(`Nj=${name}k=${seasonName}`);
  const Dj = daysInSeason.named(`Dj=${name}k=${seasonName}`);

  const Ijk = calculateDailyFeedIntakeIjk(
    input,
    classInput,
    seasonName,
    context,
  ).named(`Ij=${name},k=${seasonName}`);
  const Mijk = num(0.0188)
    .multiply(Ijk)
    .plus(num(0.00158))
    .named(`Mj=${name},k=${seasonName}`);

  return Mijk.multiply(Nj)
    .multiply(Dj)
    .named(`Eenteric,j=${name},k=${seasonName}`);
}

function calculateEntericMethaneForFlock(
  input: SheepInputTransformed,
  flock: SheepFlockInputTransformed,
  context: ExecutionContext<ConstantsForGrainsCalculator>,
) {
  /*
  3.4.1.1 line 281
  Eenteric = SUM SUM (Njk * Mijk * Dj) * 10^-3

  Mijk = (Ijk * 0.0188) + 0.00158
  */

  const { classes } = flock;
  const classInputs = entriesFromObject(classes);
  const classResults = classInputs
    .map(([className, classInput]) => {
      if (!classInput) {
        return undefined;
      }
      const springMethane = calculateClassMethaneForSeason(
        input,
        classInput,
        'spring',
        context,
      );
      const summerMethane = calculateClassMethaneForSeason(
        input,
        classInput,
        'summer',
        context,
      );
      const autumnMethane = calculateClassMethaneForSeason(
        input,
        classInput,
        'autumn',
        context,
      );
      const winterMethane = calculateClassMethaneForSeason(
        input,
        classInput,
        'winter',
        context,
      );
      return sum([
        springMethane,
        summerMethane,
        autumnMethane,
        winterMethane,
      ]).named(`Eenteric=${className}`);
    })
    .filter(isDefined);
  return sum(classResults).named('Eenteric (flock)');
}

export function calculate34SheepEntericMethane(
  input: SheepInputTransformed,
  context: ExecutionContext<ConstantsForGrainsCalculator>,
) {
  const { flocks } = input;
  const flockResults = flocks.map((flock) => {
    return calculateEntericMethaneForFlock(input, flock, context);
  });
  return sum(flockResults).named('Eenteric');
}
