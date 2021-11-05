import Twit from "twit";

export default abstract class Twitter {
    private static twit: Twit;

    public static async init() {
        Twitter.twit = new Twit({
            consumer_key: 'xCjANsVSmJ5hwKKJz6oSZiwOC',
            consumer_secret: 'zPzz9otwrXFcMsCDNCubDXG97SNQcCbJEuVeQwa3P5fVlcZV4o',
            access_token: '1447929992550227969-Xbpzos9Tiu6MUZNY4njk9ZPXCpnncE',
            access_token_secret:'M2f7dsdiFslNLqRl0FMUv3OpVummKPg2aQhQ4yGfF6XPM'
        })
    }

    public static async searchTweetsByKeyword(query: any) {  // search all tweets that contain keyword
        return await this.twit.get('search/tweets', query);
    }

    public static async searchTweetsByHashtag(query: any) {
      return await this.twit.get('search/tweets', query);
    }

    public static async searchTweetsByAuthor(query: any) {
        return await this.twit.get('search/tweets', query);
    }

    public static async searchTweetsByLocation(query: any) {  // strings assuming thats what the form will semnd
      return await this.twit.get('search/tweets', query);
    }

    public static async getUserInformations(query: any) {     // returns information about user passed as param
        return await this.twit.get('users/show', query);
    }
}
