import { TableMapping } from './types';

export const mappings2026: Record<string, TableMapping<string>> = {
  'Table 1': {
    columns: {
      B: 'SCOPE_2',
      C: 'SCOPE_3',
    },
  },
  'Table 2': {
    columns: {
      B: 'SCOPE_2',
      C: 'SCOPE_3',
    },
  },
  'Table 4': {
    columns: {
      B: 'ENERGY_CONTENT',
      C: 'CO2',
      D: 'CH4',
      E: 'N2O',
      F: 'COMBINED',
      G: 'SCOPE_3',
    },
  },
  'Table 5': {
    columns: {
      B: 'ENERGY_CONTENT',
      C: 'CO2',
      D: 'CH4',
      E: 'N2O',
      F: 'COMBINED',
    },
  },
  'Table 6': {
    columns: {
      B: 'METRO',
      C: 'NON_METRO',
    },
  },
  'Table 8': {
    columns: {
      B: 'ENERGY_CONTENT',
      C: 'CO2',
      D: 'CH4',
      E: 'N2O',
      F: 'COMBINED',
      G: 'SCOPE_3',
    },
  },
  'Table 9': {
    headerCols: 'A:B',
    columns: {
      C: 'ENERGY_CONTENT',
      D: 'CO2',
      E: 'CH4',
      F: 'N2O',
      G: 'COMBINED',
      H: 'SCOPE_3',
    },
  },
};
