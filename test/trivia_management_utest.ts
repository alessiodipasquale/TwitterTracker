import Twitter from "../server/routes/Twitter";
import fetch from 'node-fetch';
import { createServer, Server} from 'http';
import { expect, assert } from 'chai';
import { Server as SocketServer } from "socket.io";
import { io as Client } from "socket.io-client";
import { delay } from "../server/Utils/Utils"
import { setListenersForSocket } from "../server/routes/StreamManager"
// import {execaNode} from 'execa'; // da i problemi
const axios = require('axios').default;

Twitter.authentication();

describe.skip('Trivia manage utests', () => {

	describe('#Game creation Tests', () => {
		let io: any, serverSocket: any, clientSocket: any, httpServer: Server;
		
		before((done) => {
			/*
			qui si fa il fork e si crea il pipe dal stdout di figlio al stdout del processo padre
			dopo di questo si possono fare le richieste a localhost:8000
			*/
			/*
			const trivia_host = execaNode('../out/index').stdout.pipe(process.stdout);;
			*/

			/*
			--- CODICE VECCHIO ---
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
			*/
		});

		after(() => {
			/*
			  trivia_host.kill();
			*/
			
			/*
			--- CODICE VECCHIO ---
			io.close();
			clientSocket.close();
			*/
		});
		
		it("Should create a new game to test", (done) => {
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
			/*
			  fa le richiesta al localhost:8000
			*/
			/*
			  const res1 = await axios.post('http://localhost:8000/addElementToStreamData', {streamDefinitions: streamDefinitions});
			  const res2 = await axios.delete(('http://localhost:8000/removeStreamElementFromData/' + streamDefinitions.name));
			*/

			/*
			--- CODICE VECCHIO ---
			const addressInfo = httpServer.address() as any;
			const port = addressInfo.port;
			
			const stringedBody = JSON.stringify(streamDefinitions);			
			const res1 = await axios.post(`http://localhost:8000/addElementToStreamData`, {streamDefinitions: streamDefinitions});
			console.log(res1);
			// const res2 = await fetch(`http://localhost:${port}/removeStreamElementFromData`, {method: 'DELETE'});
			*/
			done();
		});
	});
});
