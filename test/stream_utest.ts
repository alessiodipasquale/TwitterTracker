import Twitter from "../server/routes/Twitter";
import { createServer } from 'http';
import { expect, assert } from 'chai';
import { Server } from "socket.io";
import { io as Client } from "socket.io-client";
import { delay } from "../server/Utils/Utils"
import { setListenersForSocket, sendPastData } from "../server/routes/StreamManager"

Twitter.authentication();

describe('Stream utests', () => {

  describe('#SocketTests', () => {
    let io: any, serverSocket: any, clientSocket: any;

    before((done) => {
      const httpServer: any = createServer();
      io = new Server(httpServer);
      httpServer.listen(() => {
        const port = httpServer.address().port;
        clientSocket = new (Client as any)(`http://localhost:${port}`);
        io.on("connection", (socket: any) => {
          serverSocket = socket;
        });
        clientSocket.on("connect", done);
      });
    });

    after(() => {
      io.close();
      clientSocket.close();
    });

    it("should work when testing socket connection", (done) => {
      clientSocket.once("test", (arg: any) => {
        assert.equal(arg.test, "test");
        done();
      })
      serverSocket.on("/readyToReceiveData", async (data: string) =>{
        return sendPastData(serverSocket)
      })
      serverSocket.on("/testSocketConnection", async (data: string) =>{
        serverSocket.emit("test",{"test":"test"})
      })
      clientSocket.emit("/testSocketConnection", "test");
    });
    /*
    it("should receive data", (done) => {
      clientSocket.once("dataFromLiteraryContests", (arg: any) => {
        const res: any = JSON.parse(JSON.stringify(arg)).dataFromLiteraryContests;
        assert.equal(res[0].name, "#streamTestswe4");
        done();
      })
      serverSocket.on("/readyToReceiveData", async (data: string) =>{
        return sendPastData(serverSocket)
      })
      serverSocket.on("/testSocketConnection", async (data: string) =>{
        serverSocket.emit("test",{"test":"test"})
      })
      clientSocket.emit("/readyToReceiveData", "test");
    });*/

  });
/*
  describe('#StreamDefinitions', () => {
    it('should start and close streaming', async function() {
      var oldLog = console.log;
      (function() {
        console.log = function() { };
      })();
      await delay(1000);
      await Twitter.startStream();
      await Twitter.stream.close();
      console.log = oldLog;
    });

    it('should verify sent date', async function() {
      var oldLog = console.log;
      (function() {
        console.log = function(msg: string) {
          if (typeof msg[0] == 'undefined') {
            const res = JSON.parse(JSON.stringify(msg));
            const date: Date = new Date(res.meta.sent);
            const today: Date = new Date();
            const yesterday: Date = new Date(today.getTime() - (24 * 60 * 60 * 1000));
            const tomorrow: Date = new Date(today.getTime() + (24 * 60 * 60 * 1000));
            expect(today.getTime()).to.be.within(yesterday.getTime(), tomorrow.getTime());
          }
        };
      })();
      await delay(1000);
      await Twitter.startStream();
      await Twitter.stream.close();
      console.log = oldLog;
    });
  });
*/
});
