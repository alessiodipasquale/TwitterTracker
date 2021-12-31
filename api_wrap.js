var twitter = require('twit');
var process = require('process');

const client_auth = {

    consumer_key: '',
    consumer_secret: '',
    bearer_token: '',
    app_only_auth: true,
};

var twitter_client = new twitter(client_auth);

function search_tweet(query){
    return twitter_client.get('search/tweets', query)
}

module.exports = {twitter_client, search_tweet};