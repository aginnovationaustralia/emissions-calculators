import { FullCAMAreaInput, TreeSpeciesName } from './input';
import { Result } from './result';

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
  input: FullCAMAreaInput;
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

export type FullCAMSubmission = {
  area: AreaPlotContent;
  outputCsv: string;
};

export type FullCAMSubmissionResult = FullCAMAreaResult<FullCAMSubmission>;

export type InputAreaWithOutputKeyFields = {
  area: AreaPlotContent;
  keyFields: FullCAMOutputKeyFields;
};

export type FullCAMStep =
  | 'parse-input'
  | 'pipeline'
  | 'create-batch'
  | 'run-batch'
  | 'wait-batch'
  | 'fetch-archive'
  | 'extract-results';
export type FullCAMError = {
  step: FullCAMStep;
  message: string;
};

export type FullCAMAreaError = {
  area: AreaPlotContent;
  error: FullCAMError;
};

export type FullCAMAreaResult<T extends { area: AreaPlotContent }> = Result<
  T,
  FullCAMAreaError
>;

export type FullCAMResult<T> = Result<T, FullCAMError>;
