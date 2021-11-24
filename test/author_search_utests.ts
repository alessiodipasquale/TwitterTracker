import Twitter from "../server/routes/Twitter";
import {expect} from 'chai';
import { delay } from "../server/Utils/Utils";

Twitter.init();

describe('Tweet Search By Author utests', () => {
    const author = "elonmusk" 
    const q = "from:"+author;
    const authorId: string = "44196397" 
    const query = {queryPath:q, queryOptions:{expansions: ["author_id"]}};

    describe('#CorrectAuthor', () => {
      it('should be by the correct author', async function() {
        ;
        await Twitter.searchTweetsByKeyword(query)
        .then(paginator => {
          for (var i = 0; i < paginator.data.data.length; i++) {
              var tweet = paginator.data.data[i];
              expect(tweet.author_id).to.equal(authorId);
          }
        });
      });
    });
});