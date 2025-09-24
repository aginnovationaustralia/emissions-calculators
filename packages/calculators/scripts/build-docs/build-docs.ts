import { TSESTree } from '@typescript-eslint/types';
import { parseAndGenerateServices } from '@typescript-eslint/typescript-estree';
import * as fs from 'fs';
import * as path from 'path';
import { dirname } from 'path';
import * as ts from 'typescript';
import { fileURLToPath } from 'url';
import { renderCommentType, renderSection } from './render';
import { CommentType, ConstantValue, DocComment, DocSection } from './types';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const appRoot = path.resolve(__dirname, '..', '..');

function isJsDoc(node: ts.Node): node is ts.JSDoc {
  return node.kind === ts.SyntaxKind.JSDoc;
}

function isJSDocTypeTag(tag: ts.JSDocTag): tag is ts.JSDocTypeTag {
  return tag.kind === ts.SyntaxKind.JSDocTypeTag;
}

function tagToComments(tag: ts.JSDocTag): DocComment[] {
  const tagName = tag.tagName.text as CommentType;
  if (isJSDocTypeTag(tag)) {
    return [{ text: tag.typeExpression.getText(), type: 'type' }];
  }
  const result =
    typeof tag.comment === 'string'
      ? [{ text: tag.comment, type: tagName }]
      : (tag.comment?.map((c) => ({ text: c.text, type: tagName })) ?? []);
  return result;
}

function extractJSDocComments(tsNode: ts.Node): DocComment[] {
  const jsDocComments = ts.getJSDocCommentsAndTags(tsNode);
  return jsDocComments.flatMap((c) => {
    if (isJsDoc(c)) {
      return (
        c.tags
          ?.filter(
            (t) =>
              (t.kind === ts.SyntaxKind.JSDocTag &&
                [
                  'link',
                  'description',
                  'units',
                  'inventory2018',
                  'inventory2022',
                  'reference',
                ].includes(t.tagName.text)) ||
              isJSDocTypeTag(t),
          )
          .map(tagToComments)
          .flat()
          .filter((c) => c !== undefined) ?? []
      );
    }
    return [];
  });
}

function expressionToString(
  expression: TSESTree.Expression | TSESTree.SpreadElement | null,
): string {
  if (expression === null) {
    return 'null';
  }
  switch (expression.type) {
    case 'Literal':
      return expression.value?.toString() ?? 'null';
    case 'BinaryExpression':
      if (expression.left.type === 'PrivateIdentifier') {
        throw new Error(`Expression could not be parsed ${expression.type}`);
      }
      return `${expressionToString(expression.left)} ${expression.operator} ${expressionToString(expression.right)}`;
    case 'ArrayExpression':
      return expression.elements.map((e) => expressionToString(e)).join(', ');
    default:
      throw new Error(`Expression could not be parsed ${expression.type}`);
  }
}

class BuildConstantsDocs {
  /**
   *
   * @param pathToVersion The relative path to the root directory for the version to process
   * @param enumLookups A lookup table with the enum values needed to satisfy constants with a path element that is an enum. For example, if a
   * constant defines paths using STATES ie `[FreightTypes.RAIL]: 0.038,` then you need to supply the full FreightTypes enum definition
   */
  constructor(
    private pathToVersion: string,
    private enumLookups: Record<string, Record<string, string>>,
  ) {}

  async buildConstantsDocs() {
    const inputPath = path.resolve(
      appRoot,
      path.join(this.pathToVersion, 'constants', 'constant_values.ts'),
    );
    const code = fs.readFileSync(inputPath, 'utf8');
    const { ast, services } = parseAndGenerateServices(code, {
      jsDocParsingMode: 'all',
      // project: './tsconfig.json'
    });

    function jsDocCommentsFromESNode(node: TSESTree.Node): DocComment[] {
      const tsNode = services.esTreeNodeToTSNodeMap.get(node);
      if (tsNode) {
        return extractJSDocComments(tsNode);
      }
      return [];
    }

    const exportedVariables: TSESTree.VariableDeclarator[] = ast.body
      .map((node) => {
        if (
          node.type === 'ExportNamedDeclaration' &&
          node.declaration?.type === 'VariableDeclaration' &&
          node.declaration.declarations[0].type === 'VariableDeclarator'
        ) {
          return node.declaration.declarations[0];
        }
        return null;
      })
      .filter((node) => node !== null);

    const nodeConstantsVariable: TSESTree.VariableDeclarator | undefined =
      exportedVariables.find(
        (nodeVariable) =>
          nodeVariable.id.type === 'Identifier' &&
          nodeVariable.id.name === 'constants',
      );

    if (!nodeConstantsVariable) {
      throw new Error('Constants not found');
    }

    const nodesConstantsProperties =
      nodeConstantsVariable.init !== null &&
      nodeConstantsVariable.init?.type === 'ObjectExpression'
        ? nodeConstantsVariable.init.properties
        : [];

    const sections = nodesConstantsProperties
      .map((property) =>
        this.literalToDocSection(property, jsDocCommentsFromESNode),
      )
      .filter((section) => section !== null);

    const lines = sections
      // .sort((a, b) => a.name.localeCompare(b.name))
      .map(renderSection)
      .join('\n');

    const output = `
# Constants
    
${lines}
    `;

    const outputPath = path.resolve(
      appRoot,
      path.join(this.pathToVersion, 'doc', 'CONSTANTS.md'),
    );

    fs.writeFileSync(outputPath, output);
  }

  nameOfKey(keyNode: TSESTree.Node): string {
    if (keyNode.type === 'MemberExpression') {
      if (keyNode.object.type === 'Identifier') {
        const indexName = this.nameOfKey(keyNode.property);
        const parent = keyNode.object.name;
        const lookupResult = this.enumLookups[parent];

        if (lookupResult) {
          return lookupResult[indexName];
        } else {
          throw new Error(`Enum lookup result failed found for enum ${parent}`);
        }
      }
    } else if (keyNode.type === 'Identifier') {
      return keyNode.name;
    } else if (keyNode.type === 'Literal' && keyNode.value !== null) {
      return keyNode.value.toString();
    }
    throw new Error(`Key of literal failed found for key node ${keyNode.type}`);
  }

  propertyToConstantValues(
    property: TSESTree.Property,
    parents: string[],
    commentsFromNode: (node: TSESTree.Node) => DocComment[],
  ): ConstantValue[] {
    const value = property.value;

    if (value.type === 'ObjectExpression') {
      return value.properties
        .filter((p) => p.type === 'Property')
        .flatMap((p) =>
          this.propertyToConstantValues(
            p,
            [...parents, this.nameOfKey(property.key)],
            commentsFromNode,
          ),
        );
    } else if (
      value.type === 'Literal' ||
      value.type === 'BinaryExpression' ||
      value.type === 'ArrayExpression'
    ) {
      const key = property.key;
      const name = this.nameOfKey(key);
      const comments = commentsFromNode(property)
        .map((c) => `${renderCommentType(c.type)}: ${c.text}`)
        .join(', ');
      return [
        {
          name,
          value:
            value.type === 'Literal' ? value.value : expressionToString(value),
          comments,
          path: [...parents, name],
        },
      ];
    }
    return [];
  }

  literalToDocSection(
    literal: TSESTree.ObjectLiteralElement,
    commentsFromNode: (node: TSESTree.Node) => DocComment[],
  ): DocSection | null {
    if (literal.type === 'Property') {
      if (literal.key.type === 'Identifier') {
        let values: ConstantValue[] = [];
        if (
          literal.value.type === 'ObjectExpression' ||
          literal.value.type === 'Literal' ||
          literal.value.type === 'BinaryExpression'
        ) {
          values = this.propertyToConstantValues(literal, [], commentsFromNode);
        }
        return {
          name: literal.key.name,
          values,
          comments: commentsFromNode(literal),
        };
      }
    }
    return null;
  }
}

export { BuildConstantsDocs };
