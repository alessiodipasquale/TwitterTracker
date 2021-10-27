import bodyParser from 'body-parser';
import cors from 'cors';
import { test, test2 } from '../routes/test';

export default abstract class Router {
    public static init(app: any): void {

        app.use(bodyParser.json());
        app.use(cors());

        app.post('/searchTweetsByKeyword', test)
        app.get('/getUserData', test2)

    }
}