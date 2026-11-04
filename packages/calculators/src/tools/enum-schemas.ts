import * as E from '@/constants/enums';
import { createEnumSchemas } from './generic/inputs';

// -------- Enum OpenAPI components --------
// Every enum used in an input schema must be registered here with a name, which becomes its
// OpenAPI component id (see `createEnumSchemas`). API client generators then produce a named
// enum type (e.g. `StateOrRegion`) instead of a plain string.

const namedEnums = {
  AgrochemicalType: E.AgrochemicalTypes,
  AquacultureSystemLocation: E.AquacultureSystemLocations,
  AviationFuelType: E.AviationFuelTypes,
  BasicCropProductionSystem: E.BasicCropProductionSystems,
  BeefBreed: E.BeefBreeds,
  BeefClass: E.BeefClasses,
  BeefPurchaseCategory: E.BeefPurchaseCategories,
  BurnableCropType: E.BurnableCropTypes,
  CarsLightCommercialFuelType: E.CarsLightCommercialFuelTypes,
  CarsLightCommercialPre2004FuelType: E.CarsLightCommercialPre2004FuelTypes,
  ClimateZoneOrZoneType: E.ClimateZoneOrZoneTypes,
  CropOnlyProductionSystem: E.CropOnlyProductionSystems,
  CropType: E.CropTypes,
  DairyCattleBreed: E.DairyCattleBreeds,
  DairyClass: E.DairyClasses,
  DairyPurchaseCategory: E.DairyPurchaseCategories,
  DairySystem: E.DairySystems,
  ElectricityRegion: E.ElectricityRegions,
  ExtendedRegion: E.ExtendedRegions,
  FreightType: E.FreightTypes,
  FuelStationaryMassBasedLiquidType: E.FuelStationaryMassBasedLiquidTypes,
  FuelStationarySolidType: E.FuelStationarySolidTypes,
  FuelStationaryVolumeBasedLiquidType: E.FuelStationaryVolumeBasedLiquidTypes,
  GrainsCropType: E.GrainsCropTypes,
  GrazingProductionSystemWithRainfall: E.GrazingProductionSystemsWithRainfall,
  HeavyDutyFuelType: E.HeavyDutyFuelTypes,
  HorticultureBurnableCropType: E.HorticultureBurnableCropTypes,
  HorticultureNonBurnableCropType: E.HorticultureNonBurnableCropTypes,
  IBRA7Region: E.IBRA7Regions,
  InorganicFertiliserComponentOrigin: E.InorganicFertiliserComponentOrigins,
  InorganicFertiliserComponentTypeNonRegional:
    E.InorganicFertiliserComponentTypesNonRegional,
  InorganicFertiliserComponentTypeRegional:
    E.InorganicFertiliserComponentTypesRegional,
  InorganicFertiliserProductionSystem: E.ProductionSystemsInorganicFertilisers,
  InorganicFertiliserType: E.InorganicFertiliserTypes,
  LightDutyFuelType: E.LightDutyFuelTypes,
  LimeAmeliorant: E.LimeAmeliorants,
  MatureDairyClass: E.MatureDairyClasses,
  MeanAnnualTemperature: E.MeanAnnualTemperatures,
  NonBurnableCropType: E.NonBurnableCropTypes,
  OffRoadAgricultureAndForestryEquipmentFuelType:
    E.OffRoadAgricultureAndForestryEquipmentFuelTypes,
  OrganicFertiliserType: E.OrganicFertiliserTypes,
  OtherLivestockType: E.OtherLivestockTypes,
  PastureOnlyProductionSystem: E.PastureOnlyProductionSystems,
  PastureType: E.PastureTypes,
  PerennialWoodyCropFull: E.PerennialWoodyCropsFull,
  PerennialWoodyCropPartial: E.PerennialWoodyCropsPartial,
  PigPurchaseCategory: E.PigPurchaseCategories,
  PigsLiveweightClass: E.PigsLiveweightClasses,
  PoultryWeightClass: E.PoultryWeightClasses,
  PreWeanedDairyClass: E.PreWeanedDairyClasses,
  PurchasedFeedAquacultureType: E.PurchasedFeedAquacultureTypes,
  PurchasedFeedLivestockRegionlessType: E.PurchasedFeedLivestockRegionlessTypes,
  PurchasedMineralSupplementType: E.PurchasedMineralSupplementTypes,
  PurchasedPackagingByMassType: E.PurchasedPackagingByMassTypes,
  PurchasedPackagingByUnitsType: E.PurchasedPackagingByUnitsTypes,
  RefrigerantType: E.RefrigerantTypes,
  RefrigerationType: E.RefrigerationTypes,
  RiceCultivationOrganicAmendmentType: E.RiceCultivationOrganicAmendmentTypes,
  RiceCultivationPreSeasonWaterRegimeType:
    E.RiceCultivationPreSeasonWaterRegimeTypes,
  RiceCultivationSeasonWaterRegimeType: E.RiceCultivationSeasonWaterRegimeTypes,
  RiceProductionSystem: E.RiceProductionSystems,
  Season: E.Seasons,
  SheepClass: E.SheepClasses,
  SolidWasteNonStreamType: E.SolidWasteNonStreamTypes,
  SolidWasteOrganicType: E.SolidWasteOrganicTypes,
  SolidWasteScope3IncinerationType: E.SolidWasteScope3IncinerationTypes,
  SolidWasteScope3LandfillType: E.SolidWasteScope3LandfillTypes,
  State: E.States,
  StateOrRegion: E.StateOrRegions,
  VesselFuelType: E.VesselFuelTypes,
  WastewaterCommodity: E.WastewaterCommodities,
  WastewaterFacilityType: E.WastewaterFacilityTypes,
} as const satisfies Record<string, readonly string[]>;

/**
 * The shared Zod schema for a registered enum, emitted as a reusable OpenAPI component.
 * The values may be in any order, but must exactly match an enum registered above.
 */
export const enumSchema = createEnumSchemas(
  namedEnums,
  'namedEnums in src/tools/enum-schemas.ts',
);
