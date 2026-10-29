import { Container } from '@/tools/containers';
import { InputContainer } from '@/tools/inputs';

export const CalculationMethods = ['1', '2'] as const;
export type CalculationMethod = (typeof CalculationMethods)[number];

// Currently only used for inorganic fertilisers
// 5.1.1.2
export const ProductionSystemsInorganicFertilisers = [
  'Irrigated crop (maize)',
  'Non-irrigated crop (high rainfall)',
  'Cotton',
] as const;
export type ProductionSystemsInorganicFertiliser =
  (typeof ProductionSystemsInorganicFertilisers)[number];

export const RiceProductionSystems = [
  'Rice (continuous flooding)',
  'Rice (single and multiple drainage, or alternate wetting and drying)',
] as const;

export const CropOnlyProductionSystems = [
  'Irrigated crop',
  'Non-irrigated crop (low rainfall)',
  'Non-irrigated crop (high rainfall)',
] as const;
export type CropOnlyProductionSystem =
  (typeof CropOnlyProductionSystems)[number];

export const PastureOnlyProductionSystems = [
  'Irrigated pasture',
  'Non-irrigated pasture',
] as const;
export type PastureOnlyProductionSystem =
  (typeof PastureOnlyProductionSystems)[number];

export const BasicCropProductionSystems = [
  ...RiceProductionSystems,
  ...CropOnlyProductionSystems,
  ...PastureOnlyProductionSystems,
  'Sugar',
  'Cotton',
  'Horticultural crops',
  'Aquaculture',
  'Forestry',
] as const;
export type BasicCropProductionSystem =
  (typeof BasicCropProductionSystems)[number];

export const ExtendedCropProductionSystems = [
  ...BasicCropProductionSystems,
  ...ProductionSystemsInorganicFertilisers,
] as const;
export type ExtendedCropProductionSystem =
  (typeof ExtendedCropProductionSystems)[number];

export const GrazingProductionSystems = [
  'Non-irrigated pasture',
  'Irrigated pasture',
  'Irrigated crop',
  'Non-irrigated crop',
] as const;
export type GrazingProductionSystem = (typeof GrazingProductionSystems)[number];
export const GrazingProductionSystemsWithRainfall = [
  'Non-irrigated pasture',
  'Irrigated pasture',
  'Irrigated crop',
  'Non-irrigated crop (low rainfall)',
  'Non-irrigated crop (high rainfall)',
] as const;
export type GrazingProductionSystemsWithRainfall =
  (typeof GrazingProductionSystemsWithRainfall)[number];

// Appendix A 2.2.6
export const InorganicFertiliserTypes = [
  'Monoammonium Phosphate (MAP)',
  'Diammonium Phosphate (DAP)',
  'Urea',
  'Sulphate of Ammonia (SOA)',
  'Urea-Ammonium Nitrate (UAN)',
  'Ammonium Nitrate (AN)',
  'Calcium Ammonium Nitrate (CAN)',
  'Calcium Nitrate',
  'Single Super Phosphate',
  'Ammonium Sulfate',
] as const;
export type InorganicFertiliserType = (typeof InorganicFertiliserTypes)[number];

export const OrganicFertiliserTypes = [
  'Dairy cattle',
  'Beef cattle',
  'Poultry',
  'Pigs',
  'Sheep',
  'Horses/Mules',
] as const;
export type OrganicFertiliserType = (typeof OrganicFertiliserTypes)[number];

export const PrimaryPigsMMSWithSolidSeparationTypes = [
  'anaerobicLagoon',
  'digester',
  'pitStorage',
] as const;
export type PrimaryPigsMMSWithSolidSeparationType =
  (typeof PrimaryPigsMMSWithSolidSeparationTypes)[number];

export const PrimaryPigsMMSTypesWithoutPasture = [
  ...PrimaryPigsMMSWithSolidSeparationTypes,
  'deepLitter',
  'solidStorage',
] as const;

export const PrimaryPigsMMSTypes = [
  ...PrimaryPigsMMSTypesWithoutPasture,
  'outdoorAndFreeRange',
] as const;
export type PrimaryPigsMMSType = (typeof PrimaryPigsMMSTypes)[number];

export const primaryPigMMSIsWithSolidSeparationType = (
  mms: PrimaryPigsMMSType,
): mms is PrimaryPigsMMSWithSolidSeparationType =>
  PrimaryPigsMMSWithSolidSeparationTypes.includes(
    mms as PrimaryPigsMMSWithSolidSeparationType,
  );

export const SecondaryPigsMMSTypesWithoutDirectApplication = [
  'solidStorage',
  'anaerobicLagoon',
  'digester',
  'pitStorage',
] as const;

export const SecondaryPigsMMSTypes = [
  ...SecondaryPigsMMSTypesWithoutDirectApplication,
  'directApplication',
] as const;
export type SecondaryPigsMMSType = (typeof SecondaryPigsMMSTypes)[number];

export const AquacultureSystemLocations = [
  'Coastal wetland habitat',
  'Offshore cages in seagrass meadows',
  'Other',
] as const;
export type AquacultureSystemLocation =
  (typeof AquacultureSystemLocations)[number];

export const StationaryFuelTypes = [
  'petroleum based oils',
  'petroleum based greases',
  'crude oil',
  'other natural gas liquids',
  'automotive petrol',
  'aviation gasoline',
  'kerosene',
  'aviation turbine fuel/kerosene',
  'heating oil',
  'diesel oil',
  'fuel oil',
  'liquefied aromatic hydrocarbons',
  'solvents',
  'lpg',
  'naphtha',
  'petroleum coke',
  'refinery gas and liquids',
  'refinery coke',
  'other petroleum products',
  'biodiesel',
  'ethanol',
  'other biofuels',
  'renewable aviation kerosone',
  'renewable diesel',
] as const;
export type StationaryFuelType = (typeof StationaryFuelTypes)[number];

export const FuelTransportVehicleTypes = [
  'Cars and light commercial vehicles',
  'Cars and light commercial vehicles (pre 2004)',
  'Light duty vehicles',
  'Heavy duty vehicles',
  'Aviation',
  'Vessel',
  'Off-road Agriculture and forestry equipment',
] as const;
export type FuelTransportVehicleType =
  (typeof FuelTransportVehicleTypes)[number];

export const CarsLightCommercialFuelTypes = [
  'Gasoline',
  'Diesel oil',
  'Liquefied petroleum gas (LPG)',
  'Fuel oil',
  'Ethanol',
  'Biodiesel',
  'Renewable diesel',
  'Other biofuels',
] as const;
export type CarsLightCommercialFuelType =
  (typeof CarsLightCommercialFuelTypes)[number];
export const CarsLightCommercialPre2004FuelTypes = [
  'Gasoline',
  'Diesel oil',
  'Liquefied petroleum gas (LPG)',
  'Ethanol',
  'Renewable diesel',
] as const;
export type CarsLightCommercialPre2004FuelType =
  (typeof CarsLightCommercialPre2004FuelTypes)[number];

export const LightDutyFuelTypes = [
  'Compressed natural gas',
  'Liquefied natural gas',
] as const;
export type LightDutyFuelType = (typeof LightDutyFuelTypes)[number];

export const HeavyDutyFuelTypes = [
  'Compressed natural gas',
  'Liquefied natural gas',
  'Diesel oil - Euro iv or higher',
  'Diesel oil - Euro iii',
  'Diesel oil - Euro i',
  'Renewable diesel - Euro iv or higher',
  'Renewable diesel - Euro iii',
  'Renewable diesel - Euro i',
] as const;
export type HeavyDutyFuelType = (typeof HeavyDutyFuelTypes)[number];

export const AviationFuelTypes = [
  'Gasoline for use as fuel in an aircraft',
  'Kerosene for use as fuel in an aircraft',
  'Renewable aviation kerosene',
] as const;
export type AviationFuelType = (typeof AviationFuelTypes)[number];

export const VesselFuelTypes = ['Petrol', 'Diesel', 'Fuel Oil'] as const;
export type VesselFuelType = (typeof VesselFuelTypes)[number];

export const OffRoadAgricultureAndForestryEquipmentFuelTypes = [
  'Diesel',
] as const;
export type OffRoadAgricultureAndForestryEquipmentFuelType =
  (typeof OffRoadAgricultureAndForestryEquipmentFuelTypes)[number];

export const PastureTypes = [
  'Annual grass',
  'Grass clover mixture',
  'Lucerne',
  'Other legume',
  'Perennial pasture',
] as const;
export type PastureType = (typeof PastureTypes)[number];

export const GrainsCropTypes = [
  'Wheat',
  'Barley',
  'Maize',
  'Oats',
  'Sorghum',
  'Triticale',
  'Other Cereals',
  'Pulses',
] as const;
export type GrainsCropType = (typeof GrainsCropTypes)[number];

export const HorticultureCropTypes = [
  'Hops and grape vines',
  'Peanuts',
  'Tubers and Roots',
  'Pulses',
] as const;

export const CropTypes = [
  ...GrainsCropTypes,
  'Hops and grape vines',
  'Peanuts',
  'Tubers and Roots',
  'Rice',
  'Sugar Cane',
  'Cotton',
  'Oilseeds',
  'Forage Crops',
  'Other Annual Crops',
  'Other Perennial Crops',
] as const;
export type CropType = (typeof CropTypes)[number];

export const RefrigerationTypes = [
  'Domestic refrigerators',
  'Transport refrigeration',
  'Domestic A/C portable',
  'Domestic A/C split',
  'Domestic A/C packaged',
  'Light vehicle A/C',
  'Heavy vehicle A/C',
] as const;
export type RefrigerationType = (typeof RefrigerationTypes)[number];

export const InorganicFertiliserComponentOrigins = [
  'Unspecified',
  'China',
  'Yemen',
  'Canada',
] as const;
export type InorganicFertiliserComponentOrigin =
  (typeof InorganicFertiliserComponentOrigins)[number];

export const InorganicFertiliserComponentTypesRegional = [
  'Ammonia',
  'Urea',
] as const;
export type InorganicFertiliserComponentTypeRegional =
  (typeof InorganicFertiliserComponentTypesRegional)[number];

export const InorganicFertiliserComponentNitrogenTypes = [
  'Nitrogen - Generic',
  'Nitrogen - Nitrate',
  'Nitrogen - Ammonia',
] as const;
export type InorganicFertiliserComponentNitrogenType =
  (typeof InorganicFertiliserComponentNitrogenTypes)[number];

export const InorganicFertiliserComponentNonRegionalWithEquivalentTypes = [
  'Monoammonium phosphate',
  'Diammonium Phosphate',
  'Urea-Ammonium Nitrate',
  'Ammonium Nitrate',
  'Calcium Ammonium Nitrate',
  'Sulphate of Ammonia',
  'Single superphosphate',
] as const;
export type InorganicFertiliserComponentNonRegionalWithEquivalentType =
  (typeof InorganicFertiliserComponentNonRegionalWithEquivalentTypes)[number];

// Components that can be mapped back to a fertiliser type.
export const InorganicFertiliserComponentWithEquivalentTypes = [
  ...InorganicFertiliserComponentNonRegionalWithEquivalentTypes,
  'Urea',
] as const;
export type InorganicFertiliserComponentWithEquivalentType =
  (typeof InorganicFertiliserComponentWithEquivalentTypes)[number];

export const InorganicFertiliserComponentTypesNonRegional = [
  ...InorganicFertiliserComponentNonRegionalWithEquivalentTypes,
  ...InorganicFertiliserComponentNitrogenTypes,
  'Muriate of Potash',
  'Double Superphosphate',
  'Phosphorus - Generic',
  'Potassium - Generic',
  'Sulfur - Generic',
  'Zinc - Generic',
  // 'Calcium - Generic lime as proxy', // not included in AusLCI April dataset
] as const;
export type InorganicFertiliserComponentTypeNonRegional =
  (typeof InorganicFertiliserComponentTypesNonRegional)[number];

export const InorganicFertiliserComponentTypes = [
  ...InorganicFertiliserComponentTypesRegional,
  ...InorganicFertiliserComponentTypesNonRegional,
] as const;
export type InorganicFertiliserComponentType =
  | InorganicFertiliserComponentTypeRegional
  | InorganicFertiliserComponentTypeNonRegional;

export const inorganicFertiliserComponentHasFertiliserEquivalent = (
  component: InputContainer<InorganicFertiliserComponentType>,
): component is InputContainer<InorganicFertiliserComponentWithEquivalentType> =>
  InorganicFertiliserComponentWithEquivalentTypes.includes(
    component.unit as InorganicFertiliserComponentWithEquivalentType,
  );

export const isInorganicFertiliserComponentTypeRegional = (
  type: InorganicFertiliserComponentType,
): type is InorganicFertiliserComponentTypeRegional => {
  return InorganicFertiliserComponentTypesRegional.includes(
    type as InorganicFertiliserComponentTypeRegional,
  );
};

export const SolidWasteOrganicManagedTreatmentTypes = [
  'Composting',
  'Anaerobic Digestion',
] as const;
export type SolidWasteOrganicManagedTreatmentType =
  (typeof SolidWasteOrganicManagedTreatmentTypes)[number];

export const SolidWasteLandfilTreatmentTypes = [
  'Landfill (without gas recovery)',
  'Landfill (with gas recovery)',
] as const;
export type SolidWasteLandfilTreatmentType =
  (typeof SolidWasteLandfilTreatmentTypes)[number];

export const SolidWasteManagedTreatmentTypes = [
  ...SolidWasteOrganicManagedTreatmentTypes,
  ...SolidWasteLandfilTreatmentTypes,
  'Incineration',
] as const;
export type SolidWasteManagedTreatmentType =
  (typeof SolidWasteManagedTreatmentTypes)[number];

export const SolidWasteUnmanagedTreatmentTypes = [
  'Unmanaged - deep',
  'Unmanaged - shallow',
  'Burial',
] as const;
export type SolidWasteUnmanagedTreatmentType =
  (typeof SolidWasteUnmanagedTreatmentTypes)[number];

export const solidWasteTreatmentTypeIsOrganicOnly = (
  type: SolidWasteManagedTreatmentType | SolidWasteUnmanagedTreatmentType,
): type is SolidWasteOrganicManagedTreatmentType => {
  return type === 'Composting' || type === 'Anaerobic Digestion';
};

export const SolidWasteOrganicTypes = [
  'Food waste',
  'Green waste',
  'Wood products (at time of harvest)',
  'Wood products (at end of life)',
  'Sludge',
] as const;
export type SolidWasteOrganicType = (typeof SolidWasteOrganicTypes)[number];

export const SolidWasteWithoutNappiesInorganicTypes = [
  'Paper and cardboard',
  'Textiles',
  'Rubber and leather',
  'Inert waste',
] as const;
export type SolidWasteWithoutNappiesInorganicType =
  (typeof SolidWasteWithoutNappiesInorganicTypes)[number];

export const SolidWasteInorganicTypes = [
  ...SolidWasteWithoutNappiesInorganicTypes,
  'Nappies',
] as const;
export type SolidWasteInorganicType = (typeof SolidWasteInorganicTypes)[number];

export const SolidWasteNonStreamTypes = [
  ...SolidWasteOrganicTypes,
  ...SolidWasteInorganicTypes,
] as const;
export type SolidWasteNonStreamType = (typeof SolidWasteNonStreamTypes)[number];

export const SolidWasteStreamTypes = [
  'Municipal solid waste',
  'Commercial and industrial waste',
  'Construction and demolition waste',
] as const;
export type SolidWasteStreamType = (typeof SolidWasteStreamTypes)[number];

export const SolidWasteScope3LandfillTypes = [
  ...SolidWasteOrganicTypes,
  ...SolidWasteWithoutNappiesInorganicTypes,
  ...SolidWasteStreamTypes,
] as const;
export type SolidWasteScope3LandfillType =
  (typeof SolidWasteScope3LandfillTypes)[number];

export const SolidWasteScope3IncinerationTypes = [
  ...SolidWasteOrganicTypes,
  ...SolidWasteWithoutNappiesInorganicTypes,
  'Municipal solid waste',
  'Commercial and industrial waste',
] as const;
export type SolidWasteScope3IncinerationType =
  (typeof SolidWasteScope3IncinerationTypes)[number];

export const SolidWasteTypes = [
  ...SolidWasteNonStreamTypes,
  ...SolidWasteStreamTypes,
] as const;
export type SolidWasteType = (typeof SolidWasteTypes)[number];

export const FuelStationarySolidTypes = [
  'Bituminous coal',
  'Sub-bituminous coal',
  'Anthracite',
  'Brown coal (lignite)',
  'Coking coal',
  'Coal briquettes',
  'Coal coke',
  'Coal tar',
  'Other solid fossil fuels',
  'Industrial materials derived from fossil fuels',
  'Passenger car tyres',
  'Truck and off-road tyres',
  'Non-biomass municipal materials',
  'Dry wood',
  'Green and air dried wood',
  'Sulphite lyes',
  'Bagasse',
  'Biomass, municipal and industrial materials',
  'Charcoal',
  'Other primary solid biomass fuels',
] as const;
export type FuelStationarySolidType = (typeof FuelStationarySolidTypes)[number];

export const FuelStationaryMassBasedLiquidTypes = [
  'Crude oil and condensates',
  'Other natural gas liquids',
  'Petroleum coke',
  'Refinery gas and liquids',
  'Refinery coke',
] as const;
export type FuelStationaryMassBasedLiquidType =
  (typeof FuelStationaryMassBasedLiquidTypes)[number];

export const FuelStationaryVolumeBasedLiquidTypes = [
  'Petroleum based oils other than fuels',
  'Petroleum based greases',
  'Automotive gasoline/petrol',
  'Aviation gasoline',
  'Kerosene',
  'Aviation turbine fuel/kerosene',
  'Heating oil',
  'Diesel oil',
  'Fuel oil',
  'Liquefied aromatic hydrocarbons',
  'Solvents: mineral turpentine or white spirits',
  'Liquefied petroleum gas',
  'Naphtha',
  'Other petroleum products',
] as const;
export type FuelStationaryVolumeBasedLiquidType =
  (typeof FuelStationaryVolumeBasedLiquidTypes)[number];

export const FuelStationaryLiquidTypes = [
  ...FuelStationaryMassBasedLiquidTypes,
  ...FuelStationaryVolumeBasedLiquidTypes,
] as const;
export type FuelStationaryLiquidType =
  (typeof FuelStationaryLiquidTypes)[number];

export const AgrochemicalTypes = [
  // Guidelines appendix
  'Herbicide (paraquat, diquat, glyphosate)',
  'Other herbicide',
  'Insecticide',
  'Fungicide',
  'Plant growth regulator',
  // AusLCI
  '2,4-D',
  'Atrazine',
  'Diuron',
  // 'Glyphosate', AusLCI includes a value for glyphosate, but the guidelines already supplies a value for generic herbicides including glyphosate
  'Mancozeb',
  'MCPA',
  'Metolachlor',
  'Metsulfuron-methyl',
  'Pesticides (generic)',
  'Tri-allate',
  'Tribenuron methyl',
  'Trifluralin',
] as const;

export type AgrochemicalType = (typeof AgrochemicalTypes)[number];

export const PurchasedFeedRegions = [
  'Australia',
  'NSW',
  'NT',
  'QLD',
  'SA',
  'TAS',
  'VIC',
  'WA',
  'Brazil',
] as const;
export type PurchasedFeedRegion = (typeof PurchasedFeedRegions)[number];

export const PurchasedFeedAquacultureTypes = [
  'Whole Sardines',
  'Low Animal Protein Formulated Feed',
  'Squid',
  'Whole Fish', // listed as 'Whole fish' in Appendix A1 A.3.1.2, capitalised for consistency.
  'Custom Bait',
] as const;

export type PurchasedFeedAquacultureType =
  (typeof PurchasedFeedAquacultureTypes)[number];

export const PurchasedFeedLivestockTypesPerRegion = {
  Brazil: ['Soybean meal'] as const,
  Australia: [
    'Barley grain',
    'Maize grain',
    'Sorghum grain',
    'Wheat grain',
    'Cereal hay',
    'Cereal silage',
    'Lucerne hay',
    'Oaten hay',
    'Pasture hay',
    'Wheat bran',
    'Canola meal',
    'Feed for chickens',
    'Feed for pigs',
    'Feed for dairy calves',
    'Feed for dairy cows',
    'Canola oil',
    'Cotton seed',
  ] as const,
  NSW: [
    'Barley grain',
    'Maize grain',
    'Sorghum grain',
    'Wheat grain',
    'Cereal hay',
    'Cereal silage',
    'Lucerne hay',
    'Oaten hay',
    'Pasture hay',
  ] as const,
  NT: ['Barley grain', 'Maize grain', 'Wheat grain'] as const,
  QLD: [
    'Barley grain',
    'Maize grain',
    'Sorghum grain',
    'Wheat grain',
    'Cereal hay',
    'Cereal silage',
    'Lucerne hay',
    'Oaten hay',
    'Pasture hay',
    'Molasses',
  ] as const,
  SA: [
    'Barley grain',
    'Maize grain',
    'Sorghum grain',
    'Wheat grain',
    'Cereal hay',
    'Cereal silage',
    'Lucerne hay',
    'Oaten hay',
    'Pasture hay',
  ] as const,
  TAS: [
    'Barley grain',
    'Wheat grain',
    'Cereal hay',
    'Cereal silage',
    'Lucerne hay',
    'Pasture hay',
  ] as const,
  VIC: [
    'Barley grain',
    'Maize grain',
    'Sorghum grain',
    'Wheat grain',
    'Cereal hay',
    'Cereal silage',
    'Lucerne hay',
    'Maize silage',
    'Oaten hay',
    'Pasture hay',
  ] as const,
  WA: [
    'Barley grain',
    'Maize grain',
    'Wheat grain',
    'Cereal hay',
    'Oaten hay',
    'Pasture hay',
  ] as const,
} as const;

export const PurchasedFeedLivestockRegionlessTypes = [
  'Bentonite',
  'Meat Meal',
  'Blood Meal',
  'Millrun',
] as const;
export type PurchasedFeedLivestockRegionlessType =
  (typeof PurchasedFeedLivestockRegionlessTypes)[number];

export type PurchasedFeedLivestockRegionalType<
  R extends PurchasedFeedRegion = PurchasedFeedRegion,
> = (typeof PurchasedFeedLivestockTypesPerRegion)[R][number];

export type PurchasedFeedLivestockType =
  PurchasedFeedLivestockRegionlessType | PurchasedFeedLivestockRegionalType;

export const PurchasedMineralSupplementTypes = [
  'Lick block, dry season mix',
  'Lick block, weaner',
  'Lick block, mineral',
] as const;
export type PurchasedMineralSupplementType =
  (typeof PurchasedMineralSupplementTypes)[number];

export const PrimaryFeedlotMMSTypes = ['drylot'] as const;
export type PrimaryFeedlotMMSType = (typeof PrimaryFeedlotMMSTypes)[number];
export const SecondaryFeedlotMMSTypes = [
  'solidStorage',
  'composting',
  'directApplication',
] as const;
export type SecondaryFeedlotMMSType = (typeof SecondaryFeedlotMMSTypes)[number];
export const TertiaryFeedlotMMSTypes = ['anaerobicLagoon'] as const;
export type TertiaryFeedlotMMSType = (typeof TertiaryFeedlotMMSTypes)[number];

export const FeedlotMMSTypes = [
  ...PrimaryFeedlotMMSTypes,
  ...SecondaryFeedlotMMSTypes,
  ...TertiaryFeedlotMMSTypes,
] as const;
export type FeedlotMMSType =
  PrimaryFeedlotMMSType | SecondaryFeedlotMMSType | TertiaryFeedlotMMSType;

export const FeedlotDurationTypes = ['0-80 days', '81-200 days', '201+ days'];

export type FeedlotDurationType = (typeof FeedlotDurationTypes)[number];

export const DairySystems = [
  'Grazed only',
  'Limited feedpad',
  'Limited grazing',
  'Zero grazing',
] as const;
export type DairySystem = (typeof DairySystems)[number];

export const DairyTimeInLocationTypes = [
  'pasture',
  'feedpad',
  'milkingShed',
] as const;
export type DairyTimeInLocations = (typeof DairyTimeInLocationTypes)[number];
export const MatureDairyClasses = [
  'milkingCows',
  'heifersGt1',
  'bullsGt1',
] as const;
export type MatureDairyClass = (typeof MatureDairyClasses)[number];

// I.e *potentially* pre-weaned
export const PreWeanedDairyClasses = ['bullsLt1', 'heifersLt1'] as const;
export type PreWeanedDairyClass = (typeof PreWeanedDairyClasses)[number];

export const DairyClasses = [
  ...MatureDairyClasses,
  ...PreWeanedDairyClasses,
] as const;
export type DairyClass = (typeof DairyClasses)[number];

export const DairyMMSTypes = [
  'anaerobicLagoon',
  'sumpDispersal',
  'drainToPaddock',
  'solidStorage',
] as const;
export type DairyMMSType = (typeof DairyMMSTypes)[number];

export const DairyMMSTypesWithPasture = [
  ...DairyMMSTypes,
  'pastureRangeAndPaddock',
] as const;
export type DairyMMSTypeWithPasture = (typeof DairyMMSTypesWithPasture)[number];

export const BeefPurchaseCategories = ['beefPrime', 'beefWeaned'] as const;
export type BeefPurchaseCategory = (typeof BeefPurchaseCategories)[number];
export const DairyPurchaseCategories = [
  'dairySpent',
  ...BeefPurchaseCategories,
] as const;
export type DairyPurchaseCategory = (typeof DairyPurchaseCategories)[number];

export const SheepPurchaseCategories = [
  'sheepMutton',
  'sheepPrimeLamb',
] as const;
export type SheepPurchaseCategory = (typeof SheepPurchaseCategories)[number];

export const PigPurchaseCategories = [
  'pigsDefault',
  'pigsConventionalRearingCoveredPond',
  'pigsConventionalRearingUncoveredEffluentPond',
  'pigsDeepLitterRearing',
  'pigsOutdoorRearing',
] as const;
export type PigPurchaseCategory = (typeof PigPurchaseCategories)[number];

export const LivestockPurchaseCategories = [
  ...DairyPurchaseCategories,
  ...SheepPurchaseCategories,
  ...PigPurchaseCategories,
] as const;
export type LivestockPurchaseCategory =
  (typeof LivestockPurchaseCategories)[number];

export const PoultryClasses = [
  'layers',
  'meatChickenGrowers',
  'meatChickenBreeders',
  'meatOther',
] as const;
export type PoultryClass = (typeof PoultryClasses)[number];

export const PoultryWeightClasses = [
  'chickens',
  'hensGte1',
  'pullets',
  'broilers',
  'chicks',
] as const;
export type PoultryWeightClass = (typeof PoultryWeightClasses)[number];

export const PoultryMMS1Types = [
  'manureWithLitter',
  'beltManureRemoval',
  'manureStoredInHouse',
] as const;
export type PoultryMMS1Type = (typeof PoultryMMS1Types)[number];
export const PoultryMMS1TypesWithPasture = [
  ...PoultryMMS1Types,
  'pastureRangeAndPaddock',
] as const;
export type PoultryMMS1TypeWithPasture =
  (typeof PoultryMMS1TypesWithPasture)[number];

export const PoultryMMS2Types = [
  'solidStorage',
  'composting',
  'digester',
  'directProcessing',
  'directApplication',
] as const;
export type PoultryMMS2Type = (typeof PoultryMMS2Types)[number];

export const PoultryMMSTypes = [
  ...PoultryMMS1Types,
  ...PoultryMMS2Types,
] as const;
export type PoultryMMSType = (typeof PoultryMMSTypes)[number];

export const PoultryMMSTypesWithPasture = [
  ...PoultryMMS1TypesWithPasture,
  ...PoultryMMSTypes,
] as const;
export type PoultryMMSTypeWithPasture =
  (typeof PoultryMMSTypesWithPasture)[number];

export const RefrigerantTypes = [
  'R-400 50/50',
  'R-400 60/40',
  'R-400 80/20',
  'HFC-23 (R-23)',
  'HFC-32 (R-32)',
  'HFC-41 (R-41)',
  'HFC-43-10mee (R-4310mee)',
  'HFC-125 (R-125)',
  'HFC-134 (R-134)',
  'HFC-134a (R-134a)',
  'HFC-143 (R-143)',
  'HFC-143a (R-143a)',
  'HFC-152a (R-152a)',
  'HFC-227ea (R-227ea)',
  'HFC-236fa (R-236fa)',
  'HFC-245ca (R-245ca)',
  'HFC-245fa (R-245fa)',
  'HFC-365mfc (R-365mfc)',
  'HCFC-22 (R-22)',
  'HCFC-123 (R-123)',
  'HCFC-124 (R-124)',
  'HCFC-141b (R-141b)',
  'HCFC-142b (R-142b)',
  'HCFC-225ca (R-225ca)',
  'HCFC-225cb (R-225cb)',
  'PFC-14 Perfluoromethane (tetrafluoromethane)',
  'PFC-116 Perfluoroethane (hexafluoroethane)',
  'PFC-218 Perfluoropropane',
  'PFC-31-10 Perfluorobutane',
  'PFC-318 Perfluorocyclobutane',
  'PFC-41-12 Perfluoropentane',
  'PFC-51-14 Perfluorohexane',
  'PFC-91-18 Perflunafene',
  'R-401A',
  'R-401B',
  'R-401C',
  'R-404A',
  'R-405A',
  'R-407A',
  'R-407B',
  'R-407C',
  'R-407D',
  'R-407E',
  'R-408A',
  'R-409A',
  'R-409B',
  'R-410A',
  'R-410B',
  'R-412A',
  'R-415A',
  'R-415B',
  'R-420A',
  'R-421A',
  'R-422A',
  'R-422B',
  'R-422C',
  'R-500',
  'R-501',
  'R-502',
  'R-503',
  'R-504',
  'R-507A',
  'R-508A',
  'R-508B',
  'R-509A',
] as const;
export type RefrigerantType = (typeof RefrigerantTypes)[number];

export const PurchasedPackagingByUnitsTypes = [
  '1 tonne polypropylene bag',
  '25 kg polypropylene bag',
  '20L high density polyethylene (HDPE) container',
  '1000L intermediate bulk containers',
  'Plastic crate polypropylene',
] as const;
export type PurchasedPackagingByUnitsType =
  (typeof PurchasedPackagingByUnitsTypes)[number];

export const PurchasedPackagingByMassTypes = [
  'Corrugated board',
  'Plastic film LDPE',
  'Plastic sheet HDPE',
] as const;
export type PurchasedPackagingByMassType =
  (typeof PurchasedPackagingByMassTypes)[number];

export const FreightTypes = [
  'Van < 3.5 tonnes (diesel)',
  'Van < 3.5 tonnes (petrol)',
  'Van < 3.5 tonnes (CNG)',
  'Van < 3.5 tonnes (LPG)',
  'Van < 3.5 tonnes (PHEV)',
  'Van < 3.5 tonnes (BEV)',
  'Truck > 3.5 tonnes non-refrigerated (diesel)',
  'Truck > 3.5 tonnes refrigerated (diesel)',
  'Freight flight (domestic)',
  'Freight flight (short haul)',
  'Freight flight (international)',
  'Rail',
  'Cargo ship (bulk carrier)',
  'Cargo ship (general cargo)',
  'Cargo ship (container)',
  'Cargo ship (refrigerated)',
] as const;
export type FreightType = (typeof FreightTypes)[number];

export const WetClimateZones = [
  'Tropical montane',
  'Tropical wet',
  'Tropical moist',
  'Warm temperate moist',
  'Cool temperate moist',
  'Boreal moist',
] as const;
export type WetClimateZone = (typeof WetClimateZones)[number];
export const isWetClimateZone = (
  climateZone: ClimateZone,
): climateZone is WetClimateZone => {
  return WetClimateZones.includes(climateZone as WetClimateZone);
};

export const DryClimateZones = [
  'Tropical dry',
  'Warm temperate dry',
  'Cool temperate dry',
  'Boreal dry',
] as const;
export type DryClimateZone = (typeof DryClimateZones)[number];
export const isDryClimateZone = (
  climateZone: ClimateZone,
): climateZone is DryClimateZone => {
  return DryClimateZones.includes(climateZone as DryClimateZone);
};

export const ClimateZones = [...WetClimateZones, ...DryClimateZones] as const;
export type ClimateZone = (typeof ClimateZones)[number];

export const ClimateZoneTypes = ['dry', 'wet'] as const;
export type ClimateZoneType = (typeof ClimateZoneTypes)[number];

export const RainfallLevels = ['high_rainfall', 'low_rainfall'] as const;
export type RainfallLevel = (typeof RainfallLevels)[number];

export const ClimateZoneOrZoneTypes = [
  ...ClimateZones,
  ...ClimateZoneTypes,
] as const;
export type ClimateZoneOrZoneType = (typeof ClimateZoneOrZoneTypes)[number];

export const isClimateZoneType = (
  value: ClimateZoneOrZoneType,
): value is ClimateZoneType => {
  return ClimateZoneTypes.includes(value as ClimateZoneType);
};

const WARegions = [
  'WA - South West',
  'WA - Pilbara',
  'WA - Kimberley',
] as const;
export const LimitedRegions = [
  'ACT/NSW',
  'NT',
  'QLD',
  'SA',
  'TAS',
  'VIC',
  ...WARegions,
] as const;
export type LimitedRegion = (typeof LimitedRegions)[number];

const NTRegions = [
  'NT - Alice Springs',
  'NT - Barkly',
  'NT - Northern',
] as const;
type NTRegion = (typeof NTRegions)[number];
export const isNTRegion = (region: StateOrRegion): region is NTRegion => {
  return NTRegions.includes(region as NTRegion);
};

const QLDRegions = [
  'QLD - High',
  'QLD - Moderate/High',
  'QLD - Moderate/Low',
  'QLD - Low',
] as const;
type QLDRegion = (typeof QLDRegions)[number];
export const isQLDRegion = (region: StateOrRegion): region is QLDRegion => {
  return QLDRegions.includes(region as QLDRegion);
};

export const ExtendedRegions = [
  'ACT/NSW',
  'SA',
  'TAS',
  'VIC',
  ...WARegions,
  ...NTRegions,
  ...QLDRegions,
] as const;
export type ExtendedRegion = (typeof ExtendedRegions)[number];

export const StateOrRegions = [
  'ACT',
  'NSW',
  'SA',
  'TAS',
  'VIC',
  ...WARegions,
  ...NTRegions,
  ...QLDRegions,
] as const;
export type StateOrRegion = (typeof StateOrRegions)[number];

export const Seasons = ['spring', 'summer', 'autumn', 'winter'] as const;
export type Season = (typeof Seasons)[number];

export const getPreviousSeason = (season: Season): Season => {
  const seasonIndex = Seasons.indexOf(season);

  if (seasonIndex === 0) {
    return 'winter';
  }
  return Seasons[seasonIndex - 1];
};

export const Months = [
  'january',
  'february',
  'march',
  'april',
  'may',
  'june',
  'july',
  'august',
  'september',
  'october',
  'november',
  'december',
] as const;
export type Month = (typeof Months)[number];

export const getPreviousMonth = (
  fromMonth: Month,
  skipBack: number = 1,
): Month => {
  const fromMonthIndex = Months.indexOf(fromMonth);
  const previousMonthIndex = fromMonthIndex - skipBack;
  const validPreviousMonthIndex =
    previousMonthIndex < 0 ? previousMonthIndex + 12 : previousMonthIndex;
  return Months[validPreviousMonthIndex];
};

export const BeefClasses = [
  'bullsLt1',
  'bullsGt1',
  'cowsLt1',
  'cows1To2Years',
  'cows2To3Years',
  'cowsGt3Years',
  'steersLt1',
  'steers1To2Years',
  'steers2To3Years',
  'steersGt3Years',
] as const;

export type BeefClass = (typeof BeefClasses)[number];

export const WastewaterFacilityTypes = [
  'Managed aerobic treatment',
  'Unmanaged aerobic treatment',
  'Anaerobic digestor/reactor',
  'Shallow anaerobic lagoon', // ≤ 2m
  'Deep anaerobic lagoon', // > 2m
] as const;
export type WastewaterFacilityType = (typeof WastewaterFacilityTypes)[number];

export const WastewaterCommodities = [
  'Dairy products',
  'Pulp, paper and paperboard',
  'Meat and poultry',
  'Raw sugar',
  'Beer',
  'Wine and other alcoholic beverages',
  'Fruit',
  'Vegetables',
] as const;
export type WastewaterCommodity = (typeof WastewaterCommodities)[number];

export const States = [
  'ACT',
  'TAS',
  'NSW',
  'VIC',
  'QLD',
  'SA',
  'WA',
  'NT',
] as const;
export type State = (typeof States)[number];
export const isState = (state: string): state is State => {
  return States.includes(state as State);
};

export const ElectricityRegions = [
  'NSW',
  'VIC',
  'QLD',
  'SA',
  'WA_NW',
  'WA_SW',
  'TAS',
  'NT',
  'ACT',
  'National',
] as const;
export type ElectricityRegion = (typeof ElectricityRegions)[number];

export const RiceCultivationSeasonWaterRegimeTypes = [
  'Paddy rotation',
  'Fallow without flooding in previous year',
  'Continuously flooded',
  'Single drainage period',
  'Multiple drainage periods',
  'Regular rainfed',
  'Drought prone',
  'Deep water',
] as const;
export type RiceCultivationSeasonWaterRegimeType =
  (typeof RiceCultivationSeasonWaterRegimeTypes)[number];

export const RiceCultivationPreSeasonWaterRegimeTypes = [
  'Non flooded pre-season <180 days',
  'Non flooded pre-season >180 days',
  'Non-flooded pre-season >365 days',
  'Flooded pre-season >30 days',
] as const;
export type RiceCultivationPreSeasonWaterRegimeType =
  (typeof RiceCultivationPreSeasonWaterRegimeTypes)[number];

export const RiceCultivationOrganicAmendmentTypes = [
  'Straw incorporated shortly (<30 days) before cultivation',
  'Straw incorporated long (>30 days) before cultivation',
  'Compost',
  'Farm yard manure',
  'Green manure',
] as const;
export type RiceCultivationOrganicAmendmentType =
  (typeof RiceCultivationOrganicAmendmentTypes)[number];
export const IBRA7Regions = [
  'Arnhem Coast',
  'Arnhem Plateau',
  'Australian Alps',
  'Avon Wheatbelt',
  'Brigalow Belt North',
  'Brigalow Belt South',
  'Ben Lomond',
  'Broken Hill Complex',
  'Burt Plain',
  'Carnarvon',
  'Central Arnhem',
  'Central Kimberley',
  'Central Ranges',
  'Channel Country',
  'Central Mackay Coast',
  'Coolgardie',
  'Cobar Peneplain',
  'Cape York Peninsula',
  'Daly Basin',
  'Darwin Coastal',
  'Dampierland',
  'Desert Uplands',
  'Davenport Murchison Ranges',
  'Darling Riverine Plains',
  'Einasleigh Uplands',
  'Esperance Plains',
  'Eyre Yorke Block',
  'Finke',
  'Flinders Lofty Block',
  'Furneaux',
  'Gascoyne',
  'Gawler',
  'Geraldton Sandplains',
  'Gulf Fall and Uplands',
  'Gibson Desert',
  'Great Sandy Desert',
  'Gulf Coastal',
  'Gulf Plains',
  'Great Victoria Desert',
  'Hampton',
  'Jarrah Forest',
  'Kanmantoo',
  'King',
  'Little Sandy Desert',
  'MacDonnell Ranges',
  'Mallee',
  'Murray Darling Depression',
  'Mitchell Grass Downs',
  'Mount Isa Inlier',
  'Mulga Lands',
  'Murchison',
  'Nandewar',
  'Naracoorte Coastal Plain',
  'New England Tablelands',
  'NSW North Coast',
  'Northern Kimberley',
  'NSW South Western Slopes',
  'Nullarbor',
  'Ord Victoria Plain',
  'Pine Creek',
  'Pilbara',
  'Riverina',
  'South East Coastal Plain',
  'South East Corner',
  'South Eastern Highlands',
  'South Eastern Queensland',
  'Simpson Strzelecki Dunefields',
  'Stony Plains',
  'Sturt Plateau',
  'Southern Volcanic Plain',
  'Swan Coastal Plain',
  'Sydney Basin',
  'Tanami',
  'Tasmanian Central Highlands',
  'Tiwi Cobourg',
  'Tasmanian Northern Midlands',
  'Tasmanian Northern Slopes',
  'Tasmanian South East',
  'Tasmanian Southern Ranges',
  'Tasmanian West',
  'Victoria Bonaparte',
  'Victorian Midlands',
  'Warren',
  'Wet Tropics',
  'Yalgoo',
] as const;
export type IBRA7Region = (typeof IBRA7Regions)[number];

export const PerennialWoodyCropsFull = [
  'Oranges',
  'Macadamias',
  'Almonds',
  'Apples',
  'Peaches',
  'Olives',
  'Avocados',
  'Mangoes',
] as const;
export type PerennialWoodyCropFull = (typeof PerennialWoodyCropsFull)[number];

export const PerennialWoodyCropsPartial = ['Grapes', 'Kiwifruits'] as const;
export type PerennialWoodyCropPartial =
  (typeof PerennialWoodyCropsPartial)[number];

export const PerennialWoodyCrops = [
  ...PerennialWoodyCropsFull,
  ...PerennialWoodyCropsPartial,
] as const;
export type PerennialWoodyCrop = (typeof PerennialWoodyCrops)[number];

export const isPerennialWoodyCropContainerFull = (
  crop:
    Container<PerennialWoodyCropFull> | Container<PerennialWoodyCropPartial>,
): crop is Container<PerennialWoodyCropFull> => {
  return isPerennialWoodyCropFull(crop.unit);
};

export const isPerennialWoodyCropFull = (
  crop: PerennialWoodyCropFull | PerennialWoodyCropPartial,
): crop is PerennialWoodyCropFull => {
  return PerennialWoodyCropsFull.includes(crop as PerennialWoodyCropFull);
};

export const DairyCattleBreeds = [
  'Medium Friesian',
  'Large Friesian',
  'Holstein-Friesian',
  'Friesian crossbred',
  'Jersey',
  'Jersey crossbred',
  'Ayrshire',
  'Guernsey',
  'Brown Swiss',
  'Illawarra/Aussie Red',
] as const;
export type DairyCattleBreed = (typeof DairyCattleBreeds)[number];

export const BuffaloClasses = ['Bulls', 'Cows', 'Steers', 'Calves'] as const;
export type BuffaloClass = (typeof BuffaloClasses)[number];

export const GoatClasses = [
  'Bucks/Billy',
  'Wethers',
  'Maiden breeding does/nannies',
  'Breeding does/nannies',
  'Other',
  'Kids',
] as const;
export type GoatClass = (typeof GoatClasses)[number];

export const DeerClasses = [
  'Bucks',
  'Breeding Does',
  'Other Does',
  'Fawn',
] as const;
export type DeerClass = (typeof DeerClasses)[number];

export const OtherLivestockClasslessTypes = [
  'Camels',
  'Alpacas',
  'Horses',
  'Mules/asses',
  'Emus/ostriches',
] as const;
export type OtherLivestockClasslessType =
  (typeof OtherLivestockClasslessTypes)[number];

export const isOtherLivestockClasslessType = (
  type: string,
): type is OtherLivestockClasslessType => {
  return OtherLivestockClasslessTypes.includes(
    type as OtherLivestockClasslessType,
  );
};

export const OtherLivestockTypes = [
  'Buffalo',
  'Goats',
  'Deer',
  ...OtherLivestockClasslessTypes,
] as const;
export type OtherLivestockType = (typeof OtherLivestockTypes)[number];

export const MeanAnnualTemperatures = [
  '10 or below',
  '11',
  '12',
  '13',
  '14',
  '15',
  '16',
  '17',
  '18',
  '19',
  '20',
  '21',
  '22',
  '23',
  '24',
  '25',
  '26',
  '27',
  '28 or above',
] as const;
export type MeanAnnualTemperature = (typeof MeanAnnualTemperatures)[number];
export const SheepClasses = [
  'breedingEwes',
  'lambsHoggets',
  'maidenEwes',
  'otherEwes',
  'rams',
  'wethers',
] as const;
export type SheepClass = (typeof SheepClasses)[number];

export const PigsClasses = ['boars', 'sows', 'gilts', 'slaughterPigs'] as const;
export type PigsClass = (typeof PigsClasses)[number];

export const PigsLiveweightClasses = [
  ...PigsClasses,
  'slaughterPigsAtTurnoff',
] as const;
export type PigsLiveweightClass = (typeof PigsLiveweightClasses)[number];

export const BeefBreeds = [
  'Hereford or Shorthorn',
  'Northern Brahman cross breed',
] as const;
export type BeefBreed = (typeof BeefBreeds)[number];

export const SoilAmeliorants = ['Limestone', 'Dolomite', 'Gypsum'] as const;
export type SoilAmeliorant = (typeof SoilAmeliorants)[number];
