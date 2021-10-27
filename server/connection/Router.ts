import bodyParser from 'body-parser';
import cors from 'cors';
import { test, test2 } from '../routes/test';
import express from 'express';
import Config from '../config/Config';

export default abstract class Router {
    public static init(app: any): void {

        app.use(bodyParser.json());
        app.use(cors());

        app.use('/', express.static(Config.distPath));
        app.post('/searchTweetsByKeyword', test)
        app.get('/getUserData', test2)

    }
}