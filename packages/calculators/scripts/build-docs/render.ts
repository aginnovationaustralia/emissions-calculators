import { CommentType, ConstantValue, DocComment, DocSection } from "./types";
import { quoteString } from "./util";


const renderCommentType = (type: CommentType): string => {
    switch (type) {
        case 'link':
            return 'Link';
        case 'description':
            return 'Description';
        case 'units':
            return 'Units';
        case 'inventory2018':
            return 'GHG Inventory 2018';
        case 'inventory2022':
            return 'GHG Inventory 2022';
        case 'type':
            return 'Type';
        case 'reference':
            return 'Reference';
    }
}

function renderSectionValues(values: ConstantValue[]): string {
    // Create a markdown table to render all value records.

    if (values.some(value => value.comments?.length > 0 && value.path.length > 1)) {
        const header = `| Path | Comments | Value |\n| --- | --- | --- |\n`
        const rows = values.map((value) => {
            return `| ${quoteString(value.path.join('.'))} | ${value.comments} | ${value.value} |\n`
        })
        return header + rows.join('')
    }

    const header = `| Path | Value |\n| --- | --- |\n`
        const rows = values.map((value) => {
            return `| ${quoteString(value.path.join('.'))} | ${value.value} |\n`
        })
        return header + rows.join('')
}

const renderSectionComments = (comments: DocComment[]): string => {
    if (comments.length === 0) {
        return ''
    }
    return `| | |\n| --- | --- |\n${comments.map(comment => `| ${renderCommentType(comment.type)} | ${comment.text} |`).join('\n')}`
}

const renderSection = (section: DocSection): string => {
    return `## ${section.name}\n
${renderSectionComments(section.comments)}
\n
${renderSectionValues(section.values)}`
}

export { renderCommentType, renderSection, renderSectionComments, renderSectionValues };

