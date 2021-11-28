//import mongoose, { ConnectionOptions } from 'mongoose';
import Config from './Config';
import Data from './Data.json'
import fs from 'fs';
import { json } from 'body-parser';
import type { StreamDefinition } from '../types/StreamDefinition'

export default abstract class Database {
    static async init() {

    }

    public static get streamDefinitions(): StreamDefinition[] {
        return Data.streamDefinitions;
    }
    public static set streamDefinitions(definitions: StreamDefinition[]) {
        fs.writeFile('./Data.json', JSON.stringify({streamDefinitions: definitions}) ,'utf8',  err => {console.log(err?.stack)})
    }
};