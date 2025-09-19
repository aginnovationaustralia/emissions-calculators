
type ConstantValue = {
    name: string;
    comments: string;
    value: number | string | null | bigint | boolean | RegExp;
    path: string[]
}

type CommentType = 'link' | 'description' | 'units' | 'inventory2018' | 'inventory2022' | 'type' | 'reference'

type DocComment = {
    text: string;
    type: CommentType;
}

type DocSection = {
    name: string;
    values: ConstantValue[];
    comments: DocComment[];
}

export type { CommentType, ConstantValue, DocComment, DocSection };

