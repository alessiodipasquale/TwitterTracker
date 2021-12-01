import Constants from './Constants.json';

export default abstract class Config {
    private static _port: number;

    public static async init() {
        Config._port = Constants.port;
    }

    public static get port(): number {
        return Config._port;
    }

    public static get distPath(): string {
        return Constants.distPath;

    }

    public static get sentimentAnalysisOptions(): any {
        return Constants.sentimentAnalysisOptions;

    }

    public static get FieldsFromStandardQuery(): any {
        return Constants.FieldsFromStandardQuery;
    }

    public static get standardSearchOptions(): any{
        return Constants.standardSearchOptions;
    }

    public static get maxVotes(): number{
        return Constants.maxVotes;
    }
}