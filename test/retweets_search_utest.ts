import Twitter from "../server/routes/Twitter";
import {expect} from 'chai';
import { delay } from "../server/Utils/Utils";

Twitter.authentication();

describe('Retweets Search By Id utests', () => {

    var id: string = "1454832552271884290";
    var retweeterId: string = "1457743051141664780";
    var retweeterName: string = "Stefano_colam";
    var query = {id: id};
    var options = {};

    describe('#IncludeRetweeter', () => {
      it('should contain the user previously prepared', async function() {
        await Twitter.getRetweetersByTweetId({query,options}).then(data => {
            let res: any = JSON.parse(JSON.stringify(data));
            expect(res.data[0].id).to.equal(retweeterId);
            expect(res.data[0].username).to.equal(retweeterName);
        });
      });
    });
    describe('#IncludeRetweet', () => {
      it('should contain the previously prepared retweet', async function() {
        await Twitter.getRetweetsByTweetId({query,options}).then(data => {
            let res: any = JSON.parse(JSON.stringify(data));
            expect(res[0].user.id_str).to.equal(retweeterId);
            expect(res[0].user.screen_name).to.equal(retweeterName);
        });
      });
    });
});
