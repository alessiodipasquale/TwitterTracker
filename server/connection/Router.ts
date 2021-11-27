import bodyParser from 'body-parser';
import cors from 'cors';
import { searchByKeyword, getUserInformations, /*searchTweetsByAuthor,*/ getRetweetsByTweetId, getRetweetersByTweetId, getSentimentFromTweet, getSentimentFromGroupOfTweets, addElementToStreamData } from '../routes/RoutesManager';
import express from 'express';
import Config from '../config/Config';
import { errorHandler } from '../config/Error';

export default abstract class Router {
    public static init(app: any): void {

        app.use(cors());
        app.use(express.json());
        app.use(express.urlencoded({
            extended: true
        }));
        app.enable('trust proxy');

        app.use('/', express.static(Config.distPath));

        app.post('/searchTweetsByKeyword', searchByKeyword);
        //app.post('/searchTweetsByAuthor', searchTweetsByAuthor);
        
        app.post('/getUserData', getUserInformations);

        app.get('/getRetweets/:tweetId', getRetweetsByTweetId );
        app.get('/getRetweeters/:tweetId', getRetweetersByTweetId );

        app.get('/getSentimentFromTweet/:tweetId', getSentimentFromTweet );
        app.post('/getSentimentFromGroupOfTweets', getSentimentFromGroupOfTweets );

        app.post('/addElementToStreamData', addElementToStreamData );

        app.use(errorHandler());
    }
}
