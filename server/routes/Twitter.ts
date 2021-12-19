import TwitterApi, { TwitterApiReadOnly, ETwitterStreamEvent, TweetStream } from 'twitter-api-v2';
import { tweetEventHandler } from "./StreamManager";
import Database from "../config/Database";
import Socket from '../connection/Socket';

/** 
 * This class manage everything related to interfacing with Twitter
 */

export default abstract class Twitter {
    private static roClient_v1: any;
    private static roClient: TwitterApiReadOnly;
    public static stream: TweetStream;
    public static stream_v1: TweetStream;

    private static _currentlyActive_v1 = false;

    /** 
     * Authenication for V2 API
     */    

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

    /**
     * Initialization that includes both autentications and V2 stream starting
     */

    public static async init() {
        Twitter.authentication_v1();
        Twitter.authentication();
        Twitter.startStream();
    }

    /**
     * V2 stream starting
     */

    public static async startStream() {
      Twitter.stream = Twitter.roClient.v2.searchStream({ autoConnect: false });
      Twitter.stream.on(ETwitterStreamEvent.Data, tweetEventHandler);
      Twitter.stream.on(ETwitterStreamEvent.Connected, () => console.log('Stream is started.'));
      Twitter.stream.on(ETwitterStreamEvent.ConnectionClosed, () => console.log('Connection has been closed.'));
      await Twitter.stream.connect({ autoReconnect: true, autoReconnectRetries: Infinity });
      await Twitter.clearStreamRulesIfPresent();

      const contests = Database.streamDefinitions;
      for (const elem of contests) {
        await Twitter.rulesConstruction(elem,"add")
      }
      await Twitter.getStreamRules();
    }

    /**
     * V1 stream starting for User Tracking feature
     * @param followArgs - Array of user ids to follow
     */

    public static async startStream_v1(followArgs: string[]) {
      Twitter._currentlyActive_v1 = true;
      Twitter.stream_v1 = await Twitter.roClient_v1.v1.filterStream({follow:followArgs})
      Twitter.stream_v1.on(ETwitterStreamEvent.Data, (data)=>{
        if(data.user.id_str == followArgs[0]){
          console.log(data);
          Socket.broadcast("followedUserTweeted", {data});
        }
      });
      Twitter.stream_v1.on(ETwitterStreamEvent.ConnectionError,err => console.log('Connection error!', err));
      Twitter.stream_v1.on(ETwitterStreamEvent.Connected, () => console.log('V1 Stream is started.'));
      Twitter.stream_v1.on(ETwitterStreamEvent.ConnectionClosed, () => console.log('V1 Stream Connection has been closed.'));
      await Twitter.stream_v1.connect({ autoReconnect: true, autoReconnectRetries: Infinity });
    }

    /**
     * V1 stream ending
     */

    public static async stopStream_v1() {
      Twitter.stream_v1.close();
      Twitter._currentlyActive_v1 = false;
    }

    /**
     * Getter method
     * @returns - true if there is a V1 stream active, false otherwise
     */

    public static get currentlyActive_v1(){
      return Twitter._currentlyActive_v1;
    }

    /**
     * Function that build and add/delete rules for stream
     * @param elem - object that contains params for rules construction
     * @param type - add or delete
     */

    public static async rulesConstruction(elem:any, type:string): Promise<void>{
      let rules: any
      if(type=="add"){
        rules = {
          "add": []
        };
        for(const rule of elem.rules){
          rules.add.push({value: rule.value, tag:rule.tag})
        }
      }
      if(type=="delete"){
        rules = {
          "delete": []
        };
        for(const rule of elem.rules){
          rules.delete.push({value: rule.value, tag:rule.tag})
        }
      }
      await Twitter.roClient.v2.updateStreamRules(rules);
    }

    /** 
     * Wrapper for {@link rulesConstruction}
     */ 

    public static async removeFromRules(hashtag: string){
      for(const element of Database.streamDefinitions){
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

    /**
     * Function that delete all stream rules active (if present)
     */

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

    /**
     * Comunication with Twitter V2 standard API using "twitter-api-v2" npm package
     */

    public static async searchTweetById(queryPath: string, options:any) {
        return await Twitter.roClient.v2.singleTweet(queryPath,options);
    }

    /**
     * Comunication with Twitter V2 standard API using "twitter-api-v2" npm package
     */
    
    public static async searchTweetsByKeyword({query, options}: any) {
        return await Twitter.roClient.v2.searchAll(query, options);
    }

    public static async getUserInformations({query, options}: any) {
      if (query.user_id)
        return await Twitter.roClient.v2.user(query.user_id,options);
      else
        return await Twitter.roClient.v2.userByUsername(query.username,options);
    }

    /**
     * Comunication with Twitter V2 standard API using "twitter-api-v2" npm package
     */

    public static async getRetweetersByTweetId({query,options}: any) {
        return await Twitter.roClient.v2.tweetRetweetedBy(query.id,options);
    }

    /**
     * Comunication with Twitter V2 standard API using "twitter-api-v2" npm package
     */

    public static async getRetweetsByTweetId({query,options}: any) {
      return await Twitter.roClient.v1.get('statuses/retweets/'.concat(query.id).concat('.json'),{})
    }

    /**
     * Comunication with Twitter V2 standard API using "twitter-api-v2" npm package
     */

    public static async findIdByUsername(username:string){
      return (await Twitter.roClient.v1.user({screen_name:username})).id_str;
    }
}
