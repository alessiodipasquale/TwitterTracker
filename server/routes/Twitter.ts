import TwitterApi, { TwitterApiReadOnly, ETwitterStreamEvent, TweetStream, StreamingV2AddRulesParams } from 'twitter-api-v2';
import Sentiment from "sentiment";
import Config from "../config/Config";
import Translate from "@vitalets/google-translate-api";
import { tweetEventHandler } from "./StreamManager";
import Database from "../config/Database";

export default abstract class Twitter {
    private static roClient: TwitterApiReadOnly;
    public static stream: TweetStream;

    public static async authentication(){
      const twitterClient = new TwitterApi("AAAAAAAAAAAAAAAAAAAAAOKvNwEAAAAAoWNV8XrBS7KsdCqAZ6GHEkWZXm8%3D0pUlsutplEvsnmu9NQLbSjjvGq1zTs7YFKSxDtQr3bQHitkpN5")
      Twitter.roClient = twitterClient.readOnly;
    }

    public static async init() {
        Twitter.authentication();
        Twitter.startStream();
    }

    public static async startStream() {
      Twitter.stream = Twitter.roClient.v2.searchStream({ autoConnect: false });
      Twitter.stream.on(ETwitterStreamEvent.Data, tweetEventHandler);
      Twitter.stream.on(ETwitterStreamEvent.Connected, () => console.log('Stream is started.'));
      Twitter.stream.on(ETwitterStreamEvent.ConnectionClosed, () => console.log('Connection has been closed.'));
      await Twitter.stream.connect({ autoReconnect: true, autoReconnectRetries: Infinity });
      await Twitter.clearStreamRulesIfPresent();
  
      const contests = Database.streamDefinitions;
      for (let elem of contests) {
        let rules = Twitter.rulesConstruction(elem)
        await Twitter.roClient.v2.updateStreamRules(rules);
      }
      await Twitter.getStreamRules();
    }

    private static rulesConstruction(elem:any): StreamingV2AddRulesParams{
      let rules: any = {
        "add": []
      };
      for(let rule of elem.rules){
        rules.add.push({value: rule.value, tag:rule.tag})
      }
      return rules;
    }

    public static async getStreamRules() {
      const rules = await Twitter.roClient.v2.streamRules();
      console.log(rules);
      return rules;
    }

    private static async clearStreamRulesIfPresent() {
      const rules = await Twitter.roClient.v2.streamRules();
      if(rules.data){
        await Twitter.roClient.v2.updateStreamRules({
          delete: {
            ids: rules.data.map(rule=>rule.id),
          },
        });
      }
    }

    public static async searchTweetById(queryPath: string) {
        return await Twitter.roClient.v2.singleTweet(queryPath);
    }

    public static async searchTweetsByKeyword({query, options}: any) {
        return await Twitter.roClient.v2.searchAll(query, options);
    }

    public static async getUserInformations({query, options}: any) {
      if (query.user_id)
        return await Twitter.roClient.v2.user(query.user_id,options);
      else
        return await Twitter.roClient.v2.userByUsername(query.username,options);
    }

    public static async getRetweetersByTweetId({query,options}: any) {
        return await Twitter.roClient.v2.tweetRetweetedBy(query.id,options);
    }

    public static async getRetweetsByTweetId({query,options}: any) {
      return await Twitter.roClient.v1.get('statuses/retweets/'.concat(query.id).concat('.json'),{})
    }

    public static async getSentimentFromTweet(query: any) {
		  const data: any = await this.searchTweetById(query.id);

      var sentiment = new Sentiment();
      const options: any = Config.sentimentAnalysisOptions;

		  var translated : any = await Translate(String(data.data.text), {to: 'en'});
		  var full_text : string = translated.text;

      const result = sentiment.analyze(full_text, options);
		  const originalwords : string[] = [];
		  for(var i = 0; i < result.words.length; ++i){
			var orig : any = await Translate(String(result.words[i]), {from: 'en', to: translated.from.language.iso});
			if(data.data.text.toLowerCase().includes(orig.text.toLowerCase()) || data.data.text.toLowerCase().includes(orig.text.substring(0, orig.text.length - 1).toLowerCase()))
				originalwords.push(orig.text.toLowerCase());
		  }
		  result.words = originalwords;
		  return result;
    }
}
