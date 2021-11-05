import Twitter from "../server/routes/Twitter";
import {expect} from 'chai';

Twitter.init();

describe('Tweet Search By Hashtags utests', () => {

    var hashtags: string[] = ['vcMsa4GxBaV4PuHsbaBYX6VMSCvqwVQQJtTJ8b7zbDdQHLSJLkjm26Jvy4KUQbmqeQKcRGpSVcjuP3NbXWnADGUNBfj33f38WCVD'];
    var q = "";
    var query = {q: q, hashtags: hashtags};

    describe('#IncludeHashtag', () => {
      it('should contain the hashtag in the tweet entities', async function() {
        Twitter.searchTweetsByHashtag(query).then(data => {

          let res: any = JSON.parse(JSON.stringify(data));

          for (var i = 0; i < res.data.statuses.length; i++) {
              var tweet = res.data.statuses[i];
              expect(tweet.text).to.include(hashtags[0]);
          }
        });
      });
    });

    describe('#IncludeHashtag', () => {
      it('should contain the hashtag in the tweet text', async function() {
        Twitter.searchTweetsByHashtag(query).then(data => {

          let res: any = JSON.parse(JSON.stringify(data));

          for (var i = 0; i < res.data.statuses.length; i++) {
              var tweet = res.data.statuses[i];
              expect(tweet.entities.hashtags).to.include(hashtags[0]);
          }
        });
      });
    });

});
