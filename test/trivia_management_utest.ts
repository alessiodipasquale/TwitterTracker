/*import Twitter from "../server/routes/Twitter";
import fetch from 'node-fetch';
import { createServer, Server} from 'http';
import { expect, assert } from 'chai';
import { Server as SocketServer } from "socket.io";
import { io as Client } from "socket.io-client";
import { delay } from "../server/Utils/Utils"
import { setListenersForSocket } from "../server/routes/StreamManager"

Twitter.authentication();

describe('Trivia manage utests', () => {

  describe('#Game creation Tests', () => {
    let io: any, serverSocket: any, clientSocket: any, httpServer: Server;

    before((done) => {
      httpServer = createServer();
      io = new SocketServer(httpServer);
      httpServer.listen(() => {
        const addressInfo = httpServer.address() as any;
        const port = addressInfo.port;
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

    it("Should create a new game to test", async (done) => {
        const addressInfo = httpServer.address() as any;
        const port = addressInfo.port;
        const streamDefinitions = {
            "name":"#swe_4_test_triviaGames",
            "type": "triviaGame",
            "startDate": "2022-11-28T00:00:00.000Z",
            "endDate": "2022-11-28T00:00:00.000Z",
            "rules":[
                {
                    "value": "#swe_4_test_triviaGames risposta_1:",
                    "tag": "risposta_1"
                },
                {
                    "value": "#swe_4_test_triviaGames risposta_2:",
                    "tag": "risposta_2"
                }
            ],
            "extras":{
                "questions":[
                    {
                        "number":1,
                        "text": "Text question 1",
                        "correctAnswers":["correctAnswer1"],
                    },
                    {
                        "number":2,
                        "text": "Text question 2",
                        "correctAnswers":["correctAnswer2"],
                    }
                ]
            }
        }
        const stringedBody = JSON.stringify(streamDefinitions)
        const response = await fetch(`http://localhost:${port}/addElementToStreamData`, {method: 'POST', body: stringedBody});
        const response = await fetch(`http://localhost:${port}/addElementToStreamData`, {method: 'DELETE'});
    });
  });
});

*/