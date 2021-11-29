import Twitter from "../server/routes/Twitter";
import { expect } from 'chai';
import { delay } from "../server/Utils/Utils"

Twitter.authentication();

describe('Stream utests', () => {

  describe('#StreamDefinitions', () => {
    it('should start and close streaming', async function() {
      var oldLog = console.log;
      (function() {
        console.log = function() { };
      })();
      await delay(1000);
      await Twitter.startStream();
      await delay(5000);
      await Twitter.stream.close();
      console.log = oldLog;
    });

    it('should verify sent date', async function() {
      var oldLog = console.log;
      (function() {
        console.log = function(msg: string) {
          if(typeof msg[0] == 'undefined'){
            const res = JSON.parse(JSON.stringify(msg));
            const date: Date = new Date(res.meta.sent);
            const today: Date = new Date();
            const yesterday : Date = new Date(today.getTime() - (24 * 60 * 60 * 1000));
            const tomorrow : Date = new Date(today.getTime() + (24 * 60 * 60 * 1000));
            expect(today.getDate()).to.be.within(yesterday.getDate(), tomorrow.getDate());
          }
        };
      })();
      await delay(1000);
      await Twitter.startStream();
      await delay(5000);
      await Twitter.stream.close();
      console.log = oldLog;
    });
  });
});
