import Twit from "twit";
import TwitterApi, { Tweetv2SearchParams, TwitterApiReadOnly, ETwitterStreamEvent } from 'twitter-api-v2';
import Sentiment from "sentiment";
import Config from "../config/Config";
import Translate from "@vitalets/google-translate-api";

export default abstract class Twitter {
    private static twit: Twit;
    private static roClient: TwitterApiReadOnly;

    public static stream: any;

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

        Twitter.stream = Twitter.roClient.v2.searchStream({ autoConnect: false });

        // Per ora stampa i tweet streammati
        //Twitter.stream.on(ETwitterStreamEvent.Data, /*console.log*/);

        Twitter.stream.on(ETwitterStreamEvent.Connected, () => console.log('Stream is started.'));

        const ciao = "#GreenPassrafforzato";

        const rules = {
          "add": [{"value": ciao, "tag": "gp"}],
        };

        await Twitter.stream.connect({ autoReconnect: true, autoReconnectRetries: Infinity });

        await Twitter.clearStreamRules();
        await Twitter.roClient.v2.updateStreamRules(rules);
    }

    private static async logStreamRules() {

      const rules = await Twitter.roClient.v2.streamRules();

      console.log(rules);
    }

    private static async clearStreamRules() {

      const rules = await Twitter.roClient.v2.streamRules();

      await Twitter.roClient.v2.updateStreamRules({
        delete: {
          ids: rules.data.map(rule=>rule.id),
        },
      });
    }

    public static async searchTweetById(queryPath: string) {
        return await Twitter.roClient.v2.singleTweet(queryPath);
    }

    public static async searchTweetsByKeyword({query, options}: any) {
        return await Twitter.roClient.v2.searchAll(query, options);
    }

    public static async searchTweetsByHashtag(query: any) {
      return await this.twit.get('search/tweets', query);
    }

    /*public static async searchTweetsByAuthor(query: any) {
        return await this.twit.get('search/tweets', query);
    }*/

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
		const data: any = await this.searchTweetById(query);
        var sentiment = new Sentiment();
        const options: any = Config.sentimentAnalysisOptions;

		var translated : any = await Translate(String(data.data.full_text), {to: 'en'});
		var full_text : string = translated.text;

        const result = sentiment.analyze(full_text, options);
		const originalwords : string[] = [];
		for(var i = 0; i < result.words.length; ++i){
			var orig : any = await Translate(String(result.words[i]), {from: 'en', to: translated.from.language.iso});
			if(data.data.full_text.toLowerCase().includes(orig.text.toLowerCase())
				|| data.data.full_text.toLowerCase().includes(orig.text.substring(0, orig.text.length - 1).toLowerCase()))
				originalwords.push(orig.text.toLowerCase());
		}
		result.words = originalwords;
		return result;

    }
}
