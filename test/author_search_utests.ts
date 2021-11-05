/*import Twitter from "../server/routes/Twitter";
import {expect} from 'chai';

Twitter.init();

describe('Tweet Search By Author utests', () => {

    var screen_name: string = "Elon Musk";
    var q = "";
    var query = {q: q, screen_name:screen_name};

    describe('#CorrectAuthor', () => {
      it('should be by the correct author', async function() {
        await Twitter.searchTweetsByAuthor(query).then(data => {

          let res: any = JSON.parse(JSON.stringify(data));

          for (var i = 0; i < res.data.statuses.length; i++) {
              var tweet = res.data.statuses[i];
              expect(tweet.user.name).to.equal(screen_name);
          }
        });
      });
    });
});
*/                  // Need v2 apis