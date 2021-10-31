import Twitter from "../server/config/Twitter";
import {expect} from 'chai';

Twitter.init();

describe('Tweet Search By Hashtags utests', () => {

    var hashtag: string[] = ['halloween',];


    describe('#IncludeHashtag', () => {
      it('should contain the hashtag in the tweet entities', async function() {
        Twitter.searchTweetsByHashtag(hashtag).then(data => {

          let res: any = JSON.parse(JSON.stringify(data));

          for (var i = 0; i < res.data.statuses.length; i++) {
              var tweet = res.data.statuses[i];
              expect(tweet.text).to.include(hashtag[0]);
          }
        });
      });
    });

    describe('#IncludeHashtag', () => {
      it('should contain the hashtag in the tweet text', async function() {
        Twitter.searchTweetsByHashtag(hashtag).then(data => {

          let res: any = JSON.parse(JSON.stringify(data));

          for (var i = 0; i < res.data.statuses.length; i++) {
              var tweet = res.data.statuses[i];
              expect(tweet.entities.hashtags).to.include(hashtag[0]);
          }
        });
      });
    });

});
