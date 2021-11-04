import Twit from "twit";

interface qParams {
  base_query?: string;     // base query to add filters to
  hashtags?: string[];     // array of hashtags, the # is added if not present
  author?: string;         // author name
  since?: string;          // since date, "yyyy-mm-dd" format
  until?: string;          // until date, same format
  remove?: string[];       // array of words to be filtered out
};

export function buildQ(q: qParams): string {
  // builds the q field

  var query: string = "";

  if (q.base_query) query = q.base_query;

  if (q.hashtags){
    for (var i = 0; i < q.hashtags.length; i++){
      if (q.hashtags[i].indexOf('#') == -1) {
        q.hashtags[i] = "#".concat(q.hashtags[i]);
      }
    }

    query = query.concat(q.hashtags.join(" ")).concat(" ");
  }

  if (q.author) {
    query = query.concat(`from:${q.author} `);
  }

  if (q.since) {
    query = query.concat(`since:${q.since} `);
  }

  if (q.until) {
    query = query.concat(`until:${q.until} `);
  }

  if (q.remove) {
    for (var i = 0; i < q.remove.length; i++){
      if (q.remove[i].indexOf('-') == -1) {
        q.remove[i] = "-".concat(q.remove[i]);
      }
    }

      query = query.concat(q.remove.join(" ")).concat(" ");
  }

  return query;
};

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

    public static async searchTweetsByKeyword(query: any) {
        //search all tweets that contain keyword
        return await this.twit.get('search/tweets', query);
    }

    public static async searchTweetsByHashtag(hashtags: string[], c = 15) {

      var query = {q: buildQ({hashtags: hashtags}), count: c};

      return await this.twit.get('search/tweets', query);
    }

    public static async searchTweetsByAuthor(author: string, c = 15) {

        var query = {q: buildQ({author: author}), count:c};  // see search operators

        return await this.twit.get('search/tweets', query);
    }

    public static async searchTweetsInLocation(
      q: string, latitude: string, longitude: string, radius: string) {  // strings assuming thats what the form will semnd

      var query = {q: q, geocode:"${latitude},${longitude},${radius}"};

      return await this.twit.get('search/tweets', query);

    }

    public static async getUserInformations(query: any) {
        //return information about user passed as param
        return await this.twit.get('users/show', {screen_name: 'colamonaco_stef'});
    }


}
