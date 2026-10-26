import {
  HasClimateZoneInput,
  hasClimateZoneInputSchema,
  HasClimateZoneInputTransformed,
} from '@/calculators/types/has-climate-zone.input';
import {
  HasIsFebruaryInLeapYearInput,
  HasIsFebruaryInLeapYearInputSchemaForBeef,
  HasIsFebruaryInLeapYearInputSchemaForSheep,
  HasIsFebruaryInLeapYearInputTransformed,
} from '@/calculators/types/has-is-february-in-leap-year.input';
import {
  HasIsInLeachingZoneInput,
  hasIsInLeachingZoneInputSchema,
  HasIsInLeachingZoneInputSchemaForFertiliser,
  HasIsInLeachingZoneInputTransformed,
} from '@/calculators/types/has-is-in-leaching.input';
import {
  HasStateInput,
  hasStateInputSchema,
  HasStateInputTransformed,
} from '@/calculators/types/has-state.input';
import { LULUCFInputSchema } from '@/modules';
import { LULUCFInput, LULUCFInputTransformed } from '@/modules/lulucf/input';
import {
  HasWastewaterTreatmentInput,
  HasWastewaterTreatmentInputSchema,
  HasWastewaterTreatmentInputTransformed,
} from '@/modules/scope1/11-wastewater/wastewater-treatment.input';
import {
  HasSupplementaryCO2Input,
  HasSupplementaryCO2InputSchema,
  HasSupplementaryCO2InputTransformed,
} from '@/modules/scope1/12-supplementary-co2/supplementary-co2.input';
import {
  HasAquacultureSystemInput,
  HasAquacultureSystemInputSchema,
  HasAquacultureSystemInputTransformed,
} from '@/modules/scope1/13-aquatic';
import {
  FertiliserInputSchema,
  HasFertiliserInput,
  HasFertiliserInputTransformed,
} from '@/modules/scope1/5-fertiliser';
import {
  HasLimeInput,
  HasLimeInputSchema,
  HasLimeInputTransformed,
} from '@/modules/scope1/5-fertiliser/lime.input';
import {
  CropResidueInput,
  CropResidueInputSchema,
  CropResidueInputTransformed,
  PastureResidueInput,
  PastureResidueInputSchema,
  PastureResidueInputTransformed,
} from '@/modules/scope1/6-residue-mgmt/crop-residue.input';
import {
  HasRiceCultivationInput,
  HasRiceCultivationInputSchema,
  HasRiceCultivationInputTransformed,
} from '@/modules/scope1/7-rice-cultivation/rice-cultivation.input';
import {
  HasFuelInput,
  hasFuelInputSchema,
  HasFuelInputTransformed,
} from '@/modules/scope1/8-fuel-use';
import {
  RefrigerantsInput,
  RefrigerantsInputSchema,
  RefrigerantsInputTransformed,
} from '@/modules/scope1/9-refrigerant-use/refrigerants.input';
import {
  BeefManureAndEntericHerdInput,
  BeefManureAndEntericHerdInputSchema,
  BeefManureAndEntericHerdInputTransformed,
} from '@/modules/scope1/shared/beef/input';
import {
  DairyHerdLivestockInput,
  DairyHerdLivestockInputSchema,
  DairyHerdLivestockInputTransformed,
} from '@/modules/scope1/shared/dairy/input';
import {
  FeedlotLotLivestockInput,
  FeedlotLotLivestockInputSchema,
  FeedlotLotLivestockInputTransformed,
} from '@/modules/scope1/shared/feedlot/input';
import {
  OtherLivestockManureAndEntericHerdInput,
  OtherLivestockManureAndEntericHerdInputSchema,
  OtherLivestockManureAndEntericHerdInputTransformed,
} from '@/modules/scope1/shared/other-livestock/input';
import {
  PigsHerdLivestockInput,
  PigsHerdLivestockInputSchema,
  PigsHerdLivestockInputTransformed,
} from '@/modules/scope1/shared/pigs/input';
import {
  PoultryFlockLivestockInput,
  PoultryFlockLivestockInputSchema,
  PoultryFlockLivestockInputTransformed,
} from '@/modules/scope1/shared/poultry/input';
import {
  SheepManureAndEntericHerdInput,
  SheepManureAndEntericHerdInputSchema,
  SheepManureAndEntericHerdInputTransformed,
} from '@/modules/scope1/shared/sheep/input';
import {
  HasSolidWasteInput,
  HasSolidWasteInputSchema,
  HasSolidWasteInputTransformed,
} from '@/modules/scope1/shared/solid-waste/input';
import {
  ElectricityInputs,
  ElectricityInputsSchema,
  ElectricityInputsTransformed,
} from '@/modules/scope2/14-electricity/electricity.input';
import {
  HasPurchasedLivestockInput,
  HasPurchasedLivestockInputSchema,
  HasPurchasedLivestockInputTransformed,
} from '@/modules/scope3/15.1-purchased-livestock/input';
import {
  FreightsInput,
  FreightsInputSchema,
  FreightsInputTransformed,
} from '@/modules/scope3/15.13-freight/freights.input';
import {
  HasPurchasedFeedInput,
  HasPurchasedFeedInputSchema,
  HasPurchasedFeedInputTransformed,
} from '@/modules/scope3/15.2-purchased-feed/has-purchased-feed.input';
import {
  PurchasedMineralSupplementsInput,
  PurchasedMineralSupplementsInputSchema,
  PurchasedMineralSupplementsInputTransformed,
} from '@/modules/scope3/15.3-purchased-mineral-supplements/purchased-mineral-supplements.input';
import {
  AgrichemicalsInput,
  AgrichemicalsInputSchema,
  AgrichemicalsInputTransformed,
} from '@/modules/scope3/15.5-agrichemicals/agrichemicals.input';
import {
  PurchasedPackagingsInput,
  PurchasedPackagingsInputSchema,
  PurchasedPackagingsInputTransformed,
} from '@/modules/scope3/15.8-purchased-packaging/purchased-packagings.input';
import {
  OtherPurchasedGoodsAndServicesInput,
  OtherPurchasedGoodsAndServicesInputTransformed,
  OtherPurchasedGoodsAndServicesSchema,
} from '@/modules/scope3/15.9-other-purchases';
import {
  FERT_ORGANIC_5_2,
  PURCH_FUEL_15_10,
  RESIDUE_CROPS_6_1,
  RESIDUE_LEACH_6_3,
  RESIDUE_PASTURE_6_2,
  SERVICES_15_7,
} from '@/tools/modules';
import { object } from '@/types/schemas';
import { z } from 'zod';

// The AllModules input denormalises many shared input keys (fertiliser, lime, waste,
// state, climate zone, etc.) across each livestock module and the shared modules below,
// rather than requiring a single list of activities like the other calculators. Because
// this composes so many large schemas together, TypeScript's declaration emit can't
// serialize the fully-inferred type of the combined schema (TS7056), so the schema is
// built up from named pieces below and the exported schema is given an explicit type.

// NOTE: compose these with `...Schema.shape` spreads rather than zod's `.and()`. `.and()`
// becomes an OpenAPI `allOf` where each side has `additionalProperties: false`, which no
// input can satisfy.

const AllModulesBeefInputSchema = object({
  ...BeefManureAndEntericHerdInputSchema.shape,
  ...HasIsFebruaryInLeapYearInputSchemaForBeef.shape,
});

export type AllModulesBeefInput = BeefManureAndEntericHerdInput &
  HasIsFebruaryInLeapYearInput;
type AllModulesBeefInputTransformed = BeefManureAndEntericHerdInputTransformed &
  HasIsFebruaryInLeapYearInputTransformed;

const AllModulesSheepInputSchema = object({
  ...SheepManureAndEntericHerdInputSchema.shape,
  ...HasIsFebruaryInLeapYearInputSchemaForSheep.shape,
});

export type AllModulesSheepInput = SheepManureAndEntericHerdInput &
  HasIsFebruaryInLeapYearInput;
type AllModulesSheepInputTransformed =
  SheepManureAndEntericHerdInputTransformed &
    HasIsFebruaryInLeapYearInputTransformed;

// TODO: This is creating a double fertiliser input key
const AllModulesFertiliserInputSchema = object({
  ...HasIsInLeachingZoneInputSchemaForFertiliser.shape,
  ...hasClimateZoneInputSchema(FERT_ORGANIC_5_2).shape,
  fertiliser: FertiliserInputSchema,
});
export type AllModulesFertiliserInput = HasIsInLeachingZoneInput &
  HasClimateZoneInput &
  HasFertiliserInput;
type AllModulesFertiliserInputTransformed =
  HasIsInLeachingZoneInputTransformed &
    HasClimateZoneInputTransformed &
    HasFertiliserInputTransformed;

// TODO: Double nested inputs here as well
// `isInLeachingZone` is optional so existing inputs stay valid: omitting it keeps the
// previous behaviour of no crop residue leaching and runoff (6.3).
const AllModulesCropInputSchema = object({
  crop: CropResidueInputSchema,
  ...hasStateInputSchema([RESIDUE_CROPS_6_1, RESIDUE_LEACH_6_3]).shape,
  ...hasClimateZoneInputSchema(RESIDUE_CROPS_6_1).shape,
  ...hasIsInLeachingZoneInputSchema(RESIDUE_LEACH_6_3).shape,
});
export type AllModulesCropInput = {
  crop: CropResidueInput;
} & HasStateInput &
  HasClimateZoneInput &
  HasIsInLeachingZoneInput;
type AllModulesCropInputTransformed = {
  crop: CropResidueInputTransformed;
} & HasStateInputTransformed &
  HasClimateZoneInputTransformed &
  HasIsInLeachingZoneInputTransformed;

const AllModulesPastureInputSchema = object({
  pasture: PastureResidueInputSchema,
  ...hasClimateZoneInputSchema(RESIDUE_PASTURE_6_2).shape,
  ...hasStateInputSchema([RESIDUE_LEACH_6_3]).shape,
  ...hasIsInLeachingZoneInputSchema(RESIDUE_LEACH_6_3).shape,
});
export type AllModulesPastureInput = {
  pasture: PastureResidueInput;
} & HasClimateZoneInput &
  HasStateInput &
  HasIsInLeachingZoneInput;
type AllModulesPastureInputTransformed = {
  pasture: PastureResidueInputTransformed;
} & HasClimateZoneInputTransformed &
  HasStateInputTransformed &
  HasIsInLeachingZoneInputTransformed;

const AllModulesFuelInputSchema = object({
  ...hasStateInputSchema([PURCH_FUEL_15_10]).shape,
  ...hasFuelInputSchema('fuel').shape,
});
export type AllModulesFuelInput = HasStateInput & HasFuelInput;
type AllModulesFuelInputTransformed = HasStateInputTransformed &
  HasFuelInputTransformed;

export type AllModulesServicesInput = HasStateInput & HasFuelInput;
type AllModulesServicesInputTransformed = HasStateInputTransformed &
  HasFuelInputTransformed;

const AllModulesServicesInputSchema = object({
  ...hasStateInputSchema([SERVICES_15_7]).shape,
  ...hasFuelInputSchema('services').shape,
});

const AllModulesRiceInputSchema = object({
  ...HasRiceCultivationInputSchema.shape,
  ...hasStateInputSchema([RESIDUE_CROPS_6_1, RESIDUE_LEACH_6_3]).shape,
  ...hasClimateZoneInputSchema(RESIDUE_CROPS_6_1).shape,
  ...hasIsInLeachingZoneInputSchema(RESIDUE_LEACH_6_3).shape,
});
export type AllModulesRiceInput = HasRiceCultivationInput &
  HasStateInput &
  HasClimateZoneInput &
  HasIsInLeachingZoneInput;
type AllModulesRiceInputTransformed = HasRiceCultivationInputTransformed &
  HasStateInputTransformed &
  HasClimateZoneInputTransformed &
  HasIsInLeachingZoneInputTransformed;

// Every top-level key is optional for this calculator only: callers may supply just the
// activities relevant to them rather than the whole farm. This is applied locally here
// (via `Partial<>` on the types and `.partial()` on the schema) rather than in any of
// the imported schemas themselves, which stay required for the calculators that own them.
type AllModulesInputCore = {
  beef: AllModulesBeefInput;
  dairy: DairyHerdLivestockInput;
  sheep: AllModulesSheepInput;
  pigs: PigsHerdLivestockInput;
  poultry: PoultryFlockLivestockInput;
  otherLivestock: OtherLivestockManureAndEntericHerdInput;
  feedlot: FeedlotLotLivestockInput;
  fertiliser: AllModulesFertiliserInput;
  crop: AllModulesCropInput;
  pasture: AllModulesPastureInput;
  rice: AllModulesRiceInput;
  fuel: AllModulesFuelInput;
  services: AllModulesServicesInput;
  electricity: ElectricityInputs;
  landUse: LULUCFInput;
} & HasLimeInput &
  RefrigerantsInput &
  HasSolidWasteInput &
  HasWastewaterTreatmentInput &
  HasSupplementaryCO2Input &
  HasPurchasedLivestockInput &
  HasPurchasedFeedInput &
  PurchasedMineralSupplementsInput &
  OtherPurchasedGoodsAndServicesInput &
  PurchasedPackagingsInput &
  FreightsInput &
  AgrichemicalsInput &
  HasAquacultureSystemInput;

type AllModulesInputCoreTransformed = {
  beef: AllModulesBeefInputTransformed;
  dairy: DairyHerdLivestockInputTransformed;
  sheep: AllModulesSheepInputTransformed;
  pigs: PigsHerdLivestockInputTransformed;
  poultry: PoultryFlockLivestockInputTransformed;
  otherLivestock: OtherLivestockManureAndEntericHerdInputTransformed;
  feedlot: FeedlotLotLivestockInputTransformed;
  fertiliser: AllModulesFertiliserInputTransformed;
  crop: AllModulesCropInputTransformed;
  pasture: AllModulesPastureInputTransformed;
  rice: AllModulesRiceInputTransformed;
  fuel: AllModulesFuelInputTransformed;
  services: AllModulesServicesInputTransformed;
  electricity: ElectricityInputsTransformed;
  landUse: LULUCFInputTransformed;
} & HasLimeInputTransformed &
  RefrigerantsInputTransformed &
  HasSolidWasteInputTransformed &
  HasWastewaterTreatmentInputTransformed &
  HasSupplementaryCO2InputTransformed &
  HasPurchasedLivestockInputTransformed &
  HasPurchasedFeedInputTransformed &
  PurchasedMineralSupplementsInputTransformed &
  OtherPurchasedGoodsAndServicesInputTransformed &
  PurchasedPackagingsInputTransformed &
  FreightsInputTransformed &
  AgrichemicalsInputTransformed &
  HasAquacultureSystemInputTransformed;

export type AllModulesInput = Partial<AllModulesInputCore>;
export type AllModulesInputTransformed =
  Partial<AllModulesInputCoreTransformed>;

// The shape is declared from the hand written types above, as the inferred shape is too large for TypeScript to serialize.
// landUse keeps the real schema type so this still matches LULUCFParentInputSchema.
export type AllModulesInputShape = {
  [K in Exclude<keyof AllModulesInputCore, 'landUse'>]: z.ZodOptional<
    z.ZodType<AllModulesInputCoreTransformed[K], AllModulesInputCore[K]>
  >;
} & {
  landUse: z.ZodOptional<typeof LULUCFInputSchema>;
};

export const AllModulesInputSchema: z.ZodObject<
  AllModulesInputShape,
  z.core.$strict
> = object({
  beef: AllModulesBeefInputSchema,
  dairy: DairyHerdLivestockInputSchema,
  sheep: AllModulesSheepInputSchema,
  pigs: PigsHerdLivestockInputSchema,
  poultry: PoultryFlockLivestockInputSchema,
  otherLivestock: OtherLivestockManureAndEntericHerdInputSchema,
  feedlot: FeedlotLotLivestockInputSchema,
  fertiliser: AllModulesFertiliserInputSchema,
  ...HasLimeInputSchema.shape,
  crop: AllModulesCropInputSchema,
  pasture: AllModulesPastureInputSchema,
  rice: AllModulesRiceInputSchema,
  fuel: AllModulesFuelInputSchema,
  services: AllModulesServicesInputSchema,
  ...RefrigerantsInputSchema.shape,
  ...HasSolidWasteInputSchema.shape,
  ...HasWastewaterTreatmentInputSchema.shape,
  ...HasSupplementaryCO2InputSchema.shape,
  electricity: ElectricityInputsSchema,
  ...HasPurchasedLivestockInputSchema.shape,
  ...HasPurchasedFeedInputSchema.shape,
  ...PurchasedMineralSupplementsInputSchema.shape,
  ...OtherPurchasedGoodsAndServicesSchema.shape,
  ...PurchasedPackagingsInputSchema.shape,
  ...FreightsInputSchema.shape,
  ...AgrichemicalsInputSchema.shape,
  ...HasAquacultureSystemInputSchema.shape,
  landUse: LULUCFInputSchema,
})
  .partial()
  .meta({
    description: `The input for the 'All Modules' calculator. This accepts flat inputs for all modules. This allows any combination of modules to be supported in a single calculation`,
  });
