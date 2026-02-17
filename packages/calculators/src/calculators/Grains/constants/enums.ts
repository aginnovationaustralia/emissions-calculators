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
  'Monoammonium phosphate',
  'Diammonium Phosphate',
  'Urea',
  'Sulphate of Ammonia',
  'Urea-Ammonium Nitrate',
  'Ammonium nitrate',
  'Calcium Ammonium Nitrate',
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
  'Anaerobic digester / Covered lagoon',
  'Short HRT tank storage < 1 month (pit storage)',
] as const;
export type SwineMMSType = (typeof SwineMMSTypes)[number];

/*
Petroleum based oils
38.8 GJ/kL 13.9 0.0 0.0 13.9 18.0
Petroleum based greases
38.8 GJ/kL 3.5 0.0 0.0 3.5 18.0
Crude oil including crude oil condensates
45.3 GJ/t 69.6 0.08 0.2 69.88 NE
Other natural gas liquids
46.5 GJ/t 61.0 0.08 0.2 61.28 NE
Automotive gasoline/petrol (other than for use as fuel in an aircraft)
34.2 GJ/kL 67.4 0.2 0.2 67.80 17.2
Aviation gasoline
33.1 GJ/kL 67 0.2 0.2 67.40 18.0
Kerosene (other than for use as fuel in an aircraft)
37.5 GJ/kL 68.9 0.01 0.2 69.11 18.0
Aviation turbine fuel/kerosene
36.8 GJ/kL 69.6 0.02 0.2 69.82 18.0
Heating oil
37.3 GJ/kL 69.5 0.03 0.2 69.73 18.0
Diesel oil
38.6 GJ/kL 69.9 0.1 0.2 70.20 17.3
Fuel oil
39.7 GJ/kL 73.6 0.04 0.2 73.84 18.0
Liquefied aromatic hydrocarbons
34.4 GJ/kL 69.7 0.03 0.2 69.93 18.0
Solvents: mineral turpentine or white spirits
34.4 GJ/kL 69.7 0.03 0.2 69.93 18.0
Liquefied petroleum gas (LPG)
25.7 GJ/kL 60.2 0.2 0.2 60.60 20.2
Naphtha
31.4 GJ/kL 69.8 0.01 0.01 69.82 18.0
Petroleum coke
34.2 GJ/t 92.6 0.08 0.2 92.88 18.0
Refinery gas and liquids
42.9 GJ/t 54.7 0.03 0.03 54.76 18.0
Refinery coke
34.2 GJ/t 92.6 0.08 0.2 92.88 18.0
Petroleum based products other than mentioned in the items above
34.4 GJ/kL 69.8 0.02 0.1 69.92 18.0
Biodiesel
34.6 GJ/kL 0.0 0.08 0.2 0.28 NE
Ethanol for use as a fuel in an internal combustion engine
23.4 GJ/kL 0.0 0.08 0.2 0.28 NE
Biofuels other than those mentioned in the items above and below
23.4 GJ/kL 0.0 0.08 0.2 0.28 NE
Renewable aviation kerosene
36.8 GJ/kL 0.0 0.02 0.2 0.22 NE
Renewable diesel
38.6 GJ/kL 0.0 0.1 0.2 0.30 NE
*/
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

export const TransportFuelTypes = [
  'gasoline',
  'diesel',
  'lpg',
  'fuel oil',
  'ethanol',
  'biodiesel',
  'renewable diesel',
  'other biofuels',
  'lng',
  'aviation gasoline',
  'aviation kerosene',
  'aviation renewable kerosone',
] as const;
export type TransportFuelType = (typeof TransportFuelTypes)[number];

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
  'Tuber and Roots',
  'Peanuts',
  'Sugar Cane',
  'Cotton',
  'Hops',
  'Oilseeds',
  'Forage Crops',
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
  'Inert waste',
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
  'Inert waste',
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
  'Inert waste',
  'Municipal solid waste',
  'Commercial waste',
  'Industrial waste',
  'Construction and demolition waste',
] as const;
export type SolidWasteByVolumeType = (typeof SolidWasteByVolumeTypes)[number];
