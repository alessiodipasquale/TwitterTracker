var assert = require('assert');
var api_wrapper = require('../api_wrap.js');

describe('Tweet Search Utests', function() {

    const query = {q:'nasa', count:10};

    describe('#NonEmptySearch', function(){

        it('should find at least some tweets', async function(){

            const res = await api_wrapper.search_tweet(query);

            assert.ok(res.data);
            assert.ok(res.data.statuses);

        });

    });

    describe('#SimpleQuery', function() {

        it('should have a non-empty body', async function(){

            const res = await api_wrapper.search_tweet(query);

            for(var i = 0; i < res.data.statuses.length; i++) {

               var tweet = res.data.statuses[i]

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