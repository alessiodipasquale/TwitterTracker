//import mongoose, { ConnectionOptions } from 'mongoose';
import Config from './Config';
import Data from './Data.json'
import fs from 'fs';
import type { StreamDefinition } from '../types/StreamDefinition'

export default abstract class Database {
    static async init() {

    }

    public static get streamDefinitions(): StreamDefinition[] {
        return Data.streamDefinitions;
    }
    public static set streamDefinitions(definitions: StreamDefinition[]) {
        const stringedData = JSON.stringify({streamDefinitions: definitions})
        try {
            fs.writeFileSync('./server/config/Data.json', stringedData);
        } catch (error) {
            console.error(error);
        }
    }
};