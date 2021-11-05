import Twitter from "../server/routes/Twitter";
import {expect} from 'chai';

Twitter.init();

describe('Tweet Search By Location utests', () => {

    var latitude: string = "40.8359336";
    var longitude: string = "14.2487826";
    var radius: string = "3km";
    var geocode = latitude + "," + longitude + "," + radius;
    var q = "";
    var query = {q: q, geocode: geocode};

    describe('#CorrectLocation', () => {
      it('should be by the correct location', async function() {
        await Twitter.searchTweetsByLocation(query).then(data => {

          let res: any = JSON.parse(JSON.stringify(data));

          for (var i = 0; i < res.data.statuses.length; i++) {
              var tweet = res.data.statuses[i];
              expect(tweet.place.name).to.equal("Naples");
          }
        });
      });
    });
});
