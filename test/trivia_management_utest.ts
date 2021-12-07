import Twitter from "../server/routes/Twitter";
import Database from '../server/config/Database';
import { createServer } from 'http';
import { expect, assert } from 'chai';
import { Server } from "socket.io";
import { io as Client } from "socket.io-client";
import { addListener } from "../server/routes/StreamManager"

Twitter.authentication();

describe('#Game creation Tests', () => {
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

	it("Should create a new game to test", (done) => {
		const streamDefinitions = {
			"name": "#swe_4_test_triviaGames",
			"type": "triviaGame",
			"startDate": new Date("2022-11-28T00:00:00.000Z"),
			"endDate": new Date("2022-11-28T00:00:00.000Z"),
			"rules": [
				{
					"value": "#swe_4_test_triviaGames risposta_1:",
					"tag": "risposta_1"
				},
				{
					"value": "#swe_4_test_triviaGames risposta_2:",
					"tag": "risposta_2"
				}
			],
			"extras": {
				"questions": [
					{
						"number": 1,
						"text": "Text question 1",
						"correctAnswers": ["correctAnswer1"],
					},
					{
						"number": 2,
						"text": "Text question 2",
						"correctAnswers": ["correctAnswer2"],
					}
				]
			}
		}
		clientSocket.once("newTriviaGameCreated", (arg: any) => {
			assert.equal(arg.name, streamDefinitions.name);
			done();
		})
		addListener(serverSocket, "newTriviaGameCreated", (streamDefinitions: any) => {
			serverSocket.emit("newTriviaGameCreated", streamDefinitions);
		});

		Database.newStreamDef(streamDefinitions);
		Database.deleteStreamDef(streamDefinitions.name, streamDefinitions.type);
		clientSocket.emit("newTriviaGameCreated", streamDefinitions);
	});
});
