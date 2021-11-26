import Twitter from "../server/routes/Twitter";
import { expect } from 'chai';
import { delay } from "../server/Utils/Utils";

Twitter.authentication();

describe('Get User Informations utests', () => {

  var uid = '1447929992550227969'
  var sname = "swe2021_4"
  var query_1 = { user_id: uid };
  var query_2 = { screen_name: sname };

  describe('#CorrectUserInfo', () => {
    it('should find user by id with expected screen name', async function() {
      
      await Twitter.getUserInformations(query_1).then(data => {
        let res: any = JSON.parse(JSON.stringify(data));
        expect(res.data.screen_name).to.equal(sname);
      });
    });

    it('should find user by screen name with expected id', async function() {
      
      await Twitter.getUserInformations(query_2).then(data => {
        let res: any = JSON.parse(JSON.stringify(data));
        expect(res.data.id_str).to.equal(uid);
      });
    });
  });
});
