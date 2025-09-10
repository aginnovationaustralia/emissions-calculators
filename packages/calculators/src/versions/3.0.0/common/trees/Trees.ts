import * as trees from '../../constants/Trees.json';
import { ExecutionContext } from '../../executionContext';
import { Vegetation } from '../../types/vegetation.input';

export function calculateTreeCarbonSequestration(
  veg: Vegetation,
  context: ExecutionContext,
) {
  const { constants } = context;

  const vegetation = veg;
  if (vegetation.soil === 'Other Soils') {
    vegetation.soil = '"Other Soils"';
  }

  // (treesD19)
  const regionNo = constants.TREE_REGIONS.RegionNo[vegetation.region];

  // TODO: not the best way to do this, but it works for now. would have to
  // regenerate regions constants to be row based
  // (treesD19)
  const regionTrees = [
    constants.TREE_REGIONS.TreeSpecies1[vegetation.region],
    constants.TREE_REGIONS.TreeSpecies2[vegetation.region],
    constants.TREE_REGIONS.TreeSpecies3[vegetation.region],
    constants.TREE_REGIONS.TreeSpecies4[vegetation.region],
    constants.TREE_REGIONS.TreeSpecies5[vegetation.region],
    constants.TREE_REGIONS.TreeSpecies6[vegetation.region],
  ];
  const regionSoils = [
    constants.TREE_REGIONS.SoilType1[vegetation.region],
    constants.TREE_REGIONS.SoilType2[vegetation.region],
  ];

  // TODO: have a failsafe for this where a species is not found, i.e someone
  // passed in a species that doesnt exist in this region
  // these should never be < 1
  // (treesD20)
  const treeNo =
    regionTrees.findIndex((tree) => tree === vegetation.treeSpecies) + 1;
  // (treesD21)
  const soilNo = regionSoils.findIndex((soil) => soil === vegetation.soil) + 1;

  const treeLookup = `R${regionNo}T${treeNo}S${soilNo}` as keyof typeof trees;

  // TODO: handle more cases like this, if age > 100, if treeLookup isnt found
  // if region/soil/species isnt in the same row etc
  if (vegetation.age < 1) {
    return { total: 0, average: 0 };
  }

  // (treesD26)
  const ageMinus1 = `${vegetation.age - 1}` as keyof typeof trees.R10T1HGS1;
  const age = `${vegetation.age}` as keyof typeof trees.R10T1HGS1;

  const treeCarbon = trees[treeLookup];

  if (!treeCarbon) {
    return { total: 0, average: 0 };
  }

  const carbon = treeCarbon[age];

  if (!carbon) {
    return { total: 0, average: 0 };
  }

  // (treesE26)
  const carbonPrevYear =
    (ageMinus1 as string) === '0' ? 0 : treeCarbon[ageMinus1];

  const change = carbon - carbonPrevYear;

  // (treesQ8)
  const totalTreeCarbonProduction = [0, ...Object.values(treeCarbon)];
  const annualCarbonProduction = totalTreeCarbonProduction.map((x, i) => {
    if (i === 0) {
      return 0;
    }
    if (i === 1) {
      return (
        (totalTreeCarbonProduction[i + 1] - totalTreeCarbonProduction[i]) / 2
      );
    }
    return x - totalTreeCarbonProduction[i - 1];
  });

  const averageCarbonProduction =
    annualCarbonProduction.slice(1).reduce((a, b) => a + b, 0) /
    annualCarbonProduction.slice(1).length;

  // (treesE10)
  const co2Equivalent = 3.67;

  // t/ha (treesE5)
  const annualCO2Equivalent = change * co2Equivalent;

  // (treesE7)
  const totalCO2Sequestered = annualCO2Equivalent * vegetation.area;

  // Note: in the spreadsheet, carbon sequestered is negative, but here its
  // positive
  return { total: totalCO2Sequestered, average: averageCarbonProduction };
}

export type CarbonSequestration = ReturnType<
  typeof calculateTreeCarbonSequestration
>;

export function calculateAllCarbonSequestrationWithKey<
  // eslint-disable-next-line no-use-before-define
  T extends { [key in K]: number } & { vegetation: Vegetation },
  K extends keyof T,
>(vegetation: T[], key: K, context: ExecutionContext) {
  const vegWithCarbon = vegetation.map((veg) => ({
    ...veg,
    carbon: calculateTreeCarbonSequestration(veg.vegetation, context),
  }));

  const treesTotal = vegWithCarbon.reduce(
    (acc, tree) => acc + tree.carbon.total * (tree[key] ?? 0),
    0,
  );

  return {
    total: treesTotal,
    intermediate: vegWithCarbon.map((x) => x.carbon),
  };
}

/**
 *
 * @param vegetation
 * @param allocationKey
 * @param objects
 * @returns An object with total and intermediate keys. The intermediate keys is the
 * carbon sequestration results per object in the objects array.
 */
export function calculateAllCarbonSequestrationWithKeyProportion<
  // eslint-disable-next-line no-use-before-define
  T extends { [key in K]: number[] } & { vegetation: Vegetation },
  K extends keyof T,
  L,
>(vegetation: T[], allocationKey: K, objects: L[], context: ExecutionContext) {
  const vegWithCarbon = vegetation.map((veg) => ({
    ...veg,
    carbon: calculateTreeCarbonSequestration(veg.vegetation, context),
  }));

  const treesAllocation = objects.map((_, i) =>
    vegWithCarbon.reduce(
      (acc, t) => acc + t.carbon.total * (t[allocationKey][i] ?? 0),
      0,
    ),
  );

  const totalAllocatedTrees = treesAllocation.reduce((acc, t) => acc + t, 0);

  return {
    total: totalAllocatedTrees,
    intermediate: treesAllocation,
  };
}
