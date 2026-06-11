import { FullCAMAreaInput, TreeSpeciesName } from './input';

export const treeSpeciesIdMap: Record<TreeSpeciesName, number> = {
  'Environmental plantings': 7,
  'Mallee eucalypt species': 23,
  'Native Species Regeneration <500mm rainfall': 33,
  'Native Species Regeneration >=500mm rainfall': 34,
};

// Year,Step In Year,Dec. Year,"C mass of trees  (tC/ha)","CH4 emitted due to fire (tCH4/ha)","N2O emitted due to fire (tN2O/ha)","C mass of forest debris  (tC/ha)"
export type FullCAMOutputLine = {
  year: number;
  month: number;
  decimalYear: number;
  carbonMassOfTreesTCPerHectare: number;
  ch4EmittedDueToFireTCH4PerHectare: number;
  n2oEmittedDueToFireTN2OPerHectare: number;
  carbonMassOfForestDebrisTCPerHectare: number;
};

export type FullCAMOutputKeyFields = {
  carbonMassInTreesPerHectare: number; // Ct,i,j,y
  carbonMassInDebrisPerHectare: number; // Cd,i,j,y
  carbonMassInTreesPerHectarePrevYear: number; // Ct,i,j,y-1
  carbonMassInDebrisPerHectarePrevYear: number; // Cd,i,j,y-1
  carbonMassInForestProductsPerHectare: number; // Cp,i,j=6-7,y
  ch4FromBiomassBurningPerHectare: number; // Eg,i,j,y for g = CH4
  n2oFromBiomassBurningPerHectare: number; // Eg,i,j,y for g = N2O
};

export type BatchSimulationRequest = {
  inputArea: FullCAMAreaInput;
  uniqueAreaKey: string;
  plotContent: string;
};

export type Area = {
  input: FullCAMAreaInput;
  uniqueAreaKey: string;
  plotfileName: string;
};

export type AreaPlotContent = Area & {
  plotContent: string;
};

export type FullCAMSubmissionSucceeded = { area: AreaPlotContent } & {
  outputCsv: string;
};

export type FullCAMSubmissionFailed = { area: AreaPlotContent } & {
  error: string;
};

export type FullCAMSubmission =
  | FullCAMSubmissionSucceeded
  | FullCAMSubmissionFailed;

export const isFullCAMSubmissionSucceeded = (
  submission: FullCAMSubmission,
): submission is FullCAMSubmissionSucceeded => {
  return 'outputCsv' in submission;
};

export const isFullCAMSubmissionFailed = (
  submission: FullCAMSubmission,
): submission is FullCAMSubmissionFailed => {
  return 'error' in submission;
};

export type InputAreaWithOutputKeyFields = {
  uniqueAreaKey: string;
  inputArea: FullCAMAreaInput;
  keyFields: FullCAMOutputKeyFields;
};

export type BatchSimulationError = {
  uniqueAreaKey: string;
  error: string;
};
export type BatchSimulationResult =
  | BatchSimulationError
  | InputAreaWithOutputKeyFields;

export function isBatchSimulationError(
  result: BatchSimulationResult,
): result is BatchSimulationError {
  return 'error' in result;
}

export function isBatchSimulationSuccess(
  result: BatchSimulationResult,
): result is InputAreaWithOutputKeyFields {
  return !isBatchSimulationError(result);
}
