import {
  calculateAllModulesNestedExport,
  validateAndCalculateAllModulesNestedExport,
} from './all-modules/nested-exports';
import {
  calculateAquacultureNestedExport,
  validateAndCalculateAquacultureNestedExport,
} from './aquaculture/nested-exports';
import {
  calculateBeefNestedExport,
  validateAndCalculateBeefNestedExport,
} from './beef/nested-exports';
import {
  calculateCottonNestedExport,
  validateAndCalculateCottonNestedExport,
} from './cotton/nested-exports';
import {
  calculateCroppingNestedExport,
  validateAndCalculateCroppingNestedExport,
} from './cropping/nested-exports';
import {
  calculateDairyNestedExport,
  validateAndCalculateDairyNestedExport,
} from './dairy/nested-exports';
import {
  calculateFeedlotNestedExport,
  validateAndCalculateFeedlotNestedExport,
} from './feedlot/nested-exports';
import {
  calculateForestryNestedExport,
  validateAndCalculateForestryNestedExport,
} from './forestry/nested-exports';
import { calculateGrainsSimple } from './grains/calculate-emissions';
import {
  calculateGrainsNestedExport,
  validateAndCalculateGrainsNestedExport,
} from './grains/nested-exports';
import { calculateGrainsWithOverrides } from './grains/research-overrides';
import { calculateGrainsTopLevel } from './grains/top-level';
import {
  calculateOtherLivestockNestedExport,
  validateAndCalculateOtherLivestockNestedExport,
} from './other-livestock/nested-exports';
import {
  calculatePigsNestedExport,
  validateAndCalculatePigsNestedExport,
} from './pigs/nested-exports';
import {
  calculatePostProductionNestedExport,
  validateAndCalculatePostProductionNestedExport,
} from './post-production/nested-exports';
import {
  calculatePoultryNestedExport,
  validateAndCalculatePoultryNestedExport,
} from './poultry/nested-exports';
import {
  calculateRiceNestedExport,
  validateAndCalculateRiceNestedExport,
} from './rice/nested-exports';
import {
  calculateSheepNestedExport,
  validateAndCalculateSheepNestedExport,
} from './sheep/nested-exports';
import {
  calculateSugarNestedExport,
  validateAndCalculateSugarNestedExport,
} from './sugar/nested-exports';
import {
  calculateViticultureNestedExport,
  validateAndCalculateViticultureNestedExport,
} from './viticulture/nested-exports';
import {
  calculateWildCatchFisheriesNestedExport,
  validateAndCalculateWildCatchFisheriesNestedExport,
} from './wild-catch-fisheries/nested-exports';

calculateGrainsSimple();
calculateGrainsTopLevel();
validateAndCalculateGrainsNestedExport();
calculateGrainsNestedExport();
validateAndCalculateAllModulesNestedExport();
calculateAllModulesNestedExport();
validateAndCalculateAquacultureNestedExport();
calculateAquacultureNestedExport();
validateAndCalculateBeefNestedExport();
calculateBeefNestedExport();
validateAndCalculateCottonNestedExport();
calculateCottonNestedExport();
validateAndCalculateCroppingNestedExport();
calculateCroppingNestedExport();
validateAndCalculateDairyNestedExport();
calculateDairyNestedExport();
validateAndCalculateFeedlotNestedExport();
calculateFeedlotNestedExport();
validateAndCalculateForestryNestedExport();
calculateForestryNestedExport();
validateAndCalculateOtherLivestockNestedExport();
calculateOtherLivestockNestedExport();
validateAndCalculatePigsNestedExport();
calculatePigsNestedExport();
validateAndCalculatePostProductionNestedExport();
calculatePostProductionNestedExport();
validateAndCalculatePoultryNestedExport();
calculatePoultryNestedExport();
validateAndCalculateRiceNestedExport();
calculateRiceNestedExport();
validateAndCalculateSheepNestedExport();
calculateSheepNestedExport();
validateAndCalculateSugarNestedExport();
calculateSugarNestedExport();
validateAndCalculateViticultureNestedExport();
calculateViticultureNestedExport();
validateAndCalculateWildCatchFisheriesNestedExport();
calculateWildCatchFisheriesNestedExport();
calculateGrainsWithOverrides();
