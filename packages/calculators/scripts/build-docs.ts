import { parse } from '@typescript-eslint/parser';
import { TSESTree } from '@typescript-eslint/types';
import * as fs from 'fs';
import * as path from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const appRoot = path.resolve(__dirname, '..');

async function buildConstantsDocs(pathToVersion: string) {
    const inputPath = path.resolve(appRoot, path.join(pathToVersion, 'constants', 'constant_values.ts'));
    const input = parse(fs.readFileSync(inputPath, 'utf8'), { jsDocParsingMode: 'all' });

    const exportedVariables: TSESTree.VariableDeclarator[] = input.body.map((node) => {
        if (node.type === 'ExportNamedDeclaration' && node.declaration?.type === 'VariableDeclaration' &&
            node.declaration.declarations[0].type === 'VariableDeclarator') {
            return node.declaration.declarations[0];
        }
        return null;
    }).filter((node) => node !== null);
    
    const nodeConstantsVariable: TSESTree.VariableDeclarator | undefined = exportedVariables.find((nodeVariable) => 
        nodeVariable.id.type === 'Identifier' &&
        nodeVariable.id.name === 'constants'
    );

    if (!nodeConstantsVariable) {
        throw new Error('Constants not found');
    }

    const nodesConstantsProperties = nodeConstantsVariable.init !== null && nodeConstantsVariable.init?.type === 'ObjectExpression' ? nodeConstantsVariable.init.properties : [];

    const lines = nodesConstantsProperties.map((nodeProperty) => {
        if (nodeProperty.type === 'Property') {
            if (nodeProperty.key.type === 'Identifier') {
                return `- ${nodeProperty.key.name}`;
            }

            return null
        }
    }).filter((line) => line !== null).join('\n');


    const outputPath = path.resolve(appRoot, path.join(pathToVersion, 'doc', 'CONSTANTS.md'));

    fs.writeFileSync(outputPath, lines);


    console.dir(input, { depth: 2 });

}

await buildConstantsDocs('src/versions/3.0.0');