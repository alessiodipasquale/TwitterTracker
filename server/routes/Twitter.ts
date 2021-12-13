import TwitterApi, { TwitterApiReadOnly, ETwitterStreamEvent, TweetStream } from 'twitter-api-v2';
import { tweetEventHandler } from "./StreamManager";
import Database from "../config/Database";
import Socket from '../connection/Socket';

export default abstract class Twitter {
    private static roClient_v1: any;
    private static roClient: TwitterApiReadOnly;
    public static stream: TweetStream;
    public static stream_v1: TweetStream;

    private static _currentlyActive_v1 = false;

    public static async authentication(){
      const twitterClient = new TwitterApi("AAAAAAAAAAAAAAAAAAAAAOKvNwEAAAAAoWNV8XrBS7KsdCqAZ6GHEkWZXm8%3D0pUlsutplEvsnmu9NQLbSjjvGq1zTs7YFKSxDtQr3bQHitkpN5")
      Twitter.roClient = twitterClient.readOnly;
    }

    public static async authentication_v1(){
      Twitter.roClient_v1 = new TwitterApi({
        appKey: 'xCjANsVSmJ5hwKKJz6oSZiwOC',
        appSecret: 'zPzz9otwrXFcMsCDNCubDXG97SNQcCbJEuVeQwa3P5fVlcZV4o',
        accessToken: '1447929992550227969-Xbpzos9Tiu6MUZNY4njk9ZPXCpnncE',
        accessSecret: 'M2f7dsdiFslNLqRl0FMUv3OpVummKPg2aQhQ4yGfF6XPM',
      });
    }

    public static async init() {
        Twitter.authentication_v1();
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

    public static async startStream_v1(followArgs: string[]) {
      Twitter._currentlyActive_v1 = true;
      Twitter.stream_v1 = await Twitter.roClient_v1.v1.filterStream({follow:followArgs})
      Twitter.stream_v1.on(ETwitterStreamEvent.Data, (data)=>{
        console.log(data);
        Socket.broadcast("followedUserTweeted", {data});
        console.log(data.data.place);
        console.log(data.data.coordinates);
      });
      Twitter.stream_v1.on(ETwitterStreamEvent.ConnectionError,err => console.log('Connection error!', err));
      Twitter.stream_v1.on(ETwitterStreamEvent.Connected, () => console.log('V1 Stream is started.'));
      Twitter.stream_v1.on(ETwitterStreamEvent.ConnectionClosed, () => console.log('V1 Stream Connection has been closed.'));
      await Twitter.stream_v1.connect({ autoReconnect: true, autoReconnectRetries: Infinity });
    }

    public static async stopStream_v1() {
      Twitter.stream_v1.close();
      Twitter._currentlyActive_v1 = false;
    }

    public static get currentlyActive_v1(){
      return Twitter._currentlyActive_v1;
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

    public static async findIdByUsername(username:string){
      return (await Twitter.roClient.v1.user({screen_name:username})).id_str;
    }
}
