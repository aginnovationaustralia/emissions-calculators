import type { TSESTree } from '@typescript-eslint/utils';
import { AST_NODE_TYPES, ESLintUtils } from '@typescript-eslint/utils';

const createRule = ESLintUtils.RuleCreator(
  (name) =>
    `https://github.com/aginnovationaustralia/emissions-calculators/blob/main/packages/eslint-plugin-emissions-calculators/src/rules/${name}.ts`,
);

function chainContainsOptional(node: TSESTree.Expression): boolean {
  const visit = (expr: TSESTree.Expression): boolean => {
    if (expr.type === AST_NODE_TYPES.CallExpression) {
      const { callee } = expr;
      if (
        callee.type === AST_NODE_TYPES.MemberExpression &&
        !callee.computed &&
        callee.property.type === AST_NODE_TYPES.Identifier &&
        callee.property.name === 'optional'
      ) {
        return true;
      }
      if (callee.type === AST_NODE_TYPES.MemberExpression) {
        return visit(callee.object);
      }
    } else if (expr.type === AST_NODE_TYPES.MemberExpression) {
      return visit(expr.object);
    }
    return false;
  };
  return visit(node);
}

function getTransformReceiver(
  transformCall: TSESTree.CallExpression,
): TSESTree.Expression | null {
  if (transformCall.callee.type !== AST_NODE_TYPES.MemberExpression) {
    return null;
  }
  return transformCall.callee.object;
}

function isAllowedGuardCall(
  expr: TSESTree.Expression,
  helperNames: ReadonlySet<string>,
): boolean {
  if (expr.type !== AST_NODE_TYPES.CallExpression) {
    return false;
  }
  const { callee } = expr;
  if (callee.type === AST_NODE_TYPES.Identifier) {
    return helperNames.has(callee.name);
  }
  if (
    callee.type === AST_NODE_TYPES.MemberExpression &&
    !callee.computed &&
    callee.property.type === AST_NODE_TYPES.Identifier
  ) {
    return helperNames.has(callee.property.name);
  }
  return false;
}

export const requireOptionalZodTransformGuard = createRule({
  name: 'require-optional-zod-transform-guard',
  meta: {
    type: 'problem',
    docs: {
      description:
        'Require mapOptional (or configured helper) when transforming optional Zod schemas',
    },
    schema: [
      {
        type: 'object',
        additionalProperties: false,
        properties: {
          helperNames: {
            type: 'array',
            items: { type: 'string' },
          },
        },
      },
    ],
    messages: {
      missingGuard:
        'Optional Zod schemas must use `.transform({{helper}}(...))` (e.g. curried mapOptional) so undefined is not passed to converters.',
    },
  },
  defaultOptions: [{ helperNames: ['mapOptional'] as string[] }],
  create(context, [options]) {
    const helperNames = new Set(options.helperNames);

    return {
      CallExpression(node: TSESTree.CallExpression) {
        if (
          node.callee.type !== AST_NODE_TYPES.MemberExpression ||
          node.callee.computed ||
          node.callee.property.type !== AST_NODE_TYPES.Identifier ||
          node.callee.property.name !== 'transform'
        ) {
          return;
        }

        const receiver = getTransformReceiver(node);
        if (!receiver || !chainContainsOptional(receiver)) {
          return;
        }

        const arg0 = node.arguments[0];
        if (!arg0 || arg0.type === AST_NODE_TYPES.SpreadElement) {
          context.report({
            node,
            messageId: 'missingGuard',
            data: { helper: [...helperNames].join('|') },
          });
          return;
        }

        const expr =
          arg0.type === AST_NODE_TYPES.ChainExpression ? arg0.expression : arg0;

        if (!isAllowedGuardCall(expr, helperNames)) {
          context.report({
            node: arg0,
            messageId: 'missingGuard',
            data: { helper: [...helperNames].join('|') },
          });
        }
      },
    };
  },
});
