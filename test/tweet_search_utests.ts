import Twitter from "../server/config/Twitter";
import { expect } from 'chai';

describe('Tweet Search By Keyword utests', () => {
  const query = { q: "nasa", count: 10 }

  describe('#NonEmptySearch', () => {
    it('should find at least some tweets', async function() {
      /* expects to find some tweets */
      Twitter.searchTweetsByKeyword(query)
        .then(data => {
          console.log("testttt");
          done();
          expect(data).not.to.be.empty;
          expect(data.statuses).not.to.be.empty;
        });
    });
  });

  describe('#SimpleQuery', () => {
    it('should have a non-empty body', async function() {
      /* expects to find some text */
      Twitter.searchTweetsByKeyword(query)
        .then(data => {
          for (var i = 0; i < data.statuses.length; i++) {
            var tweet = data.statuses[i];
            expect(tweet.text).not.to.be.empty;
          }
        });
    });
  });

  describe.skip('#HashtagSearch', () => {

    it('should contain the hashtag');

  });

  describe.skip('#AuthorSearch', () => {

    it('should be by correct author');

  });

});
