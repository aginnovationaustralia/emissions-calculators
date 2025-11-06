/* eslint-disable camelcase */
import clone from 'nanoclone';
import { calculatePoultry } from '../../Poultry/calculator';
import { PoultryInput } from '../../types/Poultry/input';
import { compareEmissionsFrom2Inputs } from '../common/comparisons';
import { testContext } from '../common/context';
import { executeEmissionsSpec } from '../common/emissions';
import { poultryTestData } from './poultry.data';

const expectations = {
  scope1: {
    atmosphericDepositionN2O: 4605.25194469257,
    leachingAndRunoffN2O: 581.764538125885,
    manureManagementN2O: 13681.0709012245,
    manureManagementCH4: 2394.73415919768,
    total: 23487.1753796017,
  },
  scope2: {
    electricity: 1983.5539374,
  },
  scope3: {
    purchasedFeed: 40.59365,
    electricity: 279.373794,
    fuel: 706.380218713,
    purchasedLivestock: 3304.7376,
    total: 6653.085262713,
  },
  carbonSequestration: {
    total: 1119.35,
  },
  net: {
    total: 31004.4645797147,
  },
  intensities: {
    poultryMeatExcludingSequestration: 0.133209220135,
    poultryMeatIncludingSequestration: 0.126816295272,
    poultryEggsExcludingSequestration: 48.718762366221,
    poultryEggsIncludingSequestration: 47.386202842412,
  },
};

describe('Poultry calculator, QLD', () => {
  const context = testContext('Poultry');
  const emissions = calculatePoultry(poultryTestData, context);

  executeEmissionsSpec(emissions, expectations);

  it('Generates IDs for intermediate activities', () => {
    expect(emissions.intermediateBroilers[0].id).toBe('broiler-0');
    expect(emissions.intermediateLayers[0].id).toBe('layer-0');
  });
});

describe('Poultry calculator (multi activity)', () => {
  const originalBroilerActivity = clone(poultryTestData.broilers[0]);
  originalBroilerActivity.id = 'broiler-original';
  const originalLayerActivity = clone(poultryTestData.layers[0]);
  originalLayerActivity.id = 'layer-original';
  const activityBroilerDoubleWeight = clone(originalBroilerActivity);
  activityBroilerDoubleWeight.id = 'broiler-double-weight';
  activityBroilerDoubleWeight.sales.forEach((s) => {
    // eslint-disable-next-line no-param-reassign
    s.meatChickenGrowersSales.saleWeight *= 2;
    // eslint-disable-next-line no-param-reassign
    s.meatChickenLayers.saleWeight *= 2;
    // eslint-disable-next-line no-param-reassign
    s.meatOther.saleWeight *= 2;
  });

  const vegetation = clone(poultryTestData.vegetation[0]);
  vegetation.broilersProportion = [1];
  vegetation.layersProportion = [1];

  const poultrySingleBroiler: PoultryInput = {
    ...poultryTestData,
    broilers: [originalBroilerActivity],
    layers: [],
    vegetation: [vegetation],
  };

  const poultryDoubleBroilers: PoultryInput = {
    ...poultryTestData,
    broilers: [activityBroilerDoubleWeight],
    layers: [],
    vegetation: [],
  };

  const poultryTestDataAllBroilerActivities: PoultryInput = {
    ...poultryTestData,
    broilers: [originalBroilerActivity, activityBroilerDoubleWeight],
    layers: [],
    vegetation: [vegetation],
  };

  compareEmissionsFrom2Inputs(
    'Poultry (broilers)',
    calculatePoultry,
    poultrySingleBroiler,
    poultryDoubleBroilers,
    poultryTestDataAllBroilerActivities,
    (originalEmissions, secondEmissions) => {
      expect(originalEmissions.intensities.meatProducedKg).toBeCloseTo(
        secondEmissions.intensities.meatProducedKg / 2,
      );
    },
    {
      intermediateKeyName: 'intermediateBroilers',
    },
  );

  const poultrySingleLayer: PoultryInput = {
    ...poultryTestData,
    broilers: [],
    layers: [originalLayerActivity],
    vegetation: [vegetation],
  };

  const activityLayerDoubleEggs = clone(originalLayerActivity);
  activityLayerDoubleEggs.id = 'layer-double-eggs';
  activityLayerDoubleEggs.layers.autumn *= 2;
  activityLayerDoubleEggs.layers.spring *= 2;
  activityLayerDoubleEggs.layers.summer *= 2;
  activityLayerDoubleEggs.layers.winter *= 2;
  activityLayerDoubleEggs.meatChickenLayers.autumn *= 2;
  activityLayerDoubleEggs.meatChickenLayers.spring *= 2;
  activityLayerDoubleEggs.meatChickenLayers.summer *= 2;
  activityLayerDoubleEggs.meatChickenLayers.winter *= 2;

  const poultryDoubleLayers: PoultryInput = {
    ...poultryTestData,
    broilers: [],
    layers: [activityLayerDoubleEggs],
    vegetation: [],
  };

  const poultryTestDataAllLayerActivities: PoultryInput = {
    ...poultryTestData,
    broilers: [],
    layers: [originalLayerActivity, activityLayerDoubleEggs],
    vegetation: [vegetation],
  };

  compareEmissionsFrom2Inputs(
    'Poultry (layers)',
    calculatePoultry,
    poultrySingleLayer,
    poultryDoubleLayers,
    poultryTestDataAllLayerActivities,
    (originalEmissions, secondEmissions) => {
      expect(originalEmissions.intensities.eggsProducedKg).toBeCloseTo(
        secondEmissions.intensities.eggsProducedKg / 2,
      );
    },
    {
      intermediateKeyName: 'intermediateLayers',
    },
  );
});
