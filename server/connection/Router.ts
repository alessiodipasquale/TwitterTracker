import cors from 'cors';
import { searchByKeyword, getUserInformations,removeStreamElementFromData, getRetweetsByTweetId, getRetweetersByTweetId, getSentimentFromTweet, getSentimentFromGroupOfTweets, addElementToStreamData, startFollowingUser } from '../routes/RoutesManager';
import express from 'express';
import Config from '../config/Config';
import { errorHandler } from '../config/Error';
import history from 'connect-history-api-fallback';

export default abstract class Router {
    public static init(app: any): void {

        app.use(cors());
        app.use(express.json());
        app.use(express.urlencoded({
            extended: true
        }));
        app.enable('trust proxy');

		// fallback handler
		
		/*app.use(history({
			rewrites: [
				{
				 from: /\/*/ /*, to: (context): string => {
					 if (context.parsedUrl) {
						 if (context.parsedUrl.pathname) {
							 if (context.parsedUrl.pathname.indexOf('/static') == 0
								 || context.parsedUrl.pathname.indexOf('/asset-manifest.json') == 0
								 || context.parsedUrl.pathname.indexOf('/logo512.png') == 0
								 || context.parsedUrl.pathname.indexOf('/logo192.png') == 0
								 || context.parsedUrl.pathname.indexOf('/robots.txt') == 0
								 || context.parsedUrl.pathname.indexOf('/favicon.ico') == 0
								 || context.parsedUrl.pathname.indexOf('/manifest.json') == 0
								 || context.parsedUrl.pathname.indexOf('/twitter.ico') == 0) {
								 return String(context.parsedUrl.pathname);
							 }
							 else return '/index.html'
						 }
						 return '/index.html'
					 }
					 return '/index.html'
				 }
				}
			]
		}));
		*/
		
        app.use('/', express.static(Config.distPath));

        app.post('/searchTweetsByKeyword', searchByKeyword);
        
        app.post('/getUserData', getUserInformations);

        app.get('/getRetweets/:tweetId', getRetweetsByTweetId );
        app.get('/getRetweeters/:tweetId', getRetweetersByTweetId );

        app.get('/getSentimentFromTweet/:tweetId', getSentimentFromTweet );
        app.post('/getSentimentFromGroupOfTweets', getSentimentFromGroupOfTweets );

        app.post('/addElementToStreamData', addElementToStreamData );
        app.delete('/removeStreamElementFromData', removeStreamElementFromData)

        app.post('/startFollowingUser', startFollowingUser );

        app.use(errorHandler());
    }
}
