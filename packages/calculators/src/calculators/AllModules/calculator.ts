import { AllConstants } from '@/constants/types';
import { calculateLULUCF } from '@/modules/lulucf/calculate';
import { LULUCFOutput } from '@/modules/lulucf/output';
import { calculate10SolidWasteEmissions } from '@/modules/scope1/10-solid-waste';
import { calculate11Scope1WastewaterTreatment } from '@/modules/scope1/11-wastewater';
import { calculate12Scope1SupplementaryCO2 } from '@/modules/scope1/12-supplementary-co2';
import { calculateScope1AquaticN2O } from '@/modules/scope1/13-aquatic';
import { calculate31BeefFeedlotEntericMethane } from '@/modules/scope1/3-enteric-methane/3.1-beef-feedlot';
import { calculate32BeefPastureEntericMethaneForHerd } from '@/modules/scope1/3-enteric-methane/3.2-beef-pasture';
import { calculate33EntericMethaneForHerd } from '@/modules/scope1/3-enteric-methane/3.3-dairy-enteric';
import { calculate34SheepEntericMethane } from '@/modules/scope1/3-enteric-methane/3.4-sheep-enteric';
import { calculate35PigsEntericMethane } from '@/modules/scope1/3-enteric-methane/3.5-pigs-enteric';
import { calculate36OtherLivestockEntericMethaneForHerd } from '@/modules/scope1/3-enteric-methane/3.6-other-livestock';
import { calculate41BeefFeedlotManureManagement } from '@/modules/scope1/4-manure-management/4.1-feedlot-manure';
import { calculateManureManagementSoilAtmosphericDepositionN2OForHerd } from '@/modules/scope1/4-manure-management/4.2-beef-pasture/4.2-beef-pasture-manure-atmospheric-deposition-n2o';
import { calculateManureManagementSoilLeachingRunoffN2OForHerd } from '@/modules/scope1/4-manure-management/4.2-beef-pasture/4.2-beef-pasture-manure-leaching-runoff-n2o';
import { calculate42BeefPastureManureCH4ForHerd } from '@/modules/scope1/4-manure-management/4.2-beef-pasture/4.2-beef-pasture-manure-methane';
import { calculateManureManagementSoilDirectN2OForHerd } from '@/modules/scope1/4-manure-management/4.2-beef-pasture/4.2-beef-pasture-manure-n2o';
import { calculate43DairyManureManagement } from '@/modules/scope1/4-manure-management/4.3-dairy-manure';
import { calculate44SheepManureManagement } from '@/modules/scope1/4-manure-management/4.4-sheep-manure';
import { calculate45PigsManureManagement } from '@/modules/scope1/4-manure-management/4.5-pigs-manure';
import { calculate46PoultryManureManagement } from '@/modules/scope1/4-manure-management/4.6-poultry-manure';
import { calculate47OtherLivestockManureManagement } from '@/modules/scope1/4-manure-management/4.7-other-livestock-manure';
import {
  calculate51InorganicFertiliser,
  calculate52OrganicFertiliser,
  calculate53Lime,
  calculate54AtmosphericDeposition,
  calculate55LeachingAndRunoff,
} from '@/modules/scope1/5-fertiliser';
import {
  calculate61CropResidueN2O,
  calculate62PastureResidueN2O,
  calculate63ResidueLeachingAndRunoffN2O,
  calculate64FieldBurning,
} from '@/modules/scope1/6-residue-mgmt';
import { calculateScope1RiceCultivation } from '@/modules/scope1/7-rice-cultivation';
import {
  calculate81TransportFuel,
  calculate82StationaryFuel,
} from '@/modules/scope1/8-fuel-use';
import { calculateScope1RefrigerantUse } from '@/modules/scope1/9-refrigerant-use';
import { calculateElectricityScope2 } from '@/modules/scope2/14-electricity';
import { calculatePurchasedLivestockEmissions } from '@/modules/scope3/15.1-purchased-livestock';
import { calculateScope3EmissionsFromFuel } from '@/modules/scope3/15.10-fuel';
import { calculateElectricityScope3 } from '@/modules/scope3/15.11-electricity';
import { calculateScope3SolidWasteEmissions } from '@/modules/scope3/15.12-waste';
import { calculateFreightEmissions } from '@/modules/scope3/15.13-freight';
import { calculatePurchasedFeed } from '@/modules/scope3/15.2-purchased-feed';
import { calculatePurchasedMineralSupplements } from '@/modules/scope3/15.3-purchased-mineral-supplements';
import { calculateScope3Fertiliser } from '@/modules/scope3/15.4-fertiliser';
import { calculateScope3Agrichemicals } from '@/modules/scope3/15.5-agrichemicals';
import { calculateScope3SoilAmeliorants } from '@/modules/scope3/15.6-lime';
import { calculateScope3Services } from '@/modules/scope3/15.7-services';
import { calculatePurchasedPackaging } from '@/modules/scope3/15.8-purchased-packaging';
import { calculateOtherPurchasedGoodsAndServicesEmissions } from '@/modules/scope3/15.9-other-purchases';
import { IntermediateScope1, IntermediateScope23 } from '@/tools/calculators';
import { Container, NumberContainer } from '@/tools/containers';
import {
  buildCalculatorLedger,
  exposeTonnesCO2e,
  serialiseCalculatorLedger,
  sumCO2e,
} from '@/tools/ledger';
import { zeroCH4, zeroCO2, zeroCO2e, zeroN2O } from '@/tools/sentinels';
import { ExtractOriginUnit, sum } from '@/tools/sum';
import { NumberUnit } from '@/tools/units';
import { ExecutionContext } from '../executionContext';
import { Scope2Output } from '../types/scope2.output';
import { AllModulesInputTransformed } from './types/input';
import { AllModulesScope1Output } from './types/scope1.output';
import { AllModulesScope3Output } from './types/scope3.output';

// Adds up one module's results across the activities that were supplied. A single result
// is passed through unchanged, and if none were supplied the zero sentinel is returned.
const addSupplied = <C extends NumberContainer<NumberUnit>>(
  results: (C | undefined)[],
  zero: Container<ExtractOriginUnit<C>>,
) => {
  const supplied = results.filter(
    (result): result is C => result !== undefined,
  );
  return supplied.length > 1 ? sum(supplied, zero) : (supplied[0] ?? zero);
};

// Every top-level key of AllModulesInputTransformed is optional (see types/input.ts), so
// that callers only need to supply the activities relevant to them. Rather than default
// an omitted key to an "empty" activity and run its module anyway, every call below is
// guarded on the specific key(s) it needs and falls back to the appropriate zero
// sentinel from @/tools/sentinels - so a module genuinely never executes for data that
// wasn't supplied.
const zeroManureManagement = {
  manureManagementCH4: zeroCH4,
  manureDirectN2O: zeroN2O,
  manureAtmosphericDepositionN2O: zeroN2O,
  manureLeachingRunoffN2O: zeroN2O,
};

const calculateScope1AllModules = (
  input: AllModulesInputTransformed,
  lulucf: IntermediateScope1<LULUCFOutput>,
  context: ExecutionContext<AllConstants>,
): IntermediateScope1<AllModulesScope1Output> => {
  // 3.1
  const entericFeedlotCH4 = input.feedlot
    ? calculate31BeefFeedlotEntericMethane(input.feedlot, context)
    : zeroCH4;

  // 3.2
  const entericBeefCH4 = input.beef
    ? calculate32BeefPastureEntericMethaneForHerd(input.beef, context)
    : zeroCH4;

  // 3.3 dairy methane
  const entericDairyCH4 = input.dairy
    ? calculate33EntericMethaneForHerd(input.dairy, context)
    : zeroCH4;

  // 3.4 sheep methane
  const entericSheepCH4 = input.sheep
    ? calculate34SheepEntericMethane(input.sheep, context)
    : zeroCH4;

  // 3.5 pigs methane
  const entericPigsCH4 = input.pigs
    ? calculate35PigsEntericMethane(input.pigs, context)
    : zeroCH4;

  // 3.6 other livestock methane
  const entericOtherLivestockCH4 = input.otherLivestock
    ? calculate36OtherLivestockEntericMethaneForHerd(
        input.otherLivestock,
        context,
      )
    : zeroCH4;

  // 4.1 feedlot manure management
  const {
    manureManagementCH4: manureManagementFeedlotCH4,
    manureDirectN2O: manureDirectFeedlotN2O,
    manureAtmosphericDepositionN2O: manureAtmosphericDepositionFeedlotN2O,
    manureLeachingRunoffN2O: manureLeachingRunoffFeedlotN2O,
  } = input.feedlot
    ? calculate41BeefFeedlotManureManagement(input.feedlot, context)
    : zeroManureManagement;

  // 4.2 beef manure management
  const manureManagementBeefCH4 = input.beef
    ? calculate42BeefPastureManureCH4ForHerd(input.beef, context)
    : zeroCH4;
  const manureAtmosphericDepositionBeefN2O = input.beef
    ? calculateManureManagementSoilAtmosphericDepositionN2OForHerd(
        input.beef,
        context,
      )
    : zeroN2O;
  const manureLeachingRunoffBeefN2O = input.beef
    ? calculateManureManagementSoilLeachingRunoffN2OForHerd(input.beef, context)
    : zeroN2O;
  const manureSoilDirectBeefN2O = input.beef
    ? calculateManureManagementSoilDirectN2OForHerd(input.beef, context)
    : zeroN2O;

  // 4.3 dairy manure management
  const {
    manureManagementCH4: manureManagementDairyCH4,
    manureDirectN2O: manureDirectDairyN2O,
    manureAtmosphericDepositionN2O: manureAtmosphericDepositionDairyN2O,
    manureLeachingRunoffN2O: manureLeachingRunoffDairyN2O,
  } = input.dairy
    ? calculate43DairyManureManagement(input.dairy, context)
    : zeroManureManagement;

  // 4.4 sheep manure management
  const {
    manureManagementCH4: manureManagementSheepCH4,
    manureDirectN2O: manureDirectSheepN2O,
    manureAtmosphericDepositionN2O: manureAtmosphericDepositionSheepN2O,
    manureLeachingRunoffN2O: manureLeachingRunoffSheepN2O,
  } = input.sheep
    ? calculate44SheepManureManagement(input.sheep, context)
    : zeroManureManagement;

  // 4.5 pigs manure management
  const {
    manureManagementCH4: manureManagementPigsCH4,
    manureDirectN2O: manureDirectPigsN2O,
    manureAtmosphericDepositionN2O: manureAtmosphericDepositionPigsN2O,
    manureLeachingRunoffN2O: manureLeachingRunoffPigsN2O,
  } = input.pigs
    ? calculate45PigsManureManagement(input.pigs, context)
    : zeroManureManagement;

  // 4.6 poultry manure management
  const {
    manureManagementCH4: manureManagementPoultryCH4,
    manureDirectN2O: manureDirectPoultryN2O,
    manureAtmosphericDepositionN2O: manureAtmosphericDepositionPoultryN2O,
    manureLeachingRunoffN2O: manureLeachingRunoffPoultryN2O,
  } = input.poultry
    ? calculate46PoultryManureManagement(input.poultry, context)
    : zeroManureManagement;

  // 4.7 other livestock manure management
  const {
    manureManagementCH4: manureManagementOtherLivestockCH4,
    manureDirectN2O: manureDirectOtherLivestockN2O,
    manureAtmosphericDepositionN2O:
      manureAtmosphericDepositionOtherLivestockN2O,
    manureLeachingRunoffN2O: manureLeachingRunoffOtherLivestockN2O,
  } = input.otherLivestock
    ? calculate47OtherLivestockManureManagement(input.otherLivestock, context)
    : zeroManureManagement;

  // 5.1 Inorganic and urea fertiliser application
  const { inorganicFertiliserN2O, inorganicFertiliserCO2 } = input.fertiliser
    ? calculate51InorganicFertiliser(input.fertiliser, context)
    : { inorganicFertiliserN2O: zeroN2O, inorganicFertiliserCO2: zeroCO2 };
  // 5.2 Organic fertiliser application
  const organicFertiliserN2O = input.fertiliser
    ? calculate52OrganicFertiliser(input.fertiliser, context)
    : zeroN2O;
  // 5.3 Lime application
  const limeCO2 = input.lime
    ? calculate53Lime({ lime: input.lime }, context)
    : zeroCO2;
  // 5.4 Atmospheric deposition
  const {
    inorganicFertiliserAtmosphericDepositionN2O,
    organicFertiliserAtmosphericDepositionN2O,
  } = input.fertiliser
    ? calculate54AtmosphericDeposition(input.fertiliser, context)
    : {
        inorganicFertiliserAtmosphericDepositionN2O: zeroN2O,
        organicFertiliserAtmosphericDepositionN2O: zeroN2O,
      };
  // 5.5 Fertiliser leaching and run-off resulting from fertiliser application
  const { fertiliserLeachingAndRunoffN2O } = input.fertiliser
    ? calculate55LeachingAndRunoff(input.fertiliser, context)
    : { fertiliserLeachingAndRunoffN2O: zeroN2O };

  // 6 residue management
  // The rice crop's residues count alongside `crop` and `pasture`, as they do in the Rice
  // calculator.
  const { rice } = input;
  // 6.1 Return of crop residues to soils
  const cropResidueN2O = addSupplied(
    [
      input.crop && calculate61CropResidueN2O(input.crop, context),
      rice && calculate61CropResidueN2O(rice, context),
    ],
    zeroN2O,
  );
  // 6.2 Return of pasture residues to soils
  const pastureResidueN2O = input.pasture
    ? calculate62PastureResidueN2O(input.pasture, context)
    : zeroN2O;
  // 6.3 Residue leaching and run-off from crop and pasture residues
  const residueLeachingAndRunoffN2O = addSupplied(
    [
      input.pasture &&
        calculate63ResidueLeachingAndRunoffN2O(input.pasture, context),
      input.crop && calculate63ResidueLeachingAndRunoffN2O(input.crop, context),
      rice && calculate63ResidueLeachingAndRunoffN2O(rice, context),
    ],
    zeroN2O,
  );
  // 6.4 Field burning of crop residues
  const cropFieldBurning =
    input.crop && calculate64FieldBurning(input.crop, context);
  const riceFieldBurning = rice && calculate64FieldBurning(rice, context);
  const fieldBurningN2O = addSupplied(
    [cropFieldBurning?.fieldBurningN2O, riceFieldBurning?.fieldBurningN2O],
    zeroN2O,
  );
  const fieldBurningCH4 = addSupplied(
    [cropFieldBurning?.fieldBurningCH4, riceFieldBurning?.fieldBurningCH4],
    zeroCH4,
  );

  // Chapter 7 rice
  const riceCultivationCH4 = input.rice
    ? calculateScope1RiceCultivation(input.rice, context)
    : zeroCH4;

  // Transport Fuel 8.1
  const { fuelTransportCO2, fuelTransportCH4, fuelTransportN2O } = input.fuel
    ? calculate81TransportFuel(input.fuel, context)
    : {
        fuelTransportCO2: zeroCO2,
        fuelTransportCH4: zeroCH4,
        fuelTransportN2O: zeroN2O,
      };
  // Stationary Fuel 8.2
  const { fuelStationaryCO2, fuelStationaryCH4, fuelStationaryN2O } = input.fuel
    ? calculate82StationaryFuel(input.fuel, context)
    : {
        fuelStationaryCO2: zeroCO2,
        fuelStationaryCH4: zeroCH4,
        fuelStationaryN2O: zeroN2O,
      };

  // Refrigerant Use 9.1
  const refrigerantHFCs = input.refrigerants
    ? calculateScope1RefrigerantUse(
        { refrigerants: input.refrigerants },
        context,
      )
    : zeroCO2e;
  // Solid Waste Treatment 10.1
  const { solidWasteCO2, solidWasteCH4, solidWasteN2O } =
    calculate10SolidWasteEmissions(input, context);

  // Wastewater 11
  const { wastewaterCH4, wastewaterN2O } = input.wastewater
    ? calculate11Scope1WastewaterTreatment(
        { wastewater: input.wastewater },
        context,
      )
    : { wastewaterCH4: zeroCH4, wastewaterN2O: zeroN2O };

  // Supplementary CO2 12.1
  const supplementaryCO2 =
    input.supplementaryCO2Kg !== undefined
      ? calculate12Scope1SupplementaryCO2({
          supplementaryCO2Kg: input.supplementaryCO2Kg,
        })
      : zeroCO2;

  // 13.1 Aquaculture
  const aquaticN2O = input.fishery
    ? calculateScope1AquaticN2O({ fishery: input.fishery }, context)
    : zeroN2O;

  return {
    entericFeedlotCH4,
    manureManagementFeedlotCH4,
    manureDirectFeedlotN2O,
    manureAtmosphericDepositionFeedlotN2O,
    manureLeachingRunoffFeedlotN2O,
    entericBeefCH4,
    manureManagementBeefCH4,
    manureAtmosphericDepositionBeefN2O,
    manureLeachingRunoffBeefN2O,
    manureSoilDirectBeefN2O,
    entericDairyCH4,
    manureManagementDairyCH4,
    manureDirectDairyN2O,
    manureAtmosphericDepositionDairyN2O,
    manureLeachingRunoffDairyN2O,
    entericSheepCH4,
    manureManagementSheepCH4,
    manureDirectSheepN2O,
    manureAtmosphericDepositionSheepN2O,
    manureLeachingRunoffSheepN2O,
    entericPigsCH4,
    manureManagementPigsCH4,
    manureDirectPigsN2O,
    manureAtmosphericDepositionPigsN2O,
    manureLeachingRunoffPigsN2O,
    manureManagementPoultryCH4,
    manureDirectPoultryN2O,
    manureAtmosphericDepositionPoultryN2O,
    manureLeachingRunoffPoultryN2O,
    entericOtherLivestockCH4,
    manureManagementOtherLivestockCH4,
    manureDirectOtherLivestockN2O,
    manureAtmosphericDepositionOtherLivestockN2O,
    manureLeachingRunoffOtherLivestockN2O,
    inorganicFertiliserN2O,
    inorganicFertiliserCO2,
    organicFertiliserN2O,
    limeCO2,
    inorganicFertiliserAtmosphericDepositionN2O,
    organicFertiliserAtmosphericDepositionN2O,
    fertiliserLeachingAndRunoffN2O,
    cropResidueN2O,
    pastureResidueN2O,
    riceCultivationCH4,
    residueLeachingAndRunoffN2O,
    fieldBurningN2O,
    fieldBurningCH4,
    fuelTransportCO2,
    fuelTransportCH4,
    fuelTransportN2O,
    fuelStationaryCO2,
    fuelStationaryCH4,
    fuelStationaryN2O,
    refrigerantHFCs,
    solidWasteCO2,
    solidWasteCH4,
    solidWasteN2O,
    wastewaterCH4,
    wastewaterN2O,
    supplementaryCO2,
    aquaticN2O,
    ...lulucf,
  };
};

const calculateScope2 = (
  input: AllModulesInputTransformed,
  context: ExecutionContext<AllConstants>,
): IntermediateScope23<Scope2Output> => {
  // Purchased Electricity 14.1
  const electricity = input.electricity
    ? calculateElectricityScope2(input.electricity, context)
    : zeroCO2e;

  return {
    electricity,
  };
};

const calculateScope3AllModules = (
  input: AllModulesInputTransformed,
  context: ExecutionContext<AllConstants>,
): IntermediateScope1<AllModulesScope3Output> => {
  // Purchased Livestock 15.1
  const purchasedLivestock = input.purchasedLivestock
    ? calculatePurchasedLivestockEmissions(
        { purchasedLivestock: input.purchasedLivestock },
        context,
      )
    : zeroCO2e;

  // Purchased Feed 15.2
  const purchasedFeed = input.purchasedFeed
    ? calculatePurchasedFeed({ purchasedFeed: input.purchasedFeed }, context)
    : zeroCO2e;

  // Purchased Mineral Supplements 15.3
  const purchasedMineralSupplements = input.purchasedMineralSupplements
    ? calculatePurchasedMineralSupplements(
        { purchasedMineralSupplements: input.purchasedMineralSupplements },
        context,
      )
    : zeroCO2e;

  // Purchased Fertiliser 15.4
  const fertiliser = input.fertiliser
    ? calculateScope3Fertiliser(input.fertiliser, context)
    : zeroCO2e;

  // Purchased Agrichemicals 15.5
  const agrichemicals = input.chemicals
    ? calculateScope3Agrichemicals({ chemicals: input.chemicals }, context)
    : zeroCO2e;

  // Purchased Soil Ameliorants 15.6
  const soilAmeliorants = input.lime
    ? calculateScope3SoilAmeliorants({ lime: input.lime }, context)
    : zeroCO2e;

  // Purchased Services/Contractors 15.7
  const services = input.services
    ? calculateScope3Services(input.services, context)
    : zeroCO2e;

  // Purchased packaging 15.8
  const purchasedPackaging = input.purchasedPackaging
    ? calculatePurchasedPackaging(
        { purchasedPackaging: input.purchasedPackaging },
        context,
      )
    : zeroCO2e;

  // Other Purchased Goods and Services 15.9
  // (this module already tolerates an undefined/empty list, returning zero itself)
  const otherPurchasedGoodsAndServices =
    calculateOtherPurchasedGoodsAndServicesEmissions({
      otherPurchasedGoodsAndServices: input.otherPurchasedGoodsAndServices,
    });

  // Upstream Emissions from Fuel 15.10
  const fuel = input.fuel
    ? calculateScope3EmissionsFromFuel(input.fuel, context)
    : zeroCO2e;

  // Upstream emissions of Purchased Electricity 15.11
  const electricity = input.electricity
    ? calculateElectricityScope3(input.electricity, context)
    : zeroCO2e;

  // Management of Waste 15.12
  const solidWaste = calculateScope3SolidWasteEmissions(input, context);

  // Upstream freight 15.13
  const freight = input.freight
    ? calculateFreightEmissions({ freight: input.freight }, context)
    : zeroCO2e;

  return {
    electricity,
    fertiliser,
    agrichemicals,
    soilAmeliorants,
    freight,
    fuel,
    solidWaste,
    otherPurchasedGoodsAndServices,
    purchasedPackaging,
    purchasedLivestock,
    purchasedFeed,
    purchasedMineralSupplements,
    services,
  };
};

export const calculateAllModules = (
  input: AllModulesInputTransformed,
  context: ExecutionContext<AllConstants>,
) => {
  const lulucf = calculateLULUCF(input, context);

  const scope1 = calculateScope1AllModules(input, lulucf, context);

  const scope2 = calculateScope2(input, context);

  const scope3 = calculateScope3AllModules(input, context);

  const ledger = buildCalculatorLedger({ scope1, scope2, scope3 });
  const serialised = serialiseCalculatorLedger(ledger);

  return {
    ...serialised,
    net: {
      ...serialised.net,
      lulucf: exposeTonnesCO2e(sumCO2e(Object.values(lulucf))),
    },
  };
};
