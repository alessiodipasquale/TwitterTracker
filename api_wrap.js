var twitter = require('twit');
var process = require('process');

const client_auth = {

    consumer_key: 'fPRqTVDTZ0JfxRIY20Yca1Lzv',
    consumer_secret: 'UWt9R6Z0o3OEsWgz7cZtQ8MEFOIyGkuUBLgzjxKomEOq0ZhUxi',
    bearer_token: 'AAAAAAAAAAAAAAAAAAAAAKB5UgEAAAAAQZIJbHa74aQDIGLCy5GazC0GDBk%3D2X8RcQlK3A9hh3wmulT1lcb9n21EYzKEIIdC4xgUTbbCm39cWr',
    app_only_auth: true,
};

var twitter_client = new twitter(client_auth);

function search_tweet(query){
    return twitter_client.get('search/tweets', query)
};

module.exports = {twitter_client, search_tweet};