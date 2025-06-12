const fs   = require('fs');
const path = require('path');
const Ajv   = require('ajv').default;
const yaml  = require('yaml');
const glob  = require('glob');
const markdownLinkCheck = require('../utils/markdownLinkCheck');
const schema = require('../configs/schema/config.schema.json');

describe('Configuration Schema Validation', () => {
  const configDir   = path.resolve(__dirname, '../configs');
  const configFiles = fs.readdirSync(configDir).filter(f => /\.(json|ya?ml)$/.test(f));
  const ajv    = new Ajv();
  const validate = ajv.compile(schema);

  let defaultConfig;
  beforeAll(() => {
    const sampleFile = configFiles[0];
    const samplePath = path.join(configDir, sampleFile);
    const content    = fs.readFileSync(samplePath, 'utf8');
    defaultConfig    = /\.ya?ml$/.test(sampleFile)
      ? yaml.parse(content)
      : JSON.parse(content);
  });

  test.each(configFiles)('validates %s against schema', file => {
    const filePath = path.join(configDir, file);
    const content  = fs.readFileSync(filePath, 'utf8');
    const data     = /\.ya?ml$/.test(file)
      ? yaml.parse(content)
      : JSON.parse(content);

    expect(validate(data)).toBe(true);
    expect(validate.errors).toBeNull();
  });

  test.each(configFiles)('fails validation when required key is missing in %s', file => {
    const filePath = path.join(configDir, file);
    const content  = fs.readFileSync(filePath, 'utf8');
    const data     = /\.ya?ml$/.test(file)
      ? yaml.parse(content)
      : JSON.parse(content);

    const invalidData = { ...data };
    if (schema.required && schema.required.length) {
      delete invalidData[schema.required[0]];
    }
    expect(validate(invalidData)).toBe(false);
    expect(validate.errors).not.toBeNull();
  });

  describe('Integer boundary and enum value tests', () => {
    const integerProps = Object.entries(schema.properties || {})
      .filter(([, prop]) => prop && prop.type === 'integer')
      .map(([key]) => key);

    integerProps.forEach(propName => {
      test.each([
        { value: 0,           valid: false },
        { value: -1,          valid: false },
        { value: 2147483647,  valid: true  }
      ])(
        `property ${propName} with value %p should be %p`,
        ({ value, valid }) => {
          const obj = { ...defaultConfig, [propName]: value };
          expect(validate(obj)).toBe(valid);
        }
      );
    });

    const enumProps = Object.entries(schema.properties || {})
      .filter(([, prop]) => prop && Array.isArray(prop.enum))
      .map(([key, prop]) => ({ key, values: prop.enum }));

    enumProps.forEach(({ key, values }) => {
      test.each(values)(`property ${key} accepts enum value %s`, val => {
        const obj = { ...defaultConfig, [key]: val };
        expect(validate(obj)).toBe(true);
      });
      test(`property ${key} rejects invalid enum value`, () => {
        const obj = { ...defaultConfig, [key]: 'invalid_enum_value' };
        expect(validate(obj)).toBe(false);
      });
    });
  });
});

describe('Documentation Markdown Integrity', () => {
  const mdFiles = glob.sync(path.resolve(__dirname, '../docs/**/*.md'));

  test.each(mdFiles)('checks markdown links in %s', filePath => {
    const brokenLinks = markdownLinkCheck(filePath);
    expect(brokenLinks).toHaveLength(0);
  });

  test('should fail when markdownLinkCheck returns non-empty array', () => {
    const spy = jest
      .spyOn(require('../utils/markdownLinkCheck'), 'default')
      .mockReturnValue(['brokenLink.md']);
    const result = markdownLinkCheck('fakePath.md');
    expect(result).not.toHaveLength(0);
    spy.mockRestore();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });
});

test('markdownLinkCheck returns empty array when no links present', () => {
  const tmp = path.join(require('os').tmpdir(), 'nolinks.md');
  fs.writeFileSync(tmp, '# Title\nNo links here.');
  expect(markdownLinkCheck(tmp)).toHaveLength(0);
  fs.unlinkSync(tmp);
});

describe('Extended Configuration Schema Edge Cases', () => {
  const ajvExt = new Ajv();
  const validateExt = ajvExt.compile(schema);

  const stringProps = Object.entries(schema.properties || {})
    .filter(([, prop]) => prop.type === 'string' && (prop.minLength !== undefined || prop.maxLength !== undefined));
  stringProps.forEach(([propName, prop]) => {
    test(`property ${propName} enforces minLength / maxLength`, () => {
      const tooShort = 'a'.repeat((prop.minLength || 1) - 1 || 0);
      const tooLong  = 'a'.repeat((prop.maxLength || 10) + 1);
      expect(validateExt({ ...defaultConfig, [propName]: tooShort })).toBe(false);
      expect(validateExt({ ...defaultConfig, [propName]: tooLong  })).toBe(false);
    });
  });

  const booleanProps = Object.entries(schema.properties || {})
    .filter(([, prop]) => prop.type === 'boolean')
    .map(([key]) => key);
  booleanProps.forEach(propName => {
    test.each([1, 'true', null, {}, []])(
      `property ${propName} rejects non-boolean %p`,
      bad => {
        expect(validateExt({ ...defaultConfig, [propName]: bad })).toBe(false);
      }
    );
  });

  const arrayProps = Object.entries(schema.properties || {})
    .filter(([, prop]) => prop.type === 'array' && prop.items && Array.isArray(prop.items.enum));
  arrayProps.forEach(([propName, prop]) => {
    test(`property ${propName} enforces enum and length`, () => {
      const goodArr = prop.items.enum.slice(0, Math.min(prop.maxItems || 1, prop.items.enum.length));
      const badArr  = [...goodArr, '___illegal___'];
      expect(validateExt({ ...defaultConfig, [propName]: goodArr })).toBe(true);
      expect(validateExt({ ...defaultConfig, [propName]: badArr })).toBe(false);
      if (prop.minItems !== undefined) {
        const tooFew = goodArr.slice(0, prop.minItems - 1);
        expect(validateExt({ ...defaultConfig, [propName]: tooFew })).toBe(false);
      }
      if (prop.maxItems !== undefined) {
        const tooMany = Array(prop.maxItems + 1).fill(prop.items.enum[0]);
        expect(validateExt({ ...defaultConfig, [propName]: tooMany })).toBe(false);
      }
    });
  });
});

describe('Malformed Files', () => {
  const tmpDir = require('os').tmpdir();
  let tmpJsonPath, tmpYamlPath;

  beforeAll(() => {
    tmpJsonPath = path.join(tmpDir, 'malformed.json');
    tmpYamlPath = path.join(tmpDir, 'malformed.yaml');
    fs.writeFileSync(tmpJsonPath, '{"invalidJson": ');
    fs.writeFileSync(tmpYamlPath, 'key: value\n  - wrongIndent');
  });

  afterAll(() => {
    fs.unlinkSync(tmpJsonPath);
    fs.unlinkSync(tmpYamlPath);
  });

  test('JSON.parse throws on malformed JSON', () => {
    expect(() => JSON.parse(fs.readFileSync(tmpJsonPath, 'utf8'))).toThrow();
  });

  test('yaml.parse throws on malformed YAML', () => {
    expect(() => yaml.parse(fs.readFileSync(tmpYamlPath, 'utf8'))).toThrow();
  });
});