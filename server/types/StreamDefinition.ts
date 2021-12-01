type Rule = {
    value: string;
    tag: string;
}


export interface StreamDefinition {
    name: string;
    type: string;
    startDate: Date;
    endDate: Date;
    rules: Rule[];
    extras: any | undefined;
}
