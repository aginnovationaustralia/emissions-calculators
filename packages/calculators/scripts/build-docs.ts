import { TSESTree } from '@typescript-eslint/types';
import { parseAndGenerateServices } from '@typescript-eslint/typescript-estree';
import * as fs from 'fs';
import * as path from 'path';
import { dirname } from 'path';
import * as ts from 'typescript';
import { fileURLToPath } from 'url';


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const appRoot = path.resolve(__dirname, '..');


function extractJSDocComments(tsNode: ts.Node): string[] {
    const jsDocComments = ts.getJSDocCommentsAndTags(tsNode);
    return jsDocComments.map(comment => comment.getFullText());
}

type ConstantValue = {
    name: string;
    description: string;
    value: number | string | null | bigint | boolean | RegExp;
    path: string[]
}

type DocSection = {
    name: string;
    values: ConstantValue[]
}

// TODO: Enum lookups should be p[assed in per version
const enumLookups: Record<string, Record<string, string>> = {
    'STATES': {
        NSW: 'nsw',
        VIC: 'vic',
        QLD: 'qld',
        SA: 'sa',
        WA_NW: 'wa_nw',
        WA_SW: 'wa_sw',
        TAS: 'tas',
        NT: 'nt',
        ACT: 'act',
    },
    'REGIONS': {
        SOUTHWEST: 'southwest',
        PILBARA: 'pilbara',
        KIMBERLEY: 'kmberley',
    },
    'LIVESTOCK_SOURCE_LOCATION': {
        'Dairy origin': 'dairy origin',
        'nth/sth/central QLD': 'nth/sth/central QLD',
        'nth/sth NSW/VIC/sth SA': 'nth/sth NSW/VIC/sth SA',
        'NSW/SA pastoral zone': 'NSW/SA pastoral zone',
        'sw WA': 'sw WA',
        'WA pastoral': 'WA pastoral',
    },
    'FluidWasteTreatmentType': {
        'Anaerobic lagoon': 'anaerobic lagoon',
        'Solid storage': 'solid storage',
        'Composting': 'composting',
        'Uncovered anaerobic lagoon': 'uncovered anaerobic lagoon',
    },
    AquacultureBait: {
        SARDINES: 'Whole Sardines',
        LOW_ANIMAL_PROTEIN: 'Low Animal Protein Formulated Feed',
        HIGH_ANIMAL_PROTEIN: 'High Animal Protein Formulated Feed',
        CEREAL: 'Cereal Grain',
        SQUID: 'Squid',
        FISH: 'Whole Fish',
    },
    FreightTypes: {
        TRUCK: 'Truck',
        RAIL: 'Rail',
        LONG_HAUL_FLIGHT: 'Long haul flight',
        MEDIUM_HAUL_FLIGHT: 'Medium haul flight',
        SMALL_CONTAINER_SHIP: 'Small container ship',
        LARGE_CONTAINER_SHIP: 'Large container ship',
    }
}

function quoteString(value: string): string {
    if (value?.includes(' ')) {
        return `"${value}"`
    }
    return value
}

function nameOfKey(keyNode: TSESTree.Node): string {
    if (keyNode.type === 'MemberExpression') {
        if (keyNode.object.type === 'Identifier') {
            const indexName = nameOfKey(keyNode.property)
            const parent = keyNode.object.name
            const lookupResult = enumLookups[parent]

            if (lookupResult) {
                return lookupResult[indexName]
            } else {
                throw new Error(`Enum lookup result failed found for enum ${parent}`)
            }
        }
    } else if (keyNode.type === 'Identifier') {
        return keyNode.name
    } else if (keyNode.type === 'Literal' && keyNode.value !== null) {
        return keyNode.value.toString()
    }
    throw new Error(`Key of literal failed found for key node ${keyNode.type}`)
}

function propertyToConstantValues(property: TSESTree.Property, parents: string[]): ConstantValue[] {
    const value = property.value;

    if (value.type === 'ObjectExpression') {
        return value.properties.filter(p => p.type === 'Property').flatMap(p => propertyToConstantValues(p, [...parents, nameOfKey(property.key)]));
    } else if (value.type === 'Literal') {
        const key = property.key
        const name = nameOfKey(key)
        return [{
            name,
            value: value.value,
            description: 'TODO',
            path: [...parents, name]
        }];
    }
    return []
}

function literalToDocSection(literal: TSESTree.ObjectLiteralElement): DocSection | null {
    if (literal.type === 'Property') {
        if (literal.key.type === 'Identifier') {
            let values: ConstantValue[] = [];
            if (literal.value.type === 'ObjectExpression') {
                values = propertyToConstantValues(literal, []);
            }
            return {
                name: literal.key.name,
                values
            }
        }
    }
    return null
}

function renderSectionValues(values: ConstantValue[]): string {
    const maxDepth = values.reduce((max, value) => Math.max(max, value.path.length), 0);

    // Create a markdown table to render all value records.

    const header = `| Path | Description | Value |\n| --- | --- | --- |\n`
    const rows = values.map((value) => {
        return `| ${quoteString(value.path.join('.'))} | ${value.description} | ${value.value} |\n`
    })
    return header + rows.join('')

    return maxDepth.toString()
}
  
async function buildConstantsDocs(pathToVersion: string) {
    const inputPath = path.resolve(appRoot, path.join(pathToVersion, 'constants', 'constant_values.ts'));
    const code = fs.readFileSync(inputPath, 'utf8');
    const { ast, services } = parseAndGenerateServices(code, {
        jsDocParsingMode: 'all',
        // project: './tsconfig.json'
      });

      function jsDocCommentsFromESNode(node: TSESTree.Node): string[] {
        const tsNode = services.esTreeNodeToTSNodeMap.get(node);
        if (tsNode) {
            return extractJSDocComments(tsNode);
        }
        return [];
      }

    const exportedVariables: TSESTree.VariableDeclarator[] = ast.body.map((node) => {
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

    const sections = nodesConstantsProperties.map(literalToDocSection).filter((section) => section !== null)

    const lines = sections.sort((a, b) => a.name.localeCompare(b.name)).map((section) => {
        return `## ${section.name}\n\n
${renderSectionValues(section.values)}`
    }).join('\n');

    const output = `
# Constants
    
${lines}
    `


    const outputPath = path.resolve(appRoot, path.join(pathToVersion, 'doc', 'CONSTANTS.md'));

    fs.writeFileSync(outputPath, output);


    // console.dir(input, { depth: 2 });

}

await buildConstantsDocs('src/versions/3.0.0');