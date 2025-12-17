export const DESCRIPTIONS = {
  ELECTRICITY_RENEWABLE:
    'Percent of total electricity usage that is drawn from renewable sources, between 0 and 1. Unused if `electricitySource` is `Renewable`',
  ELECTRICITY_USE: 'Electricity use in KWh (kilowatt hours)',
  ELECTRICITY_SOURCE: 'Source of electricity',
  REFRIGERANT: 'Refrigerant type',
  PETROL: 'Petrol usage in L (litres)',
  DIESEL: 'Diesel usage in L (litres)',
  LPG: 'LPG Fuel usage in L (litres)',
  MILK_PRODUCTION: 'Milk produced in L/day/head (litres per day per head)',
  GRAINFEED: 'Grain purchased for cattle feed in tonnes',
  HAYFEED: 'Hay purchased for cattle feed in tonnes',
  HAY: 'Hay purchased in tonnes',
  COTTONSEEDFEED: 'Cotton seed purchased for cattle feed in tonnes',
  LIMESTONE: 'Lime applied in tonnes',
  LIMESTONEFRACTION:
    'Fraction of lime as limestone vs dolomite, between 0 and 1',
  HERBICIDE:
    'Total amount of active ingredients of from herbicide (Paraquat, Diquat, Glyphosate) in kg (kilograms)',
  HERBICIDEOTHER:
    'Total amount of active ingredients of from other herbicides in kg (kilograms)',
  VOLATILESOLIDS_OUTDOORSYSTEMS:
    'Amount of volatile solids sent to outoor systems in t (tonnes)',
  VOLATILESOLIDS_COVEREDANAEROBICPOND:
    'Amount of volatile solids sent to covered anaerobic pond in t (tonnes)',
  VOLATILESOLIDS_UNCOVEREDANAEROBICPOND:
    'Amount of volatile solids sent to uncovered anaerobic pond in t (tonnes)',
  VOLATILESOLIDS_DEEPLITTER:
    'Amount of volatile solids sent to deep litter in t (tonnes)',
  VOLATILESOLIDS_AEROBICLAGOON:
    'Amount of volatile solids sent to aerobic lagoon, in t (tonnes)',
  VOLATILESOLIDS_UNDEFINED:
    'Amount of volatile solids where manure management system is not known or defined, in t (tonnes)',
  PURCHASEDWEIGHT:
    'Weight at purchase, in liveweight kg/head (kilogram per head)',
  HEADPURCHASED: 'Number of animals purchased (head)',
  SALEWEIGHT: 'Weight at sale, in liveweight kg/head (kilogram per head)',
  HEADSOLD: 'Number of animals sold (head)',
  LIVEWEIGHT: 'Average liveweight of animals in kg/head (kilogram per head)',
  LIVEWEIGHTGAIN: 'Average liveweight gain in kg/day (kilogram per day)',
  HEAD: 'Number of animals (head)',
  UREACONTENT: 'Fraction of urea content, between 0 and 1',
  CRUDEPROTEIN: 'Crude protein percent, between 0 and 100',
  DRYMATTERDIGESTIBILITY: 'Dry matter digestibility percent, between 0 and 100',
  FEEDAVAILABILITY: 'Feed availability, in t/ha (tonnes per hectare)',
  RAINFALLABOVE600:
    'Is there enough rainfall to drain through the soil profile. Note: this is typically above 600mm',
  RAINFALLIRRIGATIONABOVE600:
    'Is there enough rainfall or irrigation to drain through the soil profile, typically above 600mm',
  STATE:
    'What state the location is in. Note: Western Australia is split up into two regions, `wa_nw` is North-West Western Australia, `wa_sw` is South-West Western Australia',
  NORTHOFTROPIC:
    'Is this farm north of the Tropic of Capricorn. Note: this is currently approximately -23.43621 degrees latitude',
  PROCESSING_PRODUCT: 'Product being processed',
  FUEL: 'Fuels used in this enterprise',
  FUEL_TRANSPORT: 'A list of fuels used in transportation and vehicles',
  FUEL_STATIONARY: 'A list of fuels used in stationary applications',
  FUEL_TYPE: 'Type of fuel',
  FUEL_CONSUMPTION: 'Amount of fuel consumed (litres)',
  NATURAL_GAS: 'Amount of natural gas consumed in Mj (megajoules)',
  PURCHASED_CO2: 'Quantity of CO2 purchased, in kg CO2',
  FLUID_WASTE: 'Amount of fluid waste, in kL (kilolitres)',
  FLUID_WASTE_TREATMENT_ON_SITE: 'Is the fluid waste treated on site?',
  FLUID_WASTE_TREATMENT_TYPE: 'Type of fluid waste treatment',
  AVERAGE_INLET_COD: 'Average inlet COD (mg per litre)',
  AVERAGE_OUTLET_COD: 'Average outlet COD (mg per litre)',
  FLARED_COMBUSTED_FRACTION:
    'Fraction of waste flared or combusted, between 0 and 1',
  SOLID_WASTE_SENT_OFFSITE:
    'Amount of solid waste sent offsite to landfill, in tonnes',
  SOLID_WASTE_COMPOSTED_ONSITE:
    'Amount of solid waste composted on site, in tonnes',
  SOLID_WASTE: 'Solid waste management',
  AQUACULTURE_PRODUCTION_SYSTEM:
    'Production system of the aquaculture enterprise',
  AQUACULTURE_BAIT: 'Bait purchases',
  AQUACULTURE_CUSTOM_BAIT: 'Custom bait purchases',
  INBOUND_FREIGHT: 'Services used to transport goods to the enterprise',
  OUTBOUND_FREIGHT: 'Services used to transport goods from the enterprise',
  TOTAL_COMMERCIAL_FLIGHTS_KM:
    'Total distance of commercial flights, in km (kilometers)',
  TOTAL_KM_TONNES: 'Total distance of freight, in kilometre tonnes',
  FREIGHT_TYPE: 'Type of freight used',
  IRRIGATED: 'Is the crop irrigated?',
  CARBON_OFFSETS:
    'Carbon offsets purchased, in t CO2. Offsetting 2 t CO2 would be 2.0 (not -2.0)',
  ACTIVITY_ID: 'Unique identifier for this activity',
};

const emissionsText = (
  chemical: 'CO2' | 'CH4' | 'N2O',
  use: string,
  cause = 'from',
) => `${chemical} emissions ${cause} ${use}, in tonnes-CO2e`;

const et1 = emissionsText;

export const OUTPUTDESCRIPTIONS = {
  scope1:
    'Scope 1 greenhouse gas emissions are the emissions released to the atmosphere as a direct result of an activity, in tonnes-CO2e (tonnes of carbon dioxide equivalent)',
  scope2:
    'Scope 2 greenhouse gas emissions are the emissions released to the atmosphere from the indirect consumption of an energy commodity, in tonnes-CO2e (tonnes of carbon dioxide equivalent)',
  scope3:
    'Scope 3 emissions are indirect greenhouse gas emissions other than scope 2 emissions that are generated in the wider economy, in tonnes-CO2e (tonnes of carbon dioxide equivalent)',
  fuelCO2: et1('CO2', 'fuel use'),
  fuelCH4: et1('CH4', 'fuel use'),
  fuelN2O: et1('N2O', 'fuel use'),
  transportCO2: et1('CO2', 'transport'),
  transportCH4: et1('CH4', 'transport'),
  transportN2O: et1('N2O', 'transport'),
  limeCO2: et1('CO2', 'lime'),
  ureaCO2: et1('CO2', 'urea'),
  fertiliserN2O: et1('N2O', 'fertiliser'),
  entericCH4: et1('CH4', 'enteric fermentation'),
  leechingN2O: et1('N2O', 'leeching and runoff'),
  atmosphericN2O: et1('N2O', 'atmospheric deposition'),
  atmosphericIndirectN2O: et1('N2O', 'atmospheric deposition indirect'),
  urineDungN2O: et1('N2O', 'urine and dung'),
  manureCH4: et1('CH4', 'manure management'),
  manureN2O: et1('N2O', 'manure management'),
  manureDirectN2O: et1('CH4', 'manure management (direct)'),
  manureIndirectN2O: et1('CH4', 'manure management (indirect)'),
  manureAppliedToSoilN2O: et1('CH4', 'manure applied to soil'),
  cropResidueN2O: et1('N2O', 'crop residue'),
  fieldBurningN2O: et1('N2O', 'field burning'),
  fieldBurningCH4: et1('CH4', 'field burning'),
  riceCultivationCH4: et1('CH4', 'rice cultivation'),
  scope1TotalCO2: 'Total CO2 scope 1 emissions, in tonnes-CO2e',
  scope1TotalCH4: 'Total CH4 scope 1 emissions, in tonnes-CO2e',
  scope1TotalN2O: 'Total N2O scope 1 emissions, in tonnes-CO2e',
  scope1TotalHFCs: 'Total HFCs scope 1 emissions, in tonnes-CO2e',
  scope1Total: 'Total scope 1 emissions, in tonnes-CO2e',
  scope2Total: 'Total scope 2 emissions, in tonnes-CO2e',
  scope3Total: 'Total scope 3 emissions, in tonnes-CO2e',
  electricity: 'Emissions from electricity, in tonnes-CO2e',
  fertiliser: 'Emissions from fertiliser, in tonnes-CO2e',
  purchasedMineralSupplementation:
    'Emissions from purchased mineral supplementation, in tonnes-CO2e',
  purchasedFeed: 'Emissions from purchased feed, in tonnes-CO2e',
  purchasedHay: 'Emissions from purchased hay, in tonnes-CO2e',
  herbicide: 'Emissions from herbicide, in tonnes-CO2e',
  hfcsRefrigerant: 'Emissions from refrigerant leakage, in tonnes-HFCs',
  fuel: 'Emissions from fuel, in tonnes-CO2e',
  solidWasteSentOffsite:
    'Emissions from solid waste sent offsite, in tonnes-CO2e',
  lime: 'Emissions from lime, in tonnes-CO2e',
  purchasedLivestock: 'Emissions from purchased livestock, in tonnes-CO2e',
  purchasedPigs: 'Emissions from purchased pigs, in tonnes-CO2e',
  porkBedding: 'Emissions from purchased bedding, in tonnes-CO2e',
  purchasedBait: 'Emissions from purchased bait, in tonnes-CO2e',
  feed: 'Emissions from feed, in tonnes-CO2e',
  sequestration: 'Carbon sequestration, in tonnes-CO2e',
  purchasedOffsets: 'Purchased offsets, in tonnes-CO2e',
  totalSequestration: 'Annual amount of carbon sequestered, in tonnes-CO2e',
  totalPurchasedOffsets: 'Total amount of purchased offsets, in tonnes-CO2e',
  averageSequestration:
    'Average annual carbon sequestration over 100 years, in tonnes-CO2e/year',
  netEmissionsTotal:
    'Total net emissions of this activity, in tonnes-CO2e/year',
  purchasedCO2: 'Emissions from purchased CO2, in tonnes-CO2e',
  wastewaterCO2: 'Emissions from wastewater, in tonnes-CO2e',
  compostedSolidWasteCO2:
    'Emissions from composted solid waste, in tonnes-CO2e',
  commercialFlights: 'Emissions from commercial flights, in tonnes-CO2e',
  inboundFreight: 'Emissions from inbound freight, in tonnes-CO2e',
  outboundFreight: 'Emissions from outbound freight, in tonnes-CO2e',
};
