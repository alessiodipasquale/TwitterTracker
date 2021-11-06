import Twitter from "../server/routes/Twitter";
import {expect} from 'chai';
import  searchTweetsByAuthor from "../server/routes/Twitter"

Twitter.init();

describe('Tweet Search By Author utests', () => {
    var author = "Elon Musk" 
    var q = "from:"+author;
    var query = {q: q};

    describe('#CorrectAuthor', () => {
      it('should be by the correct author', async function() {
        await Twitter.searchTweetsByAuthor(query).then(data => {

          let res: any = JSON.parse(JSON.stringify(data));

          for (var i = 0; i < res.data.statuses.length; i++) {
              var tweet = res.data.statuses[i];
              expect(tweet.user.name).to.equal(author);
          }
        });
      });
    });
});