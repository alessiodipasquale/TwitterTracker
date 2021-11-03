import Twitter from "../server/config/Twitter";
import {expect} from 'chai';

Twitter.init();

describe('Tweet Search By Author utests', () => {

    var author: string = "Ingegneria del Software - Gruppo 4";

    describe('#CorrectAuthor', () => {
      it('should be by the correct author', async function() {
        Twitter.searchTweetsByAuthor(author).then(data => {

          let res: any = JSON.parse(JSON.stringify(data));

          for (var i = 0; i < res.data.statuses.length; i++) {
              var tweet = res.data.statuses[i];
              expect(tweet.user.name).to.equal(author);
          }
        });
      });
    });
});
