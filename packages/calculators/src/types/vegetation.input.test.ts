import { RainfallRegions, SoilTypes, TreeTypes } from './enums';
import { VegetationSchema } from './vegetation.input';

describe('VegetationSchema conditional validation', () => {
  describe('when region, treeSpecies, and soil are valid combinations', () => {
    test('should validate "South West" region with valid tree species and soil', () => {
      const validInput = {
        region: 'South West' as (typeof RainfallRegions)[number],
        treeSpecies:
          'Mixed species (Environmental Plantings)' as (typeof TreeTypes)[number],
        soil: 'Loams & Clays' as (typeof SoilTypes)[number],
        area: 10,
        age: 5,
      };

      const result = VegetationSchema.safeParse(validInput);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(validInput);
      }
    });

    test('should validate "South West" region with alternative valid tree species', () => {
      const validInput = {
        region: 'South West' as (typeof RainfallRegions)[number],
        treeSpecies: 'Tasmanian Blue Gum' as (typeof TreeTypes)[number],
        soil: 'Sandy Duplexes' as (typeof SoilTypes)[number],
        area: 10,
        age: 5,
      };

      const result = VegetationSchema.safeParse(validInput);
      expect(result.success).toBe(true);
    });

    test('should validate "South West" region with Sydney Blue Gum', () => {
      const validInput = {
        region: 'South West' as (typeof RainfallRegions)[number],
        treeSpecies: 'Sydney Blue Gum' as (typeof TreeTypes)[number],
        soil: 'Loams & Clays' as (typeof SoilTypes)[number],
        area: 10,
        age: 5,
      };

      const result = VegetationSchema.safeParse(validInput);
      expect(result.success).toBe(true);
    });

    test('should validate "South West" region with Maritime Pine', () => {
      const validInput = {
        region: 'South West' as (typeof RainfallRegions)[number],
        treeSpecies: 'Maritime Pine' as (typeof TreeTypes)[number],
        soil: 'Sandy Duplexes' as (typeof SoilTypes)[number],
        area: 10,
        age: 5,
      };

      const result = VegetationSchema.safeParse(validInput);
      expect(result.success).toBe(true);
    });

    test('should validate "South West" region with Pinus Radiata', () => {
      const validInput = {
        region: 'South West' as (typeof RainfallRegions)[number],
        treeSpecies: 'Pinus Radiata' as (typeof TreeTypes)[number],
        soil: 'Loams & Clays' as (typeof SoilTypes)[number],
        area: 10,
        age: 5,
      };

      const result = VegetationSchema.safeParse(validInput);
      expect(result.success).toBe(true);
    });
  });

  describe('when treeSpecies is invalid for the region', () => {
    test('should reject invalid tree species for "South West" region', () => {
      const invalidInput = {
        region: 'South West' as (typeof RainfallRegions)[number],
        treeSpecies: 'Spotted Gum' as (typeof TreeTypes)[number], // Not valid for South West
        soil: 'Loams & Clays' as (typeof SoilTypes)[number],
        area: 10,
        age: 5,
      };

      const result = VegetationSchema.safeParse(invalidInput);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues).toHaveLength(1);
        expect(result.error.issues[0].path).toEqual(['treeSpecies']);
        expect(result.error.issues[0].message).toContain(
          'Tree species "Spotted Gum" is not valid for region "South West"',
        );
        expect(result.error.issues[0].message).toContain(
          'Valid species for this region are:',
        );
      }
    });

    test('should reject invalid tree species for "North Coast" region', () => {
      const invalidInput = {
        region: 'North Coast' as (typeof RainfallRegions)[number],
        treeSpecies: 'Pinus Radiata' as (typeof TreeTypes)[number], // Not valid for North Coast
        soil: 'Duplex' as (typeof SoilTypes)[number],
        area: 10,
        age: 5,
      };

      const result = VegetationSchema.safeParse(invalidInput);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues).toHaveLength(1);
        expect(result.error.issues[0].path).toEqual(['treeSpecies']);
        expect(result.error.issues[0].message).toContain(
          'Tree species "Pinus Radiata" is not valid for region "North Coast"',
        );
      }
    });
  });

  describe('when soil is invalid for the region', () => {
    test('should reject invalid soil type for "South West" region', () => {
      const invalidInput = {
        region: 'South West' as (typeof RainfallRegions)[number],
        treeSpecies:
          'Mixed species (Environmental Plantings)' as (typeof TreeTypes)[number],
        soil: 'Clay' as (typeof SoilTypes)[number], // Not valid for South West
        area: 10,
        age: 5,
      };

      const result = VegetationSchema.safeParse(invalidInput);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues).toHaveLength(1);
        expect(result.error.issues[0].path).toEqual(['soil']);
        expect(result.error.issues[0].message).toContain(
          'Soil type "Clay" is not valid for region "South West"',
        );
        expect(result.error.issues[0].message).toContain(
          'Valid soil types for this region are:',
        );
      }
    });

    test('should reject invalid soil type for "North Coast" region', () => {
      const invalidInput = {
        region: 'North Coast' as (typeof RainfallRegions)[number],
        treeSpecies:
          'Mixed species (Environmental Plantings)' as (typeof TreeTypes)[number],
        soil: 'Loams & Clays' as (typeof SoilTypes)[number], // Not valid for North Coast
        area: 10,
        age: 5,
      };

      const result = VegetationSchema.safeParse(invalidInput);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues).toHaveLength(1);
        expect(result.error.issues[0].path).toEqual(['soil']);
        expect(result.error.issues[0].message).toContain(
          'Soil type "Loams & Clays" is not valid for region "North Coast"',
        );
      }
    });
  });

  describe('when both treeSpecies and soil are invalid for the region', () => {
    test('should reject both invalid tree species and soil type', () => {
      const invalidInput = {
        region: 'South West' as (typeof RainfallRegions)[number],
        treeSpecies: 'Spotted Gum' as (typeof TreeTypes)[number], // Not valid for South West
        soil: 'Clay' as (typeof SoilTypes)[number], // Not valid for South West
        area: 10,
        age: 5,
      };

      const result = VegetationSchema.safeParse(invalidInput);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues).toHaveLength(2);
        const treeSpeciesIssue = result.error.issues.find(
          (issue) => issue.path[0] === 'treeSpecies',
        );
        const soilIssue = result.error.issues.find(
          (issue) => issue.path[0] === 'soil',
        );

        expect(treeSpeciesIssue).toBeDefined();
        expect(treeSpeciesIssue?.message).toContain(
          'Tree species "Spotted Gum" is not valid',
        );

        expect(soilIssue).toBeDefined();
        expect(soilIssue?.message).toContain('Soil type "Clay" is not valid');
      }
    });
  });

  describe('when region has limited valid options', () => {
    test('should reject tree species for "Pilbara" region which has no valid tree data', () => {
      // Pilbara has "No tree data available" for all tree species, so it should reject all species
      const invalidInput = {
        region: 'Pilbara' as (typeof RainfallRegions)[number],
        treeSpecies:
          'Mixed species (Environmental Plantings)' as (typeof TreeTypes)[number],
        soil: 'No Soil / Tree data available' as (typeof SoilTypes)[number],
        area: 10,
        age: 5,
      };

      const result = VegetationSchema.safeParse(invalidInput);
      // Pilbara should reject all tree species since they're all "No tree data available"
      expect(result.success).toBe(false);
      if (!result.success) {
        const treeSpeciesIssue = result.error.issues.find(
          (issue) => issue.path[0] === 'treeSpecies',
        );
        expect(treeSpeciesIssue).toBeDefined();
        expect(treeSpeciesIssue?.message).toContain(
          'Tree species "Mixed species (Environmental Plantings)" is not valid for region "Pilbara"',
        );
        // Should indicate there are no valid species (empty list)
        expect(treeSpeciesIssue?.message).toContain(
          'Valid species for this region are:',
        );
      }
    });
  });

  describe('error message format', () => {
    test('should include valid options in error message for tree species', () => {
      const invalidInput = {
        region: 'South West' as (typeof RainfallRegions)[number],
        treeSpecies: 'Hoop Pine' as (typeof TreeTypes)[number],
        soil: 'Loams & Clays' as (typeof SoilTypes)[number],
        area: 10,
        age: 5,
      };

      const result = VegetationSchema.safeParse(invalidInput);
      expect(result.success).toBe(false);
      if (!result.success) {
        const issue = result.error.issues[0];
        expect(issue.message).toContain('Valid species for this region are:');
        // Should list the valid species
        expect(issue.message).toContain(
          'Mixed species (Environmental Plantings)',
        );
        expect(issue.message).toContain('Tasmanian Blue Gum');
      }
    });

    test('should include valid options in error message for soil type', () => {
      const invalidInput = {
        region: 'South West' as (typeof RainfallRegions)[number],
        treeSpecies:
          'Mixed species (Environmental Plantings)' as (typeof TreeTypes)[number],
        soil: 'Clay' as (typeof SoilTypes)[number],
        area: 10,
        age: 5,
      };

      const result = VegetationSchema.safeParse(invalidInput);
      expect(result.success).toBe(false);
      if (!result.success) {
        const issue = result.error.issues[0];
        expect(issue.message).toContain(
          'Valid soil types for this region are:',
        );
        // Should list the valid soil types
        expect(issue.message).toContain('Loams & Clays');
        expect(issue.message).toContain('Sandy Duplexes');
      }
    });
  });
});
