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
  'Herbicide (paraquat, diquat, glyphosate)',
  'Other herbicide',
  'Insecticide',
  'Fungicide',
  'Plant growth regulator',
] as const;

export type AgrochemicalType = (typeof AgrochemicalTypes)[number];

export const PurchasedFeedTypes = [
  'Meat Meal',
  'Blood Meal',
  'Millrun',
  'Whole Sardines',
  'Low Animal Protein',
  'Formulated Feed',
  'Squid',
  'Whole Fish', // listed as 'Whole fish' in Appendix A1 A.3.1.2, capitalised for consistency.
  'Custom Bait',
  // The following come verbatim from AusLCI CF V47
  'Almond hulls and shells, at huller and sheller ',
  'Animal feed, meat chickens , meat chicken feed production',
  'Animal feed, pigs , pig feed production',
  'Animal protein meal , dry rendering',
  'Animal protein meal , market for meat meal',
  'Bagasse, surplus at mill gate , AU-QLD, sugarcane milling',
  'Barley straw , AU-NSW, market for barley straw',
  'Barley straw , AU-NT, market for barley straw',
  'Barley straw , AU-QLD, market for barley straw',
  'Barley straw , AU-SA, market for barley straw',
  'Barley straw , AU-TAS, market for barley straw',
  'Barley straw , AU-VIC, market for barley straw',
  'Barley straw , AU-WA, market for barley straw',
  'Barley straw , market for barley straw',
  'Barley straw, dryland, Brisbane , AU-QLD, barley grain production',
  'Barley straw, dryland, C Highlands , AU-QLD, barley grain production',
  'Barley straw, dryland, Central Plains , AU-NSW, barley grain production',
  'Barley straw, dryland, Darling D , AU-QLD, barley grain production',
  'Barley straw, dryland, Dawson , AU-QLD, barley grain production',
  'Barley straw, dryland, Desserts , AU-SA, barley grain production',
  'Barley straw, dryland, Goldfields , AU-SA, barley grain production',
  'Barley straw, dryland, Granite Belt , AU-NSW, barley grain production',
  'Barley straw, dryland, Lower SW , AU-WA, barley grain production',
  'Barley straw, dryland, Mallee , AU-SA, barley grain production',
  'Barley straw, dryland, Maranoa , AU-QLD, barley grain production',
  'Barley straw, dryland, Melbourne , AU-VIC, barley grain production',
  'Barley straw, dryland, N Central , AU-TAS, barley grain production',
  'Barley straw, dryland, Riverina , AU-VIC, barley grain production',
  'Barley straw, dryland, S Coast , AU-SA, barley grain production',
  'Barley straw, dryland, S Highland and Gippsland , AU-NSW, barley grain production',
  'Barley straw, dryland, SE Vic Coast , AU-VIC, barley grain production',
  'Barley straw, dryland, South West , AU-WA, barley grain production',
  'Barley straw, dryland, W Downs , AU-NSW, barley grain production',
  'Barley straw, dryland, W Wheatbelt , AU-WA, barley grain production',
  'Barley straw, dryland, WB Burnett , AU-QLD, barley grain production',
  'Beef pet food, hot standard carcase weight , cattle processing',
  'Blood meal , dry rendering',
  'Blood meal , market for meat meal',
  'Canola straw , AU-NSW, market for canola straw',
  'Canola straw , AU-NT, market for canola straw',
  'Canola straw , AU-QLD, market for canola straw',
  'Canola straw , AU-SA, market for canola straw',
  'Canola straw , AU-TAS, market for canola straw',
  'Canola straw , AU-VIC, market for canola straw',
  'Canola straw , AU-WA, market for canola straw',
  'Canola straw , market for canola straw',
  'Canola straw, dryland, Central Plains , AU-NSW, canola seed production',
  'Canola straw, dryland, Desserts , AU-SA, canola seed production',
  'Canola straw, dryland, Goldfields , AU-SA, canola seed production',
  'Canola straw, dryland, Granite Belt , AU-NSW, canola seed production',
  'Canola straw, dryland, Mallee , AU-SA, canola seed production',
  'Canola straw, dryland, Melbourne , AU-VIC, canola seed production',
  'Canola straw, dryland, N Central , AU-TAS, canola seed production',
  'Canola straw, dryland, Riverina , AU-VIC, canola seed production',
  'Canola straw, dryland, S Coast , AU-SA, canola seed production',
  'Canola straw, dryland, S Highland and Gippsland , AU-NSW, canola seed production',
  'Canola straw, dryland, SE Vic Coast , AU-VIC, canola seed production',
  'Canola straw, dryland, South West , AU-WA, canola seed production',
  'Canola straw, dryland, W Downs , AU-NSW, canola seed production',
  'Canola straw, dryland, W Wheatbelt , AU-WA, canola seed production',
  'Cereal hay , AU-NSW, market for cereal hay',
  'Cereal hay , AU-QLD, market for cereal hay',
  'Cereal hay , AU-SA, market for cereal hay',
  'Cereal hay , AU-TAS, market for cereal hay',
  'Cereal hay , AU-VIC, market for cereal hay',
  'Cereal hay , AU-WA, market for cereal hay',
  'Cereal hay , market for cereal hay',
  'Cereal hay and silage, dryland, Central, NSW, at farm ',
  'Cereal hay and silage, dryland, Northern Rivers and Mid-north Coast, NSW, at farm ',
  'Cereal hay, dryland, Brisbane , AU-QLD, cereal hay production',
  'Cereal hay, dryland, Central Plains , AU-NSW, cereal hay production',
  'Cereal hay, dryland, Darling D , AU-QLD, cereal hay production',
  'Cereal hay, dryland, Dawson , AU-QLD, cereal hay production',
  'Cereal hay, dryland, Goldfields , AU-SA, cereal hay production',
  'Cereal hay, dryland, Granite Belt , AU-NSW, cereal hay production',
  'Cereal hay, dryland, Lower SW , AU-WA, cereal hay production',
  'Cereal hay, dryland, Mallee , AU-SA, cereal hay production',
  'Cereal hay, dryland, Maranoa , AU-QLD, cereal hay production',
  'Cereal hay, dryland, Melbourne , AU-VIC, cereal hay production',
  'Cereal hay, dryland, N Central , AU-TAS, cereal hay production',
  'Cereal hay, dryland, Riverina , AU-VIC, cereal hay production',
  'Cereal hay, dryland, S Coast , AU-SA, cereal hay production',
  'Cereal hay, dryland, S Highland and Gippsland , AU-NSW, cereal hay production',
  'Cereal hay, dryland, SE Vic Coast , AU-VIC, cereal hay production',
  'Cereal hay, dryland, South West , AU-WA, cereal hay production',
  'Cereal hay, dryland, Tas Forest , AU-TAS, cereal hay production',
  'Cereal hay, dryland, W Downs , AU-NSW, cereal hay production',
  'Cereal hay, dryland, W Wheatbelt , AU-WA, cereal hay production',
  'Cereal hay, dryland, WB Burnett , AU-QLD, cereal hay production',
  'Cereal silage , AU-NSW, market for cereal silage',
  'Cereal silage , AU-QLD, market for cereal silage',
  'Cereal silage , AU-SA, market for cereal silage',
  'Cereal silage , AU-TAS, market for cereal silage',
  'Cereal silage , AU-VIC, market for cereal silage',
  'Cereal silage , market for cereal silage',
  'Cereal silage, dryland, Central Plains , AU-NSW, cereal silage production',
  'Cereal silage, dryland, Dawson , AU-QLD, cereal silage production',
  'Cereal silage, dryland, Melbourne , AU-VIC, cereal silage production',
  'Cereal silage, dryland, Riverina , AU-VIC, cereal silage production',
  'Cereal silage, dryland, S Highland and Gippsland , AU-NSW, cereal silage production',
  'Cereal silage, dryland, SE Vic Coast , AU-VIC, cereal silage production',
  'Cereal silage, dryland, Tas Forest , AU-TAS, cereal silage production',
  'Cereal silage, dryland, WB Burnett , AU-QLD, cereal silage production',
  'Chicken feed , market for chicken feed',
  'Chicken pet food , chicken meat processing',
  'Chickpea straw, dryland, Brisbane , AU-QLD, chickpea production',
  'Chickpea straw, dryland, Burdekin , AU-QLD, chickpea production',
  'Chickpea straw, dryland, Burnett , AU-QLD, chickpea production',
  'Chickpea straw, dryland, C Highlands , AU-QLD, chickpea production',
  'Chickpea straw, dryland, C QLD Coast , AU-QLD, chickpea production',
  'Chickpea straw, dryland, Central Plains , AU-NSW, chickpea production',
  'Chickpea straw, dryland, Darling D , AU-QLD, chickpea production',
  'Chickpea straw, dryland, Dawson , AU-QLD, chickpea production',
  'Chickpea straw, dryland, Desserts , AU-SA, chickpea production',
  'Chickpea straw, dryland, Goldfields , AU-SA, chickpea production',
  'Chickpea straw, dryland, Granite Belt , AU-NSW, chickpea production',
  'Chickpea straw, dryland, Mallee , AU-SA, chickpea production',
  'Chickpea straw, dryland, Maranoa , AU-QLD, chickpea production',
  'Chickpea straw, dryland, Riverina , AU-VIC, chickpea production',
  'Chickpea straw, dryland, S Coast , AU-SA, chickpea production',
  'Chickpea straw, dryland, South West , AU-WA, chickpea production',
  'Chickpea straw, dryland, W Downs , AU-NSW, chickpea production',
  'Chickpea straw, dryland, W Wheatbelt , AU-WA, chickpea production',
  'Chickpea straw, dryland, WB Burnett , AU-QLD, chickpea production',
  'Cottonseed hulls, at mill ',
  'Dairy calf feed , market for dairy calf feed',
  'Dairy calf feed, concentrate meal , AU-VIC, Production of dairy calf feed',
  'Dairy cow feed , market for dairy cow feed',
  'Dairy cow feed, concentrate meal , AU-VIC, Production of dairy cow feed',
  'Dry season mix, 30% urea, 5,4% P, with protein meal, at production ',
  'Dry season mix, 30% urea, 5.5% P, at production ',
  'Dry season mix, 8% urea, 2,8% P, with protein meal, at production ',
  'Faba bean straw, dryland, Brisbane , AU-QLD, faba bean production',
  'Faba bean straw, dryland, Burdekin , AU-QLD, faba bean production',
  'Faba bean straw, dryland, Burnett , AU-QLD, faba bean production',
  'Faba bean straw, dryland, C Highlands , AU-QLD, faba bean production',
  'Faba bean straw, dryland, C QLD Coast , AU-QLD, faba bean production',
  'Faba bean straw, dryland, Darling D , AU-QLD, faba bean production',
  'Faba bean straw, dryland, Dawson , AU-QLD, faba bean production',
  'Faba bean straw, dryland, Desserts , AU-SA, faba bean production',
  'Faba bean straw, dryland, Goldfields , AU-SA, faba bean production',
  'Faba bean straw, dryland, Granite Belt , AU-NSW, faba bean production',
  'Faba bean straw, dryland, Mallee , AU-SA, faba bean production',
  'Faba bean straw, dryland, Maranoa , AU-QLD, faba bean production',
  'Faba bean straw, dryland, Riverina , AU-VIC, faba bean production',
  'Faba bean straw, dryland, S Coast , AU-SA, faba bean production',
  'Faba bean straw, dryland, SE Vic Coast , AU-VIC, faba bean production',
  'Faba bean straw, dryland, South West , AU-WA, faba bean production',
  'Faba bean straw, dryland, W Wheatbelt , AU-WA, faba bean production',
  'Faba bean straw, dryland, WB Burnett , AU-QLD, faba bean production',
  'Field bean straw, dryland, S Coast , AU-SA, field bean production',
  'Field pea straw, dryland, Central Plains , AU-NSW, field pea production',
  'Field pea straw, dryland, Desserts , AU-SA, field pea production',
  'Field pea straw, dryland, Goldfields , AU-SA, field pea production',
  'Field pea straw, dryland, Mallee , AU-SA, field pea production',
  'Field pea straw, dryland, Riverina , AU-VIC, field pea production',
  'Field pea straw, dryland, S Highland and Gippsland , AU-NSW, field pea production',
  'Field pea straw, dryland, SE Vic Coast , AU-VIC, field pea production',
  'Field pea straw, dryland, South West , AU-WA, field pea production',
  'Field pea straw, dryland, W Downs , AU-NSW, field pea production',
  'Field pea straw, dryland, W Wheatbelt , AU-WA, field pea production',
  'Forage sorghum , market for forage sorghum',
  'Forage sorghum, dryland, Darling D , AU-QLD, forage sorghum production',
  'Forage sorghum, dryland, Maranoa , AU-QLD, forage sorghum production',
  'Forage sorghum, dryland, Riverina , AU-VIC, forage sorghum production',
  'Forage sorghum, irrigated, Darling Downs QLD ',
  'Forage sorghum, irrigated, northern Victoria ',
  'Health treatment and growth promotant, per feeder steer, NT ',
  'Lamb pet food, hot standard carcase weight , lamb processing',
  'Lentil straw, dryland, Brisbane , AU-QLD, lentils production',
  'Lentil straw, dryland, Central Plains , AU-NSW, lentils production',
  'Lentil straw, dryland, Goldfields , AU-SA, lentils production',
  'Lentil straw, dryland, Granite Belt , AU-NSW, lentils production',
  'Lentil straw, dryland, Mallee , AU-SA, lentils production',
  'Lentil straw, dryland, Riverina , AU-VIC, lentils production',
  'Lentil straw, dryland, S Coast , AU-SA, lentils production',
  'Lentil straw, dryland, South West , AU-WA, lentils production',
  'Lentil straw, dryland, W Downs , AU-NSW, lentils production',
  'Lentil straw, dryland, W Wheatbelt , AU-WA, lentils production',
  'Lucerne hay, dryland, Brisbane , AU-QLD, lucerne production',
  'Lucerne hay, dryland, Granite Belt , AU-NSW, lucerne production',
  'Lucerne hay, dryland, Melbourne , AU-VIC, lucerne production',
  'Lucerne hay, dryland, N Central , AU-TAS, lucerne production',
  'Lucerne hay, dryland, Riverina , AU-VIC, lucerne production',
  'Lucerne hay, dryland, SE Vic Coast , AU-VIC, lucerne production',
  'Lucerne hay, dryland, Sydney , AU-NSW, lucerne production',
  'Lucerne hay, dryland, WB Burnett , AU-QLD, lucerne production',
  'Lucerne hay, irrigated, Brisbane , AU-QLD, lucerne production',
  'Lucerne hay, irrigated, Granite Belt , AU-NSW, lucerne production',
  'Lucerne hay, irrigated, Melbourne , AU-VIC, lucerne production',
  'Lucerne hay, irrigated, N Central , AU-TAS, lucerne production',
  'Lucerne hay, irrigated, Riverina , AU-VIC, lucerne production',
  'Lucerne hay, irrigated, SE Vic Coast , AU-VIC, lucerne production',
  'Lucerne hay, irrigated, Sydney , AU-NSW, lucerne production',
  'Lucerne hay, irrigated, WB Burnett , AU-QLD, lucerne production',
  'Lupin straw, dryland, Central Plains , AU-NSW, lupin production',
  'Lupin straw, dryland, Darling D , AU-QLD, lupin production',
  'Lupin straw, dryland, Dawson , AU-QLD, lupin production',
  'Lupin straw, dryland, Goldfields , AU-SA, lupin production',
  'Lupin straw, dryland, Granite Belt , AU-NSW, lupin production',
  'Lupin straw, dryland, Mallee , AU-SA, lupin production',
  'Lupin straw, dryland, Riverina , AU-VIC, lupin production',
  'Lupin straw, dryland, S Coast , AU-SA, lupin production',
  'Lupin straw, dryland, S Highland and Gippsland , AU-NSW, lupin production',
  'Lupin straw, dryland, SE Vic Coast , AU-VIC, lupin production',
  'Lupin straw, dryland, South West , AU-WA, lupin production',
  'Lupin straw, dryland, W Downs , AU-NSW, lupin production',
  'Lupin straw, dryland, W Wheatbelt , AU-WA, lupin production',
  'Maize silage , AU-VIC, market for maize silage',
  'Maize silage, irrigated, Central Plains , AU-NSW, maize silage production',
  'Maize silage, irrigated, Darling D , AU-QLD, maize silage production',
  'Maize silage, irrigated, Dawson , AU-QLD, maize silage production',
  'Maize silage, irrigated, Granite Belt , AU-NSW, maize silage production',
  'Maize silage, irrigated, N Rivers , AU-NSW, maize silage production',
  'Maize silage, irrigated, Riverina , AU-VIC, maize silage production',
  'Maize silage, irrigated, S Highland and Gippsland , AU-NSW, maize silage production',
  'Maize silage, irrigated, W Downs , AU-NSW, maize silage production',
  'Maize silage, irrigated, WB Burnett , AU-QLD, maize silage production',
  'Maize straw , AU-NSW, market for maize straw',
  'Maize straw , AU-NT, market for maize straw',
  'Maize straw , AU-QLD, market for maize straw',
  'Maize straw , AU-SA, market for maize straw',
  'Maize straw , AU-VIC, market for maize straw',
  'Maize straw , AU-WA, market for maize straw',
  'Maize straw , market for maize straw',
  'Maize straw, dryland, Brisbane , AU-QLD, maize production',
  'Maize straw, dryland, Burnett , AU-QLD, maize production',
  'Maize straw, dryland, Central Plains , AU-NSW, maize production',
  'Maize straw, dryland, Darling D , AU-QLD, maize production',
  'Maize straw, dryland, Dawson , AU-QLD, maize production',
  'Maize straw, dryland, Goldfields , AU-SA, maize production',
  'Maize straw, dryland, Granite Belt , AU-NSW, maize production',
  'Maize straw, dryland, Kimberly , AU-WA, maize production',
  'Maize straw, dryland, Riverina , AU-VIC, maize production',
  'Maize straw, dryland, S Highland and Gippsland , AU-NSW, maize production',
  'Maize straw, dryland, W Downs , AU-NSW, maize production',
  'Maize straw, dryland, WB Burnett , AU-QLD, maize production',
  'Maize, silage irrigated, northern Victoria ',
  'Mineral block, 30% urea 3,6% P, at production ',
  'Molasses, C-grade, at mill gate, , AU-QLD, sugarcane milling',
  'Mung bean straw, dryland, Brisbane , AU-QLD, mung bean production',
  'Mung bean straw, dryland, Burdekin , AU-QLD, mung bean production',
  'Mung bean straw, dryland, Burnett , AU-QLD, mung bean production',
  'Mung bean straw, dryland, C Highlands , AU-QLD, mung bean production',
  'Mung bean straw, dryland, C QLD Coast , AU-QLD, mung bean production',
  'Mung bean straw, dryland, Darling D , AU-QLD, mung bean production',
  'Mung bean straw, dryland, Dawson , AU-QLD, mung bean production',
  'Mung bean straw, dryland, Granite Belt , AU-NSW, mung bean production',
  'Mung bean straw, dryland, Maranoa , AU-QLD, mung bean production',
  'Mung bean straw, dryland, WB Burnett , AU-QLD, mung bean production',
  'Native Pasture hay, Northern Australia ',
  'Oat hay , AU-NSW, market for oat hay',
  'Oat hay , AU-QLD, market for oat hay',
  'Oat hay , AU-SA, market for oat hay',
  'Oat hay , AU-VIC, market for oat hay',
  'Oat hay , AU-WA, market for oat hay',
  'Oat hay , market for oat hay',
  'Oat straw , AU-NSW, market for oat straw',
  'Oat straw , AU-QLD, market for oat straw',
  'Oat straw , AU-SA, market for oat straw',
  'Oat straw , AU-TAS, market for oat straw',
  'Oat straw , AU-VIC, market for oat straw',
  'Oat straw , AU-WA, market for oat straw',
  'Oat straw , market for oat straw',
  'Oat straw, dryland, Central Plains , AU-NSW, oats production',
  'Oat straw, dryland, Chanel , AU-QLD, oats production',
  'Oat straw, dryland, Darling D , AU-QLD, oats production',
  'Oat straw, dryland, Dawson , AU-QLD, oats production',
  'Oat straw, dryland, Goldfields , AU-SA, oats production',
  'Oat straw, dryland, Granite Belt , AU-NSW, oats production',
  'Oat straw, dryland, Lower SW , AU-WA, oats production',
  'Oat straw, dryland, Mallee , AU-SA, oats production',
  'Oat straw, dryland, Maranoa , AU-QLD, oats production',
  'Oat straw, dryland, N Central , AU-TAS, oats production',
  'Oat straw, dryland, N Rivers , AU-NSW, oats production',
  'Oat straw, dryland, Riverina , AU-VIC, oats production',
  'Oat straw, dryland, S Coast , AU-SA, oats production',
  'Oat straw, dryland, S Highland and Gippsland , AU-NSW, oats production',
  'Oat straw, dryland, SE Vic Coast , AU-VIC, oats production',
  'Oat straw, dryland, South West , AU-WA, oats production',
  'Oat straw, dryland, W Downs , AU-NSW, oats production',
  'Oat straw, dryland, W Wheatbelt , AU-WA, oats production',
  'Oaten hay for export, dryland, Central Plains , AU-NSW, oat hay production',
  'Oaten hay for export, dryland, Goldfields , AU-SA, oat hay production',
  'Oaten hay for export, dryland, Granite Belt , AU-NSW, oat hay production',
  'Oaten hay for export, dryland, Lower SW , AU-WA, oat hay production',
  'Oaten hay for export, dryland, Mallee , AU-SA, oat hay production',
  'Oaten hay for export, dryland, Melbourne , AU-VIC, oat hay production',
  'Oaten hay for export, dryland, Riverina , AU-VIC, oat hay production',
  'Oaten hay for export, dryland, S Coast , AU-SA, oat hay production',
  'Oaten hay for export, dryland, S Highland and Gippsland , AU-NSW, oat hay production',
  'Oaten hay for export, dryland, SE Vic Coast , AU-VIC, oat hay production',
  'Oaten hay for export, dryland, South West , AU-WA, oat hay production',
  'Oaten hay for export, dryland, W Downs , AU-NSW, oat hay production',
  'Oaten hay for export, dryland, W Wheatbelt , AU-WA, oat hay production',
  'Oaten hay, export, medium rainfall zone SA ',
  'Pasture establishment, SE Qld ',
  'Pasture establishment, top end, NT ',
  'Pasture hay , AU-NSW, market for pasture hay',
  'Pasture hay , AU-QLD, market for pasture hay',
  'Pasture hay , AU-SA, market for pasture hay',
  'Pasture hay , AU-TAS, market for pasture hay',
  'Pasture hay , AU-VIC, market for pasture hay',
  'Pasture hay , AU-WA, market for pasture hay',
  'Pasture hay , market for pasture hay',
  'Pasture hay, dryland, Central Plains , AU-NSW, pasture hay production',
  'Pasture hay, dryland, Dawson , AU-QLD, pasture hay production',
  'Pasture hay, dryland, Lower SW , AU-WA, pasture hay production',
  'Pasture hay, dryland, Maranoa , AU-QLD, pasture hay production',
  'Pasture hay, dryland, Melbourne , AU-VIC, pasture hay production',
  'Pasture hay, dryland, N Central , AU-TAS, pasture hay production',
  'Pasture hay, dryland, N Rivers , AU-NSW, pasture hay production',
  'Pasture hay, dryland, Riverina , AU-VIC, pasture hay production',
  'Pasture hay, dryland, S Highland and Gippsland , AU-NSW, pasture hay production',
  'Pasture hay, dryland, SE Vic Coast , AU-VIC, pasture hay production',
  'Pasture hay, dryland, South West , AU-WA, pasture hay production',
  'Pasture hay, dryland, Sydney , AU-NSW, pasture hay production',
  'Pasture hay, dryland, Tas Forest , AU-TAS, pasture hay production',
  'Pet food, beef , market for pet food from beef processing',
  'Pet food, lamb , market for pet food from lamb processing',
  'Pet food, pork , market for pet food from pork processing',
  'Pig feed , market for pig feed',
  'Pork pet food, hot standard carcase weight , pork processing',
  'Rice husk, Riverina , AU-NSW, rice processing',
  'Sorghum straw , AU-NSW, market for sorghum straw',
  'Sorghum straw , AU-QLD, market for sorghum straw',
  'Sorghum straw , AU-SA, market for sorghum straw',
  'Sorghum straw , AU-VIC, market for sorghum straw',
  'Sorghum straw , market for sorghum straw',
  'Sorghum straw, dryland, Brisbane , AU-QLD, sorghum production',
  'Sorghum straw, dryland, Burdekin , AU-QLD, sorghum production',
  'Sorghum straw, dryland, Burnett , AU-QLD, sorghum production',
  'Sorghum straw, dryland, C Highlands , AU-QLD, sorghum production',
  'Sorghum straw, dryland, C QLD Coast , AU-QLD, sorghum production',
  'Sorghum straw, dryland, Cape York , AU-QLD, sorghum production',
  'Sorghum straw, dryland, Central Plains , AU-NSW, sorghum production',
  'Sorghum straw, dryland, Darling D , AU-QLD, sorghum production',
  'Sorghum straw, dryland, Dawson , AU-QLD, sorghum production',
  'Sorghum straw, dryland, Granite Belt , AU-NSW, sorghum production',
  'Sorghum straw, dryland, Maranoa , AU-QLD, sorghum production',
  'Sorghum straw, dryland, Riverina , AU-VIC, sorghum production',
  'Sorghum straw, dryland, S Highland and Gippsland , AU-NSW, sorghum production',
  'Sorghum straw, dryland, W Downs , AU-NSW, sorghum production',
  'Sorghum straw, dryland, WB Burnett , AU-QLD, sorghum production',
  'Sunflower straw, dryland, Burdekin , AU-QLD, sunflower production',
  'Sunflower straw, dryland, C QLD Coast , AU-QLD, sunflower production',
  'Sunflower straw, dryland, Central Plains , AU-NSW, sunflower production',
  'Sunflower straw, dryland, Darling D , AU-QLD, sunflower production',
  'Sunflower straw, dryland, Dawson , AU-QLD, sunflower production',
  'Sunflower straw, dryland, Granite Belt , AU-NSW, sunflower production',
  'Sunflower straw, dryland, N Rivers , AU-NSW, sunflower production',
  'Sunflower straw, dryland, Riverina , AU-VIC, sunflower production',
  'Sunflower straw, dryland, W Downs , AU-NSW, sunflower production',
  'Sunflower straw, dryland, WB Burnett , AU-QLD, sunflower production',
  'Tallow , dry rendering',
  'Tallow , market for tallow',
  'Vaccination and anthelmintic, herd requirement per breeder, northern cattle ',
  'Weaner Block, 7,1% Urea 0,5% P, at production ',
  'Wet season mix, 0% N 21% P, at production ',
  'Wet season mix, 20% GranAm, 40% Kynofos, 40% Salt, at production ',
  'Wheat straw , AU-NSW, market for wheat straw',
  'Wheat straw , AU-NT, market for wheat straw',
  'Wheat straw , AU-QLD, market for wheat straw',
  'Wheat straw , AU-SA, market for wheat straw',
  'Wheat straw , AU-TAS, market for wheat straw',
  'Wheat straw , AU-VIC, market for wheat straw',
  'Wheat straw , AU-WA, market for wheat straw',
  'Wheat straw , market for wheat straw',
  'Wheat straw, dryland, Brisbane , AU-QLD, wheat production',
  'Wheat straw, dryland, Burnett , AU-QLD, wheat production',
  'Wheat straw, dryland, C Highlands , AU-QLD, wheat production',
  'Wheat straw, dryland, C QLD Coast , AU-QLD, wheat production',
  'Wheat straw, dryland, Central Plains , AU-NSW, wheat production',
  'Wheat straw, dryland, Chanel , AU-QLD, wheat production',
  'Wheat straw, dryland, Darling D , AU-QLD, wheat production',
  'Wheat straw, dryland, Dawson , AU-QLD, wheat production',
  'Wheat straw, dryland, Desserts , AU-SA, wheat production',
  'Wheat straw, dryland, Gascoyne , AU-WA, wheat production',
  'Wheat straw, dryland, Goldfields , AU-SA, wheat production',
  'Wheat straw, dryland, Granite Belt , AU-NSW, wheat production',
  'Wheat straw, dryland, Lower SW , AU-WA, wheat production',
  'Wheat straw, dryland, Mallee , AU-SA, wheat production',
  'Wheat straw, dryland, Maranoa , AU-QLD, wheat production',
  'Wheat straw, dryland, Melbourne , AU-VIC, wheat production',
  'Wheat straw, dryland, N Central , AU-TAS, wheat production',
  'Wheat straw, dryland, N Rivers , AU-NSW, wheat production',
  'Wheat straw, dryland, Riverina , AU-VIC, wheat production',
  'Wheat straw, dryland, S Coast , AU-SA, wheat production',
  'Wheat straw, dryland, S Highland and Gippsland , AU-NSW, wheat production',
  'Wheat straw, dryland, SE Vic Coast , AU-VIC, wheat production',
  'Wheat straw, dryland, South West , AU-WA, wheat production',
  'Wheat straw, dryland, Tas Forest , AU-TAS, wheat production',
  'Wheat straw, dryland, W Downs , AU-NSW, wheat production',
  'Wheat straw, dryland, W Wheatbelt , AU-WA, wheat production',
  'Wheat straw, dryland, WB Burnett , AU-QLD, wheat production',
];

export type PurchasedFeedType = (typeof PurchasedFeedTypes)[number];

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
