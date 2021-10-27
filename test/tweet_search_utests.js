var assert = require('assert');
var api_wrapper = require('../api_wrap.js');

describe('Tweet Search Utests', function() {

    var tweets;
    const query = {q:'nasa', count:10};

    api_wrapper.twitter_client.get('search/tweets', query,
            function(err, data, res){
                // Somehow metti data in tweets
    });

    describe('#NonEmptySearch', function(){

        it('should find at least some tweets', function(){
            assert.ok(tweets);
            assert.ok(tweets.statuses);
            assert.not_equal(tweets.statuses.length, 0);
        });

    });

    describe('#SimpleQuery', function() {

        it('should have a non-empty body', function(){

            for(var tweet in tweets.statuses) {

               assert.ok(tweet.text);
            }

        });

    });

    describe('#HashtagSearch', function() {

        it('should contain the hashtag');

    });

    describe('#AuthorSearch', function() {

         it('should be by correct author');

    });

});