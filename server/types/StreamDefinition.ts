type Rule = {
    value: string;
    tag: string;
}


export interface StreamDefinition {
    name: string;
    rules: Rule[];
}