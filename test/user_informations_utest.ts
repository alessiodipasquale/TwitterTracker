import Twitter from "../server/routes/Twitter";
import { expect } from 'chai';
import { delay } from "../server/Utils/Utils";

Twitter.authentication();

describe('Get User Informations utests', () => {

  var uid = '1447929992550227969'
  var sname = "swe2021_4"
  var options = {};
  var query;

  describe('#CorrectUserInfo', () => {
    it('should find user by id with expected screen name', async function() {
      query = { user_id: uid };
      await Twitter.getUserInformations({query,options}).then(data => {
        let res: any = JSON.parse(JSON.stringify(data));
        expect(res.data.username).to.equal(sname);
      });
    });

    it('should find user by screen name with expected id', async function() {
      query = { username: sname };
      await Twitter.getUserInformations({query,options}).then(data => {
        let res: any = JSON.parse(JSON.stringify(data));
        expect(res.data.id).to.equal(uid);
      });
    });
  });
});
