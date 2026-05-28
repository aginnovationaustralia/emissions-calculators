import { TreeSpeciesName } from './input';

export const treeSpeciesIdMap: Record<TreeSpeciesName, number> = {
  'Environmental Plantings': 7,
  'Mallee eucalyptus species': 23,
  'Native species regeneration < 500mm rainfall': 33,
  'Native species regeneration > 500mm rainfall': 34,
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

export type FullCAMOutputSummary = {
  carbonMassInTreesPerHectare: number; // Ct,i,j,y
  carbonMassInDebrisPerHectare: number; // Cd,i,j,y
  carbonMassInTreesPerHectarePrevYear: number; // Ct,i,j,y-1
  carbonMassInDebrisPerHectarePrevYear: number; // Cd,i,j,y-1
  carbonMassInForestProductsPerHectare: number; // Cp,i,j=6-7,y
  ch4FromBiomassBurningPerHectare: number; // Eg,i,j,y for g = CH4
  n2oFromBiomassBurningPerHectare: number; // Eg,i,j,y for g = N2O
};
