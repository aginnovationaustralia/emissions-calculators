import path from 'path';
import { Version } from '../../../version';

// Grab the current version by looking at the name of the parent folder of this file's path
// For example, if the file is in `src/versions/2.0.0/test/version.test.ts`, the version is '2.0.0'
const version = path.dirname(__filename).split('/').slice(-2, -1)[0];

describe('versions', () => {
  describe(`Version ${version}`, () => {
    test('this version should be supported', () => {
      expect(version).toBeDefined();
      expect(() => new Version(version!)).not.toThrow();
    });
  });
});
