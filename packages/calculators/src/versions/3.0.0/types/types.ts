import { BeefClasses as BeefClassesInput } from './Beef/beefclasses.input';
import { BuffaloClasses as BuffaloClassesInput } from './Buffalo/buffaloclasses.input';
import { DeerClasses as DeerClassesInput } from './Deer/deerclasses.input';
import { GoatClasses as GoatClassesInput } from './Goat/goatclasses.input';
import { SheepClasses as SheepClassesInput } from './Sheep/sheepclasses.input';

export enum StationaryFuelTypes {
  PETROL = 'petrol',
  DIESEL = 'diesel',
  LPG = 'lpg',
  ETHANOL = 'ethanol',
  BIODIESEL = 'biodiesel',
  RENEWABLE_DIESEL = 'renewable diesel',
  OTHER_BIOFUELS = 'other biofuels',
  LNG = 'lng',
}

export enum TransportFuelTypes {
  PETROL = 'petrol',
  DIESEL = 'diesel',
  LPG = 'lpg',
  ETHANOL = 'ethanol',
  BIODIESEL = 'biodiesel',
  RENEWABLE_DIESEL = 'renewable diesel',
  OTHER_BIOFUELS = 'other biofuels',
  LNG = 'lng',
  FUEL_OIL = 'fuel oil',
  AVGAS = 'avgas',
  JET_A1 = 'jet a-1',
  JET_B = 'jet b',
}

export const States = [
  'nsw',
  'vic',
  'qld',
  'sa',
  'wa_nw',
  'wa_sw',
  'tas',
  'nt',
  'act',
] as const;

export type State = (typeof States)[number];

export const Regions = ['southwest', 'pilbara', 'kmberley'] as const;
export type Region = (typeof Regions)[number];

export const Seasons = ['spring', 'summer', 'autumn', 'winter'] as const;
export type Season = (typeof Seasons)[number];

export const ElectricitySources = ['State Grid', 'Renewable'] as const;
export type ElectricitySource = (typeof ElectricitySources)[number];

export const WaterRegimeTypes = ['Upland', 'Irrigated', 'Rainfed'] as const;
export type WaterRegimeType = (typeof WaterRegimeTypes)[number];

export const WaterRegimeSubTypes = [
  'Continuously flooded',
  'Single drainage period',
  'Multiple drainage periods',
  'Regular rainfed',
  'Drought prone',
  'Deep water',
  'Paddy rotation',
  'Fallow without flooding in previous year',
] as const;
export type WaterRegimeSubType = (typeof WaterRegimeSubTypes)[number];

export const RicePreseasonFloodingPeriods = [
  'Non flooded pre-season < 180 days',
  'Non flooded pre-season > 180 days',
  'Flooded pre-season > 30 days',
  'Non-flooded pre-season > 365 days',
] as const;
export type RicePreseasonFloodingPeriod =
  (typeof RicePreseasonFloodingPeriods)[number];

export const CustomisedFertilisers = [
  'Monoammonium phosphate (MAP)',
  'Diammonium Phosphate (DAP)',
  'Urea-Ammonium Nitrate (UAN)',
  'Ammonium Nitrate (AN)',
  'Calcium Ammonium Nitrate (CAN)',
  'Triple Superphosphate (TSP)',
  'Super Potash 1:1',
  'Super Potash 2:1',
  'Super Potash 3:1',
  'Super Potash 4:1',
  'Super Potash 5:1',
  'Muriate of Potash',
  'Sulphate of Potash',
  'Sulphate of Ammonia',
] as const;
export type CustomisedFertiliser = (typeof CustomisedFertilisers)[number];

export const SupplementationTypes = [
  'mineralblock',
  'weanerblock',
  'dryseasonmix',
] as const;
export type SupplementationType = (typeof SupplementationTypes)[number];

// Feedlot

export const FeedlotSystems = [
  'Drylot',
  'Solid Storage',
  'Composting',
  'Uncovered anaerobic lagoon',
] as const;
export type FeedlotSystem = (typeof FeedlotSystems)[number];

export const TruckTypes = [
  '4 Deck Trailer',
  '6 Deck Trailer',
  'B-Double',
] as const;
export type TruckType = (typeof TruckTypes)[number];

export const FeedlotPurchaseSourceLocations = [
  'NT',
  'nth QLD',
  'sth/central QLD',
  'nth NSW',
  'sth NSW/VIC/sth SA',
  'NSW/SA pastoral zone',
  'sw WA',
  'WA pastoral',
  'TAS',
] as const;
export type FeedlotPurchaseSourceLocation =
  (typeof FeedlotPurchaseSourceLocations)[number];

// Grains

export const ProductionSystems = [
  'Non-irrigated crop',
  'Irrigated crop',
  'Sugar cane',
  'Cotton',
  'Horticulture',
] as const;
export type ProductionSystem = (typeof ProductionSystems)[number];

export const CropTypes = [
  'Wheat',
  'Barley',
  'Maize',
  'Oats',
  'Rice',
  'Sorghum',
  'Triticale',
  'Other Cereals',
  'Pulses',
  'Tuber and Roots',
  'Peanuts',
  'Sugar Cane',
  'Cotton',
  'Hops',
  'Oilseeds',
  'Forage Crops',
  'Lucerne',
  'Other legume',
  'Annual grass',
  'Grass clover mixture',
  'Perennial pasture',
] as const;
export type CropType = (typeof CropTypes)[number];

export const HorticultureCropTypes = [
  'Pulses',
  'Tuber and Roots',
  'Peanuts',
  'Hops',
  'Perennial Hort',
  'Annual Hort',
] as const;
export type HorticultureCropType = (typeof HorticultureCropTypes)[number];

// SheepBeef
// TODO: these lists of keys are vulnerable to missing values that don't get processed. Need ot protect
// via typescript or change how we loop
export const BeefClassesAPI: (keyof BeefClassesInput)[] = [
  'bullsGt1',
  'bullsGt1Traded',
  'steersLt1',
  'steersLt1Traded',
  'steers1To2',
  'steers1To2Traded',
  'steersGt2',
  'steersGt2Traded',
  'cowsGt2',
  'cowsGt2Traded',
  'heifersLt1',
  'heifersLt1Traded',
  'heifers1To2',
  'heifers1To2Traded',
  'heifersGt2',
  'heifersGt2Traded',
];

export const SheepClassesAPI: (keyof SheepClassesInput)[] = [
  'wethers',
  'tradeWethers',
  'rams',
  'tradeRams',
  'maidenBreedingEwes',
  'tradeMaidenBreedingEwes',
  'breedingEwes',
  'tradeBreedingEwes',
  'otherEwes',
  'tradeOtherEwes',
  'eweLambs',
  'tradeEweLambs',
  'wetherLambs',
  'tradeWetherLambs',
  'tradeEwes',
  'tradeLambsAndHoggets',
];

// Pork

export const PorkClasses = [
  'sows',
  'boars',
  'gilts',
  'suckers',
  'weaners',
  'growers',
  'slaughter_pigs',
] as const;
export type PorkClass = (typeof PorkClasses)[number];

// TODO improve iteration of livestock classes to ensure none are missed
export const PorkClassesAPI = [
  'sows',
  'boars',
  'gilts',
  'suckers',
  'weaners',
  'growers',
  'slaughterPigs',
] as const;

export const ManureManagementSystems = [
  'outdoorSystems',
  'coveredAnaerobicPond',
  'uncoveredAnaerobicPond',
  'deepLitter',
  'undefinedSystem',
] as const;
export type ManureManagementSystem = (typeof ManureManagementSystems)[number];

export const RainfallRegions = [
  'South West',
  'Pilbara',
  'Kimberley',
  'Central West',
  'South Coastal',
  'Goldfields/Eucla',
  'Gascoyne',
  'Central Wheat Belt',
  'Interior',
  'North Coast',
  'South Coast',
  'Northern Tablelands',
  'Southern Tablelands',
  'Northern Wheat/Sheep',
  'Southern Wheat/Sheep',
  'Western',
  'North East',
  'East Coast',
  'Central North/Midlands/South East',
  'Central Plateau/Derwent Valley',
  'West/South Coast',
  'North West',
  'South East',
  'Murray',
  'Mid-North/Flinders',
  'Pastoral',
  'West Coast/Eyre',
  'Mallee',
  'Wimmera',
  'Northern Country',
  'North East Vic',
  'East Gippsland',
  'West/South Gippsland',
  'Central',
  'South West Vic',
  'Central Highlands/Northern',
  'Central West/Flinders',
  'Channel Country',
  'Maranoa/Warrego',
  'Darling Downs/Burnett',
  'North West/Gulf',
  'Darwin-Daly',
  'Arnhem-Roper',
  'Victoria River-TennantCreek',
  'Alice Springs',
] as const;
export type RainfallRegion = (typeof RainfallRegions)[number];
export const RainfallRegionNumber = RainfallRegions.reduce(
  (acc, x, i) => ({ ...acc, [x]: i }),
  {} as { [key in RainfallRegion]: number },
);

export const TreeTypes = [
  'Mixed species (Environmental Plantings)',
  'No tree data available',
  'Tasmanian Blue Gum',
  'Spotted Gum',
  'Sugar Gum',
  'Hoop Pine',
  'Sydney Blue Gum',
  "Dunn's White Gum",
  'Shining Gum',
  'Pinus Radiata',
  'Lemon-scented Gum',
  'Maritime Pine',
  'Flooded Gum',
  'Red Ironbark',
  'Radiata Pine (low input)',
  'Mountain Ash',
  'Western White Gum',
  'Slash Pine',
  'Radiata Pine (high input)',
  'Pinus Radiata (low input)',
  'Blackbutt',
  'Loblolly Pine',
  'Pinus Radiata (high input)',
  'Pinus Hybrids',
] as const;
export type TreeType = (typeof TreeTypes)[number];

export const SoilTypes = [
  'Loams & Clays',
  'No Soil / Tree data available',
  'Coloured Sands',
  'Duplex',
  'Clay',
  '"Other Soils"',
  'Other Soils',
  'Duplex Soils',
  'Sandy Soils',
  'Calcarosols',
  'Grey Cracking Clays',
  'Red Earths',
  'Non-cracking Clays',
  'Red Duplex',
  'Cracking Clays',
  'Clays',
  'Clay Gidgee',
  'Clay (Brigalo and Belah)',
  'Kandosols',
  'Sandy Duplexes',
  'Clay & Red Loam',
  'Loam',
  'Structured Earths',
  'Loamy Soils',
  'Yellow Duplex',
  'Gradational soils',
  'Open Downs',
  'Duplex Woodland',
  'Earths',
  'Tenosols',
] as const;
export type SoilType = (typeof SoilTypes)[number];

export const VegetationClasses = [
  'Shrubland hummock',
  'Woodland Hummock',
  'Melaleuca woodland',
  'Woodland Mixed',
  'Open forest mixed',
  'Shrubland (heath) with hummock grass',
  'Woodland with hummock grass',
  'Open woodland with mixed grass',
  'Woodland with mixed grass',
  'Woodland with tussock grass',
] as const;
export type VegetationClass = (typeof VegetationClasses)[number];
export const VegetationClassNumber = VegetationClasses.reduce(
  (acc, x, i) => ({ ...acc, [x]: i + 1 }),
  {} as { [key in VegetationClass]: number },
);

export const Fuels = ['fine', 'coarse'] as const;
export type Fuel = (typeof Fuels)[number];

export const FireSeasons = ['early dry season', 'late dry season'] as const;
export type FireSeason = (typeof FireSeasons)[number];

export const Patchinesses = ['low', 'high'] as const;
export type Patchiness = (typeof Patchinesses)[number];

export const RainfallZones = ['low', 'high'] as const;
export type RainfallZone = (typeof RainfallZones)[number];

// Goat

export const GoatClassesAPI: (keyof GoatClassesInput)[] = [
  'wethers',
  'tradeWethers',
  'tradeBucks',
  'tradeDoes',
  'bucksBilly',
  'maidenBreedingDoesNannies',
  'tradeMaidenBreedingDoesNannies',
  'breedingDoesNannies',
  'tradeBreedingDoesNannies',
  'otherDoesCulledFemales',
  'tradeOtherDoesCulledFemales',
  'kids',
  'tradeKids',
];
export type GoatClassAPI = (typeof GoatClassesAPI)[number];

// Poultry

export const PoultryClasses = [
  'meat_chicken_growers',
  'meat_chicken_layers',
  'meat_other',
  'layers',
] as const;
export type PoultryClass = (typeof PoultryClasses)[number];

export const PoultryClassesAPI = [
  'meatChickenGrowers',
  'meatChickenLayers',
  'meatOther',
  'layers',
] as const;
export type PoultryClassAPI = (typeof PoultryClassesAPI)[number];

// Dairy

export const DairyClasses = [
  'milking_cows',
  'heifers_lt_1',
  'heifers_gt_1',
  'dairyBulls_lt_1',
  'dairyBulls_gt_1',
] as const;
export type DairyClass = (typeof DairyClasses)[number];

export const DairyClassesAPI = [
  'milkingCows',
  'heifersLt1',
  'heifersGt1',
  'dairyBullsLt1',
  'dairyBullsGt1',
] as const;
export type DairyClassAPI = (typeof DairyClassesAPI)[number];

export const DairyProductionSystems = [
  'Non-irrigated Crop',
  'Irrigated Crop',
  'Irrigated Pasture',
  'Non-irrigated Pasture',
] as const;
export type DairyProductionSystem = (typeof DairyProductionSystems)[number];

// Deer

export const DeerClassesAPI: (keyof DeerClassesInput)[] = [
  'tradeBucks',
  'tradeDoes',
  'bucks',
  'breedingDoes',
  'otherDoes',
  'tradeOtherDoes',
  'fawn',
  'tradeFawn',
];
export type DeerClassAPI = (typeof DeerClassesAPI)[number];

// Buffalo

export const BuffaloClassesAPI: (keyof BuffaloClassesInput)[] = [
  'bulls',
  'tradeBulls',
  'cows',
  'tradeCows',
  'steers',
  'tradeSteers',
  'calfs',
  'tradeCalfs',
];
export type BuffaloClassAPI = (typeof BuffaloClassesAPI)[number];

// Wild sea fisheries

export const WildSeaFisheriesTransportTypes = [
  'None',
  'Small Car',
  'Medium Car',
  'Large Car',
  'Courier Van-Utility',
  '4WD Mid Size',
  'Light Rigid',
  'Medium Rigid',
  'Heavy Rigid',
  'Heavy Bus',
] as const;
export type WildSeaFisheriesTransportType =
  (typeof WildSeaFisheriesTransportTypes)[number];

export const WildSeaFisheriesFuels = [
  'Gasoline',
  'Diesel oil',
  'Liquefied petroleum gas (LPG)',
  'Fuel oil',
  'Ethanol',
  'Biodiesel',
  'Renewable diesel',
  'Other biofuels',
  'Liquified natural gas',
] as const;
export type WildSeaFisheriesFuel = (typeof WildSeaFisheriesFuels)[number];

export const WildSeaFisheriesBaits = [
  'Fish Frames',
  'Fish Heads',
  'Sardines',
  'Squid',
  'Whole Fish',
] as const;
export type WildSeaFisheriesBait = (typeof WildSeaFisheriesBaits)[number];

export const Refrigerants = [
  'HFC-23',
  'HFC-32',
  'HFC-41',
  'HFC-43-10mee',
  'HFC-125',
  'HFC-134',
  'HFC-134a',
  'HFC-143',
  'HFC-143a',
  'HFC-152a',
  'HFC-227ea',
  'HFC-236fa',
  'HFC-245ca',
  'HFC-245fa',
  'HFC-365mfc',
  'R438A',
  'R448A',
  'R-22',
  'Ammonia (R-717)',
  'R-11',
  'R-12',
  'R-13',
  'R-23',
  'R-32',
  'R-113',
  'R-114',
  'R-115',
  'R-116',
  'R-123',
  'R-124',
  'R-125',
  'R-134a',
  'R-141b',
  'R-142b',
  'R-143a',
  'R-152a',
  'R-218',
  'R-227ea',
  'R-236fa',
  'R-245ca',
  'R-245fa',
  'R-C318',
  'R-401A',
  'R-401B',
  'R-401C',
  'R-402A',
  'R-402B',
  'R-403A',
  'R-403B',
  'R-404A',
  'R-405A',
  'R-406A',
  'R-407A',
  'R-407B',
  'R-407C',
  'R-407D',
  'R-407E',
  'R-408A',
  'R-409A',
  'R-409B',
  'R-410A',
  'R-411A',
  'R-411B',
  'R-412A',
  'R-413A',
  'R-414A',
  'R-414B',
  'R-415A',
  'R-415B',
  'R-416A',
  'R-417A',
  'R-418A',
  'R-419A',
  'R-420A',
  'R-421A',
  'R-421B',
  'R-422A',
  'R-422B',
  'R-422C',
  'R-422D',
  'R-423A',
  'R-424A',
  'R-425A',
  'R-426A',
  'R-427A',
  'R-428A',
  'R-500',
  'R-502',
  'R-503',
  'R-507A',
  'R-508A',
  'R-508B',
  'R-509A',
] as const;
export type Refrigerant = (typeof Refrigerants)[number];

export enum FluidWasteTreatmentType {
  MANAGED_AEROBIC = 'Managed Aerobic',
  UNMANAGED_AEROBIC = 'Unmanaged Aerobic',
  ANEAROBIC_DIGESTER_REACTOR = 'Anaerobic Digester/Reactor',
  SHALLOW_ANEAROBIC_LAGOON_LT_2M = 'Shallow Anaerobic Lagoon <2m',
  DEEP_ANEAROBIC_LAGOON_GT_2M = 'Deep Anaerobic Lagoon >2m',
}

export enum AquacultureProductionSystem {
  ABALONE_FARMING = 'Abalone Farming',
  MUSSEL_FARMING = 'Mussel Farming',
  OFFSHORE_CAGED_AQUACULTURE = 'Offshore Caged Aquaculture',
  ONLAND_FISH_FARMING = 'Onland Fish Farming',
  ONSHORE_HATCHERY = 'Onshore Hatchery',
  OTHER = 'Other',
  OYSTER_FARMING = 'Oyster Farming',
  PEARL_FARMING = 'Pearl Farming',
  PRAWN_FARMING = 'Prawn Farming',
  SEAWEED_MACROALGAE_FARMING = 'Seaweed and Macroalgae Farming',
}

export enum AquacultureBait {
  SARDINES = 'Whole Sardines',
  LOW_ANIMAL_PROTEIN = 'Low Animal Protein Formulated Feed',
  HIGH_ANIMAL_PROTEIN = 'High Animal Protein Formulated Feed',
  CEREAL = 'Cereal Grain',
  SQUID = 'Squid',
  FISH = 'Whole Fish',
}

export enum WildCatchFisheryBait {
  FISH_FRAMES = 'Fish Frames',
  FISH_HEADS = 'Fish Heads',
  SARDINES = 'Sardines',
  SQUID = 'Squid',
  WHOLE_FISH = 'Whole Fish',
}

export enum FreightTypes {
  TRUCK = 'Truck',
  RAIL = 'Rail',
  LONG_HAUL_FLIGHT = 'Long haul flight',
  MEDIUM_HAUL_FLIGHT = 'Medium haul flight',
  SMALL_CONTAINER_SHIP = 'Small container ship',
  LARGE_CONTAINER_SHIP = 'Large container ship',
}
