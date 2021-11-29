type Rule = {
    value: string;
    tag: string;
}


export interface StreamDefinition {
    name: string;
    startDate: Date;
    endDate: Date;
    rules: Rule[];
}
