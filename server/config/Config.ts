import Constants from './Constants.json';

export default abstract class Config {
    private static _port: number;

    public static init() {
        Config._port = process.env.PORT ? parseInt(process.env.PORT) : Constants.port;
    }

    public static get port() { return Config._port }
}