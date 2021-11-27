//import mongoose, { ConnectionOptions } from 'mongoose';
import Config from './Config';
import Data from './Data.json'

export default abstract class Database {
    static async init() {

    }

    public static get streamData(): any[] {
        return Data.streamData;
    }
};