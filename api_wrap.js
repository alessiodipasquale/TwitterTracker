var twitter = require('twit');
var process = require('process');


const client_auth = {

    consumer_key: '',
    consumer_secret: '',
    bearer_token: '',
    app_only_auth: true,
};

var twitter_client = new twitter(client_auth);

module.exports = {twitter_client};