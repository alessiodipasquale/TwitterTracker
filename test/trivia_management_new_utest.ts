import Twitter from "../server/routes/Twitter";
import Database from '../server/config/Database';
import { createServer, Server} from 'http';
import { expect, assert } from 'chai';
import { Server as SocketServer } from "socket.io";
import { io as Client } from "socket.io-client";
import { delay } from "../server/Utils/Utils"
import { setListenersForSocket } from "../server/routes/StreamManager"
// import {execaNode} from 'execa'; // da i problemi
//const axios = require('axios').default;

Twitter.authentication();

	describe('#Game creation Tests', () => {
		let io: any, serverSocket: any, clientSocket: any, httpServer: Server;
		
		it("Should create a new game to test", () => {
			const streamDefinitions = {
				"name":"#swe_4_test_triviaGames",
				"type": "triviaGame",
				"startDate": new Date("2022-11-28T00:00:00.000Z"),
				"endDate": new Date("2022-11-28T00:00:00.000Z"),
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
            * quando viene chiamata questa funzione "newStreamDef" viene mandato in 
            * broadcast a tutti i socket collegati 
            * il messaggio newTriviaGameCreated
            * dovrest essere capace di farne catching
            * per il momento basta questo, poi proseguo io
            */

            Database.newStreamDef(streamDefinitions);
            
            Database.deleteStreamDef(streamDefinitions.name, streamDefinitions.type);
            expect(true).to.be.true;
		});
	});
