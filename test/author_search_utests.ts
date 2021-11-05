import Twitter from "../server/routes/Twitter";
import {expect} from 'chai';

Twitter.init();

describe('Tweet Search By Author utests', () => {

    var author: string = "Ingegneria del Software - Gruppo 4";
    var q = "";
    var query = {q: q, author:author};

    describe('#CorrectAuthor', () => {
      it('should be by the correct author', async function() {
        Twitter.searchTweetsByAuthor(query).then(data => {

          let res: any = JSON.parse(JSON.stringify(data));

          for (var i = 0; i < res.data.statuses.length; i++) {
              var tweet = res.data.statuses[i];
              expect(tweet.user.name).to.equal(author);
          }
        });
      });
    });
});
