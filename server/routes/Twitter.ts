import TwitterApi, { TwitterApiReadOnly, ETwitterStreamEvent, TweetStream, StreamingV2AddRulesParams } from 'twitter-api-v2';
import { tweetEventHandler } from "./StreamManager";
import Database from "../config/Database";
import { StreamDefinition, Rule } from '../types/StreamDefinition';

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
        await Twitter.rulesConstruction(elem,"add")
      }
      await Twitter.getStreamRules();
    }

    public static async rulesConstruction(elem:any, type:string): Promise<void>{
      let rules: any 
      if(type=="add"){
        rules = {
          "add": []
        };
        for(let rule of elem.rules){
          rules.add.push({value: rule.value, tag:rule.tag})
        }
      }
      if(type=="delete"){
        rules = {
          "delete": []
        };
        for(let rule of elem.rules){
          rules.delete.push({value: rule.value, tag:rule.tag})
        }
      }
      await Twitter.roClient.v2.updateStreamRules(rules);
    }

    public static async removeFromRules(hashtag: string){
      for(let element of Database.streamDefinitions){
        if(element.name == hashtag){
          await this.rulesConstruction(element, "delete")
        }
      }
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

    public static async searchTweetById(queryPath: string, options:any) {
        return await Twitter.roClient.v2.singleTweet(queryPath,options);
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
}
