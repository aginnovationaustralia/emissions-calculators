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

export const RefrigerantTypes = [
  'R22',
  'R32',
  'R134A',
  'R410A',
  'R404A',
] as const;
export type RefrigerantType = (typeof RefrigerantTypes)[number];

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
  'Herbicide (paraquat, diquat, glyphosate)',
  'Other herbicide',
  'Insecticide',
  'Fungicide',
  'Plant growth regulator',
] as const;

export type AgrochemicalType = (typeof AgrochemicalTypes)[number];

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
