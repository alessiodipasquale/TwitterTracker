import Twitter from "../server/routes/Twitter";
import {expect} from 'chai';

Twitter.init();

describe('Retweets Search By Id utests', () => {

    var id: string = "1454832552271884290";
    var retweeterId: number = 1457743051141664800;
    var count: number = 1;
    var query = {id: id, count:count};

    describe('#IncludeRetweet', () => {
      it('should contain the user previously prepared', async function() {
        await Twitter.getRetweetsByTweetId(query).then(data => {
            let res: any = JSON.parse(JSON.stringify(data));
            expect(res.data[0].user.id).to.equal(retweeterId);
        });
      });
    });
});
