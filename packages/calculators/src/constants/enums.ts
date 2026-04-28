export const CalculationMethods = ['1', '2'] as const;
export type CalculationMethod = (typeof CalculationMethods)[number];

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

// Currently only used for inorganic fertilisers
// 5.1.1.2
export const ProductionSystemsInorganicFertilisers = [
  'Irrigated crop (maize)',
  'Non-irrigated crop (high rainfall zone)',
  'Cotton',
] as const;
export type ProductionSystemsInorganicFertiliser =
  (typeof ProductionSystemsInorganicFertilisers)[number];

export const BasicCropProductionSystems = [
  'Irrigated pasture',
  'Irrigated crop (low rainfall)',
  'Irrigated crop (high rainfall)',
  'Irrigated crop',
  'Non-irrigated pasture',
  'Non-irrigated crops',
  'Sugar',
  'Cotton',
  'Horticultural crops',
  'Aquaculture',
  'Rice (continuous flooding)',
  'Rice (single and multiple drainage, or alternate wetting and drying)',
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
export const addRainfallToGrazingProductionSystem = (
  system: GrazingProductionSystem,
  highRainfallZone: boolean,
): GrazingProductionSystemsWithRainfall => {
  if (system === 'Non-irrigated crop') {
    return highRainfallZone
      ? 'Non-irrigated crop (high rainfall)'
      : 'Non-irrigated crop (low rainfall)';
  }
  return system;
};

// Appendix A 2.2.6
export const InorganicFertiliserTypes = [
  'Monoammonium Phosphate (MAP)',
  'Diammonium Phosphate (DAP)',
  'Urea',
  'Sulphate of Ammonia (SOA)',
  'Urea-Ammonium Nitrate (UAN)',
  'Ammonium Nitrate (AN)',
  'Calcium Ammonium Nitrate (CAN)',
] as const;
export type InorganicFertiliserType = (typeof InorganicFertiliserTypes)[number];

export const OrganicFertiliserTypes = [
  'Dairy cattle',
  'Beef cattle',
  'Poultry',
  'Swine',
  'Sheep',
  'Horses/Mules',
] as const;
export type OrganicFertiliserType = (typeof OrganicFertiliserTypes)[number];

export const OrganicFertiliserOrigins = [
  'Local',
  'Purchased_Traced',
  'Purchased_Untraced',
] as const;
export type OrganicFertiliserOrigin = (typeof OrganicFertiliserOrigins)[number];

export const SwineMMSTypes = [
  'Outdoor (Dry lot)',
  'Deep litter',
  'Stockpile (Solid storage)',
  'Effluent pond (Uncovered anaerobic lagoon)',
  'Anaerobic digestor / Covered lagoon',
  'Short HRT tank storage < 1 month (pit storage)',
  'Direct application', // This is not strictly derived from references. It is implicit and added to allow easier data entry
] as const;
export type SwineMMSType = (typeof SwineMMSTypes)[number];

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

export const isPastureType = (type: PastureCropType): type is PastureType => {
  return PastureTypes.includes(type as PastureType);
};

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
  'Tubers and Roots',
  'Peanuts',
  'Sugar Cane',
  'Cotton',
  'Hops',
  'Oilseeds',
  'Forage Crops',
  'Other Annual Crops',
  'Other Perennial Crops',
] as const;
export type CropType = (typeof CropTypes)[number];

export const PastureCropTypes = [...PastureTypes, ...CropTypes] as const;
export type PastureCropType = (typeof PastureCropTypes)[number];

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

export const InorganicFertiliserComponentTypesNonRegional = [
  'Monoammonium phosphate',
  'Diammonium Phosphate',
  'Urea-Ammonium Nitrate',
  'Ammonium Nitrate',
  'Calcium Ammonium Nitrate',
  'Sulphate of Ammonia',
  'Nitrogen - Generic',
  'Nitrogen - Nitrate',
  'Nitrogen - Ammonia',
  'Muriate of Potash',
  'Single superphosphate',
  'Double Superphosphate',
  'Phosphorus - Generic',
  'Potassium - Generic',
  'Sulfur - Generic',
  'Zinc - Generic',
  'Calcium - Generic lime as proxy',
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

export const isInorganicFertiliserComponentTypeRegional = (
  type: InorganicFertiliserComponentType,
): type is InorganicFertiliserComponentTypeRegional => {
  return InorganicFertiliserComponentTypesRegional.includes(
    type as InorganicFertiliserComponentTypeRegional,
  );
};

// Taken from AusLCI CEF V47 2026
export const ServiceByAreaTypes = [
  'Air blast spraying, orchards',
  'Bed forming, cotton',
  'Bed forming, horticulture',
  'Boom spraying, cotton',
  'Boom spraying, horticulture',
  'Control of brigalow suckers, graslan aerial application',
  'Cultivating, broadacre crop, controlled traffic',
  'Cultivating, broadacre crop, conventional',
  'Cultivating, cotton',
  'Cultivating, large implement, horticulture',
  'Cultivating, medium implement, horticulture',
  'Disc ploughing, broadacre crop, controlled traffic',
  'Disc ploughing, broadacre crop, conventional',
  'Discing, cotton',
  'Fertiliser application, cotton',
  'Fertiliser side dressing, horticulture',
  'Fertiliser spreading, cotton',
  'Fertiliser spreading, horticulture',
  'Fertilizing, broadacre crop, pre & post-emergence, controlled traffic',
  'Fertilizing, broadacre crop, pre & post-emergence, conventional',
  'Grader operation, broadacre crop, medium load factor, controlled traffic',
  'Grader operation, broadacre crop, medium load factor, conventional',
  'Grain collection, broadacre, in-field with tractor and bin, controlled traffic',
  'Grain collection, broadacre, in-field with tractor and bin, conventional',
  'Harrowing, horticulture',
  'Harvesting, broadacre crop, combine less than 200kW, controlled traffic',
  'Harvesting, broadacre crop, combine less than 200kW, conventional',
  'Harvesting, cotton',
  'Harvesting, specialised machine, horticulture, 150 kW combine',
  'Hay baling, large square bales, broadacre crop, controlled traffic',
  'Hay baling, large square bales, broadacre crop, conventional',
  'Hay baling, round bales, broadacre crop, controlled traffic',
  'Hay baling, round bales, broadacre crop, conventional',
  'Hay baling, small square bales, broadacre crop, controlled traffic',
  'Hay baling, small square bales, broadacre crop, conventional',
  'Hay mowing, broadacre crop, controlled traffic',
  'Hay mowing, broadacre crop, conventional',
  'Hay raking, broadacre crop, controlled traffic',
  'Hay raking, broadacre crop, conventional',
  'Inter-row cultivation, horticulture',
  'Inter-row tractor, horticulture',
  'Irrigation, centre pivot irrigation system',
  'Irrigation, hose move sprinkler system',
  'Irrigation, pipe irrigation system',
  'Irrigation, solid set irrigation system',
  'Irrigation, travel spray boom irrigation system',
  'Irrigation, under tree irrigation system',
  'Irrigation,flood or furrow irrigation',
  'Irrigation,travelling gun irrigation system',
  'Levelling, cotton',
  'Liming, broadacre crop, pre & post-emergence, controlled traffic',
  'Liming, broadacre crop, pre & post-emergence, conventional',
  'Mulching, cotton',
  'Offset disc harrowing, horticulture',
  'Pasture establishment, SE Qld',
  'Pasture establishment, top end, NT',
  'Picking, cotton',
  'Planting, broadacre crop, soil clay content 0 to 10%, controlled traffic',
  'Planting, broadacre crop, soil clay content 0 to 10%, conventional',
  'Planting, broadacre crop, soil clay content 10 to 20%, controlled traffic',
  'Planting, broadacre crop, soil clay content 10 to 20%, conventional',
  'Planting, broadacre crop, soil clay content greater than 20%, controlled traffic',
  'Planting, broadacre crop, soil clay content greater than 20%, conventional',
  'Planting, cotton',
  'Precision planting, horticulture',
  'Ripping, large implement, horticulture',
  'Ripping, medium implement, horticulture',
  'Rolling, cotton',
  'Root cutting, cotton',
  'Rotary hoeing, medium implement, horticulture',
  'Savanna burning, northern Australia woodland, Qld & NT',
  'Savanna burning, open eucalypt woodland, late dry season, Qld & NT',
  'Scarifiying, broadacre crop, controlled traffic',
  'Scarifiying, broadacre crop, conventional',
  'Seedling transplanting, horticulture',
  'Spraying, aerial, broadacre crop',
  'Spraying, aerial, cotton',
  'Spraying, aerial, rice',
  'Spraying, broadacre crop, pre & post-emergence, controlled traffic',
  'Spraying, broadacre crop, pre & post-emergence, conventional',
  'Windrowing, broadacre crop, controlled traffic',
  'Windrowing, broadacre crop, conventional',
];
export type ServiceByAreaType = (typeof ServiceByAreaTypes)[number];

export const ServiceByHourTypes = [
  'Bulldozer operation, medium load factor',
] as const;
export type ServiceByHourType = (typeof ServiceByHourTypes)[number];

export const OrganicWasteTypes = [
  'Food waste',
  'Green waste',
  'Wood',
  'Sludge',
] as const;
export type OrganicWasteType = (typeof OrganicWasteTypes)[number];

export const SolidWasteLandfillTypes = [
  ...OrganicWasteTypes,
  'Textiles',
  'Paper and cardboard',
  'Rubber and leather',
  'Inert waste (including concrete, metal, plastic or glass)',
  'Municipal solid waste',
  'Commercial waste',
  'Industrial waste',
  'Construction and demolition waste',
] as const;
export type SolidWasteLandfillType = (typeof SolidWasteLandfillTypes)[number];

export const SolidWasteIncinerationTypes = [
  ...OrganicWasteTypes,
  'Paper and cardboard',
  'Textiles',
  'Rubber and leather',
  'Inert waste (including concrete, metal, plastic or glass)',
  'Municipal solid waste',
  'Industrial waste',
] as const;
export type SolidWasteIncinerationType =
  (typeof SolidWasteIncinerationTypes)[number];

export const SolidWasteByVolumeTypes = [
  ...OrganicWasteTypes,
  'Paper and cardboard',
  'Textiles',
  'Rubber and leather',
  'Inert waste (including concrete, metal, plastic or glass)',
  'Municipal solid waste',
  'Commercial waste',
  'Industrial waste',
  'Construction and demolition waste',
] as const;
export type SolidWasteByVolumeType = (typeof SolidWasteByVolumeTypes)[number];

export const ClimateZoneTypes = ['dry', 'wet'] as const;
export type ClimateZoneType = (typeof ClimateZoneTypes)[number];

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
  'Biomass,  municipal and industrial materials',
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
  // 'Glyphosate',
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
  | PurchasedFeedLivestockRegionlessType
  | PurchasedFeedLivestockRegionalType;

export const PurchasedMineralSupplementTypes = [
  'Lick block, dry season mix',
  'Lick block, weaner',
  'Lick block, mineral',
] as const;
export type PurchasedMineralSupplementType =
  (typeof PurchasedMineralSupplementTypes)[number];

export const FeedlotMMSTypes = [
  'Dry lot (Feedpad)',
  'Solid Storage (Stockpile)',
  'Composting (Passive Windrow)',
  'Uncovered anaerobic lagoon (Effluent Pond)',
  'Direct application', // This is not strictly derived from references. It is implicit and added to allow easier data entry
] as const;
export type FeedlotMMSType = (typeof FeedlotMMSTypes)[number];

export const FeedlotDurationTypes = ['0-80 days', '81-200 days', '201+ days'];

export type FeedlotDurationType = (typeof FeedlotDurationTypes)[number];

export const groupDurationToDurationType = (
  duration: number,
): FeedlotDurationType => {
  if (duration <= 80) {
    return '0-80 days';
  } else if (duration <= 200) {
    return '81-200 days';
  } else {
    return '201+ days';
  }
};

export const DairySystems = [
  'Grazed only',
  'Limited feedpad',
  'Limited grazing',
  'Zero grazing',
] as const;
export type DairySystem = (typeof DairySystems)[number];

export const DairyClasses = [
  'milkingCows',
  'heifersGt1',
  'heifersLt1',
  'bullsGt1',
  'bullsLt1',
] as const;
export type DairyClass = (typeof DairyClasses)[number];

export const DairyMMSTypes = [
  'anaerobicLagoon',
  'sumpDispersal',
  'drainToPaddock',
  'solidStorage',
  'pastureRangeAndPaddock',
] as const;
export type DairyMMSType = (typeof DairyMMSTypes)[number];

export const PoultryClasses = [
  'layers',
  'meatChickenGrowers',
  'meatChickenBreeder',
  'meatOther',
] as const;
export type PoultryClass = (typeof PoultryClasses)[number];

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
] as const;
export type PoultryMMS2Type = (typeof PoultryMMS2Types)[number];

export const PoultryMMS2TypesWithPasture = [
  ...PoultryMMS2Types,
  'directApplication',
] as const;
export type PoultryMMS2TypeWithPasture =
  (typeof PoultryMMS2TypesWithPasture)[number];

export const PoultryMMSTypes = [
  ...PoultryMMS1Types,
  ...PoultryMMS2Types,
] as const;
export type PoultryMMSType = (typeof PoultryMMSTypes)[number];

export const PoultryMMSTypesWithPasture = [
  ...PoultryMMS1TypesWithPasture,
  ...PoultryMMS2TypesWithPasture,
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

export const PurchasedPackagingTypes = [
  '1 tonne polypropylene bag',
  '25 kg polypropylene bag',
  '20L high density polyethylene (HDPE) container',
  '1000L intermediate bulk containers',
  'Plastic crate polypropylene',
] as const;
export type PurchasedPackagingType = (typeof PurchasedPackagingTypes)[number];

export const PurchasedGrowMediaByVolumeTypes = [
  'PLACEHOLDER_VOLUME_TYPE',
] as const;
export type PurchasedGrowMediaByVolumeType =
  (typeof PurchasedGrowMediaByVolumeTypes)[number];

export const PurchasedGrowMediaByMassTypes = ['PLACEHOLDER_MASS_TYPE'] as const;
export type PurchasedGrowMediaByMassType =
  (typeof PurchasedGrowMediaByMassTypes)[number];

export const isPurchasedGrowMediaByVolume = (
  growMedia: PurchasedGrowMediaByVolumeType | PurchasedGrowMediaByMassType,
): growMedia is PurchasedGrowMediaByVolumeType => {
  return PurchasedGrowMediaByVolumeTypes.includes(
    growMedia as PurchasedGrowMediaByVolumeType,
  );
};

export const isPurchasedGrowMediaByMass = (
  growMedia: PurchasedGrowMediaByVolumeType | PurchasedGrowMediaByMassType,
): growMedia is PurchasedGrowMediaByMassType => {
  return PurchasedGrowMediaByMassTypes.includes(
    growMedia as PurchasedGrowMediaByMassType,
  );
};

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
const isNTRegion = (region: StateOrRegion): region is NTRegion => {
  return NTRegions.includes(region as NTRegion);
};

const QLDRegions = [
  'QLD - High',
  'QLD - Moderate/High',
  'QLD - Moderate/Low',
  'QLD - Low',
] as const;
type QLDRegion = (typeof QLDRegions)[number];
const isQLDRegion = (region: StateOrRegion): region is QLDRegion => {
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

export const stateOrRegionToExtendedRegion = (
  stateOrRegion: StateOrRegion,
): ExtendedRegion => {
  if (stateOrRegion === 'ACT' || stateOrRegion === 'NSW') {
    return 'ACT/NSW';
  } else {
    return stateOrRegion;
  }
};

export const stateOrRegionToLimitedRegion = (
  stateOrRegion: StateOrRegion,
): LimitedRegion => {
  if (isNTRegion(stateOrRegion)) {
    return 'NT';
  } else if (isQLDRegion(stateOrRegion)) {
    return 'QLD';
  } else if (stateOrRegion === 'ACT' || stateOrRegion === 'NSW') {
    return 'ACT/NSW';
  } else {
    return stateOrRegion;
  }
};

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

export const BeefClassesWithCalves = ['cows2To3Years', 'cowsGt3Years'] as const;
export type BeefClassWithCalves = (typeof BeefClassesWithCalves)[number];

export const WastewaterFacilityTypes = [
  'Managed aerobic treatment',
  'Unmanaged aerobic treatment',
  'Anaerobic digestor/reactor',
  'Shallow anaerobic lagoon', // ≤ 2m
  'Deep anaerobic lagoon', // > 2m
] as const;
export type WastewaterFacilityType = (typeof WastewaterFacilityTypes)[number];
export const PureStates = [
  'ACT',
  'NSW',
  'VIC',
  'QLD',
  'SA',
  'TAS',
  'NT',
  'WA',
] as const;
export type PureState = (typeof PureStates)[number];
export const isPureState = (state: string): state is PureState => {
  return PureStates.includes(state as PureState);
};

export const stateOrRegionToPureState = (
  stateOrRegion: StateOrRegion,
): PureState => {
  if (isPureState(stateOrRegion)) {
    return stateOrRegion;
  } else if (isNTRegion(stateOrRegion)) {
    return 'NT';
  } else if (isQLDRegion(stateOrRegion)) {
    return 'QLD';
  } else {
    return 'WA';
  }
};

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

export const isPerennialWoodyCropFull = (
  crop: PerennialWoodyCropFull | PerennialWoodyCropPartial,
): crop is PerennialWoodyCropFull => {
  return PerennialWoodyCropsFull.includes(crop as PerennialWoodyCropFull);
};
