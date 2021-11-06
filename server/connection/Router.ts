import bodyParser from 'body-parser';
import cors from 'cors';
import { searchByKeyword, getUserInformations, searchTweetsByLocation, searchTweetsByAuthor } from '../routes/RoutesManager';
import express from 'express';
import Config from '../config/Config';

export default abstract class Router {
    public static init(app: any): void {

        app.use(bodyParser.json());
        app.use(cors());

        app.use('/', express.static(Config.distPath));
        app.post('/searchTweetsByKeyword', searchByKeyword);
        app.post('/searchTweetsByAuthor', searchTweetsByAuthor);
        app.post('/searchTweetsByLocation', searchTweetsByLocation);
        app.post('/getUserData', getUserInformations);
    }
}