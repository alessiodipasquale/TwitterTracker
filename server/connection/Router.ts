import bodyParser from 'body-parser';
import cors from 'cors';
import { test } from '../routes/test';

export default abstract class Router {
    public static init(app: any): void {

        app.use(bodyParser.json());
        app.use(cors());

        app.post('/searchTweet', test)

    }
}