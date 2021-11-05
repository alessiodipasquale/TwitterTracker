import bodyParser from 'body-parser';
import cors from 'cors';
import { searchByKeyword, getUserInformations, searchTweetsByLocation } from '../routes/RoutesManager';
import express from 'express';
import Config from '../config/Config';

export default abstract class Router {
    public static init(app: any): void {

        app.use(bodyParser.json());
        app.use(cors());

        app.use('/', express.static(Config.distPath));
        app.post('/searchTweetsByKeyword', searchByKeyword);
        //app.post('/searchTweetsByAuthor', searchTweetsByAuthor);      Need v2 apis
        app.post('/searchTweetsByLocation', searchTweetsByLocation);
        app.post('/getUserData', getUserInformations);
    }
}