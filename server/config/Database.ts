//import mongoose, { ConnectionOptions } from 'mongoose';
import Config from './Config';

export default abstract class Database {
    private static dbConnection: any;

    static async init() {
        //const options: ConnectionOptions = { useNewUrlParser: true, useUnifiedTopology: true };
        //Database.dbConnection = await mongoose.connect(Config.dbUri, options);
    }
};


/* Serve il database ?*/