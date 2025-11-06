import { calculateSheep } from '../../Sheep/calculator';
import { testContext } from '../common/context';
import { sheepTestData } from './input.data';

const zeroAll = {
  autumn: {
    head: 0,
    liveweight: 0,
    liveweightGain: 0,
  },
  spring: {
    head: 0,
    liveweight: 0,
    liveweightGain: 0,
  },
  summer: {
    head: 0,
    liveweight: 0,
    liveweightGain: 0,
  },
  winter: {
    head: 0,
    liveweight: 0,
    liveweightGain: 0,
  },
};

describe('checking Sheep, no lambs', () => {
  const sheepDataNoLambs = {
    ...sheepTestData,
    sheep: [
      ...sheepTestData.sheep.map((x) => {
        const { classes } = x;

        classes.eweLambs = {
          ...classes.eweLambs,
          ...zeroAll,
        };
        classes.wetherLambs = {
          ...classes.wetherLambs,
          ...zeroAll,
        };
        classes.tradeLambsAndHoggets = {
          ...classes.tradeLambsAndHoggets!,
          ...zeroAll,
        };

        return { ...x, classes };
      }),
    ],
  };

  const context = testContext('Sheep');
  const emissions = calculateSheep(sheepDataNoLambs, context);

  test('scope 1s and total not to be nan', () => {
    expect(emissions.scope1.atmosphericDepositionN2O).not.toBeNaN();
    expect(emissions.scope1.leachingAndRunoffN2O).not.toBeNaN();
    expect(emissions.scope1.urineAndDungN2O).not.toBeNaN();
    expect(emissions.scope1.total).not.toBeNaN();
    expect(emissions.net.total).not.toBeNaN();
  });
});
