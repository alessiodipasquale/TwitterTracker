import Twitter from "../server/routes/Twitter";
import Database from '../server/config/Database';
import { createServer } from 'http';
import { expect, assert } from 'chai';
import { Server } from "socket.io";
import { io as Client } from "socket.io-client";

Twitter.authentication();

describe('#Contest creation Tests', () => {
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
			"name": "#swe_4_test_literaryContest",
			"type": "literaryContest",
			"startDate": new Date("2022-11-28T00:00:00.000Z"),
			"endDate": new Date("2022-11-28T00:00:00.000Z"),
			"rules": [
				{
					"value": "#swe_4_test_literaryContest (candido OR candidare)",
					"tag": "candidatura"
				},
				{
					"value": "#swe_4_test_literaryContest voto",
					"tag": "voto"
				}
			],
			"extras": []
		}
		clientSocket.once("newLiteraryContestCreated", (arg: any) => {
			assert.equal(arg.name, streamDefinitions.name);
			done();
		})
		serverSocket.on("newLiteraryContestCreated", async (streamDefs: any) =>{
			serverSocket.emit("newLiteraryContestCreated", streamDefs);
		})
		Database.newStreamDef(streamDefinitions);
		let found = false;
		for (let element of Database.literaryContestsData) {
			if (element.name == streamDefinitions.name)
				found = true;
		}
		if (!found) expect(found).to.be.true;
		else {
			Database.deleteStreamDef(streamDefinitions.name, streamDefinitions.type);
			clientSocket.emit("newLiteraryContestCreated", streamDefinitions);
		}
	});
});
