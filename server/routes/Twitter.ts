import Twit from "twit";
import TwitterApi, { Tweetv2SearchParams, TwitterApiReadOnly } from 'twitter-api-v2';
import Sentiment from "sentiment";
import Config from "../config/Config";

export default abstract class Twitter {
    private static twit: Twit;
    private static roClient: TwitterApiReadOnly;

    public static async init() {
        /*const twitterClient = new TwitterApi({
            appKey: 'xCjANsVSmJ5hwKKJz6oSZiwOC', 
            appSecret: 'zPzz9otwrXFcMsCDNCubDXG97SNQcCbJEuVeQwa3P5fVlcZV4o', 
            // Following access tokens are not required if you are
            // at part 1 of user-auth process (ask for a request token)
            // or if you want a app-only client (see below)
            accessToken: '1447929992550227969-Xbpzos9Tiu6MUZNY4njk9ZPXCpnncE',
            accessSecret: 'M2f7dsdiFslNLqRl0FMUv3OpVummKPg2aQhQ4yGfF6XPM',

            //prof:
            // API key: C4iQSlFz3Z1I6DrTvHQyrcK2T
            // API secret: svWpG4WnU6YdyFYMv6IljepHvPozB5zcZg37wj05XZiZIaKCvl
            //barer token: AAAAAAAAAAAAAAAAAAAAAOKvNwEAAAAAoWNV8XrBS7KsdCqAZ6GHEkWZXm8%3D0pUlsutplEvsnmu9NQLbSjjvGq1zTs7YFKSxDtQr3bQHitkpN5
        
        }); */
        //i dati nel commento precedente non dovrebbero essere necessari, usiamo il bearer token fornito dal professore
        const twitterClient = new TwitterApi("AAAAAAAAAAAAAAAAAAAAAOKvNwEAAAAAoWNV8XrBS7KsdCqAZ6GHEkWZXm8%3D0pUlsutplEvsnmu9NQLbSjjvGq1zTs7YFKSxDtQr3bQHitkpN5")
        Twitter.roClient = twitterClient.readOnly;

        Twitter.twit = new Twit({
            consumer_key: 'xCjANsVSmJ5hwKKJz6oSZiwOC',
            consumer_secret: 'zPzz9otwrXFcMsCDNCubDXG97SNQcCbJEuVeQwa3P5fVlcZV4o',
            access_token: '1447929992550227969-Xbpzos9Tiu6MUZNY4njk9ZPXCpnncE',
            access_token_secret:'M2f7dsdiFslNLqRl0FMUv3OpVummKPg2aQhQ4yGfF6XPM'
        })
    }

    public static async searchTweetById(queryPath: string) {
        return await Twitter.roClient.v2.singleTweet(queryPath);
    }

    public static async searchTweetsByKeyword(query: any) {
        return await Twitter.roClient.v2.searchAll(query.queryPath, query.queryOptions);
    }

    public static async searchTweetsByHashtag(query: any) {
      return await this.twit.get('search/tweets', query);
    }

    public static async searchTweetsByAuthor(query: any) {
        return await this.twit.get('search/tweets', query);
    }

    public static async searchTweetsByLocation(query: any) { 
      return await this.twit.get('search/tweets', query);
    }

    public static async getUserInformations(query: any) {
        return await this.twit.get('users/show', query);
    }

    public static async getRetweetsByTweetId(query: any) {     
        return await this.twit.get('statuses/retweets/:id', query);
    }

    public static async getSentimentFromTweet(query: any) {     
        const data: any = await this.searchTweetById(query.id);
        var sentiment = new Sentiment();
        const options: any = Config.sentimentAnalysisOptions;
        var result = sentiment.analyze(data.data.text, options);
        return result;
    }
}
