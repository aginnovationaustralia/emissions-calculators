import { BeefBreeds } from '@/constants/enums';
import { enumSchema } from './enum-schemas';

describe('enumSchema', () => {
  it('returns the shared schema for a registered enum', () => {
    const schema = enumSchema(BeefBreeds);
    expect(schema.meta()?.id).toBe('BeefBreed');
    expect(enumSchema(BeefBreeds)).toBe(schema);
  });

  it('matches registered values in any order', () => {
    expect(enumSchema([...BeefBreeds].reverse())).toBe(enumSchema(BeefBreeds));
  });

  it('throws for values that are not registered', () => {
    expect(() => enumSchema(['Hereford or Shorthorn'])).toThrow(
      'are not registered',
    );
    expect(() => enumSchema([...BeefBreeds, 'Wagyu'])).toThrow(
      'are not registered',
    );
  });
});
