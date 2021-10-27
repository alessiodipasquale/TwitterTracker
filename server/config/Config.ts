import { CorsOptions } from 'cors';
import Constants from './Constants.json';
import dotenv from 'dotenv';
import path from 'path';
import Twit from 'twit';

export default abstract class Config {
    private static _port: number;
    private static env: any;

    public static async init() {
        Config._port = process.env.PORT ? parseInt(process.env.PORT) : Constants.port;
    }

    public static get port(): number {
        return Config._port;
    }

    public static get distPath(): string {
        return Constants.distPath;

    }

}