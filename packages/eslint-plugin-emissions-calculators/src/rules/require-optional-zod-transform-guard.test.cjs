const { RuleTester } = require('eslint');
const parser = require('@typescript-eslint/parser');
const {
  requireOptionalZodTransformGuard,
} = require('../../dist/rules/require-optional-zod-transform-guard');

const ruleTester = new RuleTester({
  languageOptions: {
    parser,
    parserOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
    },
  },
});

ruleTester.run(
  'require-optional-zod-transform-guard',
  requireOptionalZodTransformGuard,
  {
    valid: [
      'z.number().transform((v) => v + 1)',
      'z.number().optional().transform(mapOptional((v) => v + 1))',
      'z.number().optional().meta({}).transform(mapOptional((v) => days(v)))',
      {
        code: 'schema.optional().transform(mapOptional((v) => v))',
        options: [{ helperNames: ['mapOptional'] }],
      },
    ],
    invalid: [
      {
        code: 'z.number().optional().transform((v) => days(v))',
        errors: [{ messageId: 'missingGuard' }],
      },
      {
        code: 'z.number().optional().meta({}).transform((v) => input(v))',
        errors: [{ messageId: 'missingGuard' }],
      },
      {
        code: 'z.number().optional().transform(otherHelper((v) => v))',
        options: [{ helperNames: ['mapOptional'] }],
        errors: [{ messageId: 'missingGuard' }],
      },
    ],
  },
);
