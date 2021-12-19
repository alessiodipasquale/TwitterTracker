
/**
 * Interface that define standard structure for a Rule
 */

export type Rule = {
    value: string;
    tag: string;
}

/**
 * Interface that define standard structure for a stream
 */

export interface StreamDefinition {
    name: string;
    type: string;
    startDate: Date;
    endDate: Date;
    rules: Rule[];
    extras: any | undefined;
}
