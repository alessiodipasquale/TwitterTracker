import Twitter from "../server/routes/Twitter";
import {expect} from 'chai';
import { delay } from "../server/Utils/Utils"

Twitter.authentication();

describe('Tweet Search By Location utests', () => {

    var latitude: string = "40.8529";
    var longitude: string = "14.2723";
    var radius: string = "0.5km";
    var geocode = "["+longitude+" "+latitude+" "+radius+"]";
    var q = "point_radius:"+geocode //"place:\"San Siro\""
    let queryOptions ={expansions:['geo.place_id'], 'place.fields':["contained_within", "country", "country_code", "full_name", "geo", "id", "name", "place_type"]}

    describe('#CorrectLocation', () => {
      it('should be by the correct location', async function() {
        await delay(1000)
        await Twitter.searchTweetsByKeyword({query: q, options:queryOptions}).then(paginator => {
          const places = [];
          for (var i = 0; i < paginator.data.data.length; i++) {
              var tweet = paginator.data.data[i];
              places.push(tweet.geo?.place_id);
          }
          expect(places).to.include("ebdc4aa39ecb7cb1");
        });
      });
    });
});
