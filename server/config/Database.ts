//import mongoose, { ConnectionOptions } from 'mongoose';
import Config from './Config';
import Data from './Data.json'
import fs from 'fs';
import type { StreamDefinition } from '../types/StreamDefinition'

export default abstract class Database {
    static async init() {

    }

    public static get streamDefinitions(): StreamDefinition[] {
        let objectArray = JSON.parse(JSON.stringify(Data.streamDefinitions));
        for(let elem of objectArray){
            elem.startDate = new Date(elem.startDate);
            elem.startDate = new Date(elem.endDate)
        }
        return objectArray as StreamDefinition[];
    }

    public static set streamDefinitions(definitions: StreamDefinition[]) {
        const objectData = JSON.parse(JSON.stringify({streamDefinitions: definitions}));
        for(let elem of objectData){
            elem.startDate = new Date(elem.startDate).toISOString().substring(0, 10);
            elem.endDate = new Date(elem.endDate).toISOString().substring(0, 10);
        }
        const stringedData = JSON.stringify(objectData)
        try {
            fs.writeFileSync('./server/config/Data.json', stringedData);
        } catch (error) {
            console.error(error);
        }
    }

    public static get literaryContestsData(){
        let objectArray = JSON.parse(JSON.stringify(Data.DataFromLiteraryContests));
        return objectArray;
    }

    public static get triviaGamesData(){
        let objectArray = JSON.parse(JSON.stringify(Data.DataFromTriviaGames));
        return objectArray;
    }
};