export type SheepIntermediaryEmissions = {
  urine: number;
  faeces: number;
  intermediate: {
    actualIntake: number;
    seasonalMethaneProductionManure: number;
    seasonalMethaneProduction: number;
  };
};

export type SheepCompleteEmissions = {
  leechingRunoffN2O: number;
  atmosphericDepositionN2O: number;
  urineAndDungN2O: number;
  manureManagementCH4: number;
  entericCH4: number;
  fertiliserN2O: number;
  intermediate: {
    totalCO2e: number;
  };
};
