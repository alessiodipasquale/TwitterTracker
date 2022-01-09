import Constants from './Constants.json';

/**
 * Configuration class that takes care of providing standard data 
 */

export default abstract class Config {
    private static _port: number;

    /**
     * Initialize standard values for the application
     */

    public static async init() {
        Config._port = Constants.port;
    }

    /**
     * @returns Port value for the application
     */

    public static get port(): number {
        return Config._port;
    }

    /**
     * @returns Path for the application
     */

    public static get distPath(): string {
        return Constants.distPath;

    }

    /**
     * @returns Path for the application
     */

     public static get docsPath(): string {
        return Constants.docsPath;

    }

    /**
     * @returns Path for the application
     */

     public static get docsFrontendPath(): string {
        return Constants.docsFrontendPath;

    }

    /**
     * @returns Some standard options for sentiment analysis
     */

    public static get sentimentAnalysisOptions(): any {
        return Constants.sentimentAnalysisOptions;
    }

    /**
     * @returns Some standard params for queries
     */

    public static get FieldsFromStandardQuery(): any {
        return Constants.FieldsFromStandardQuery;
    }

    /**
     * @returns Some standard params for queries
     */

    public static get standardSearchOptions(): any{
        return Constants.standardSearchOptions;
    }

    /**
     * @returns Max number of votes an user can have in a contest
     */

    public static get maxVotes(): number{
        return Constants.maxVotes;
    }

    /**
     * @returns Max number of Tweets you can see in real time from a custom stream
     */

    public static get maxElementsFromCustomStream(): number{
        return Constants.maxElementsFromCustomStream;
    }

    /**
     * @returns Production path for database file
     */

     public static get productionDatabasePath(): string{
        return Constants.productionDatabasePath;
    }

    /**
     * @returns Developement path for database file
     */

     public static get devDatabasePath(): string{
        return Constants.devDatabasePath;
    }
}