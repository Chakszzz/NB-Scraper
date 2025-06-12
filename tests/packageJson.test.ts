/**
 * Jest unit tests for validating package.json
 */
import fs from 'fs';
import path from 'path';

const pkgPath = path.resolve(__dirname, '..', 'package.json');
const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));

describe('package.json integrity', () => {
  test('contains mandatory metadata', () => {
    expect(pkg).toEqual(
      expect.objectContaining({
        name: expect.any(String),
        version: expect.stringMatching(/^\d+\.\d+\.\d+(-.+)?$/),
        description: expect.any(String),
        license: expect.any(String),
        scripts: expect.any(Object),
        dependencies: expect.any(Object),
        devDependencies: expect.any(Object)
      })
    );
  });

  test('npm scripts exist and are well-formed', () => {
    const { scripts } = pkg;
    ['build', 'test', 'lint', 'prepare'].forEach(key =>
      expect(scripts).toHaveProperty(key)
    );
    expect(scripts.test).toMatch(/jest/);
  });

  test('jest is listed as a dev dependency', () => {
    expect(pkg.devDependencies).toHaveProperty('jest');
  });

  test('project engine requirement is semver-range', () => {
    expect(pkg.engines?.node).toMatch(/^>=\d+\.\d+\.\d+$/);
  });

  test('does not contain duplicate top-level keys', () => {
    const keys = Object.keys(pkg);
    expect(keys.length).toBe(new Set(keys).size);
  });
});