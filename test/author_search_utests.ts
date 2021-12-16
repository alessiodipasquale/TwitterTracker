import Twitter from "../server/routes/Twitter";
import {expect} from 'chai';

Twitter.authentication();

describe('Tweet Search By Author utests', () => {
    const author = "elonmusk" 
    const q = "from:"+author;
    const authorId: string = "44196397" 
    const query = {query:q, options:{expansions: ["author_id"]}};

    describe('#CorrectAuthor', () => {
      it('should be by the correct author', async function() {
        await Twitter.searchTweetsByKeyword(query)
        .then(paginator => {
          for (let tweet of paginator.data.data) {
              expect(tweet.author_id).to.equal(authorId);
          }
        });
      });
    });
});