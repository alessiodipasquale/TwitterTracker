import Twitter from "../server/routes/Twitter";
import {expect} from 'chai';
import { delay } from "../server/Utils/Utils";

Twitter.authentication();

describe('Tweet Sentiment utests', () => {
    const id: string = "1458919280725172226";/*tweet for another experiment: "1447929992550227969"*/
    const query = { id:id }

    describe('#CorrectSentiment', () => {
      it('should be equal to a specific value', async function() {
        ;
        await Twitter.getSentimentFromTweet(query).then(data => {
          let res: any = JSON.parse(JSON.stringify(data));
          expect(res.score).to.equal(3);
          expect(res.comparative).to.equal(0.3);
          expect(res.positive).to.include("love");
          expect(res.negative).to.include("hate");
        });
      });
    });
});