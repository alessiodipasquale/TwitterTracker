import Twitter from "./Twitter";
import {TweetV2SingleStreamResult, StreamingV2GetRulesResult } from 'twitter-api-v2';
import Database from '../config/Database';

export async function tweetEventHandler(eventData: TweetV2SingleStreamResult) {
    const activeRules = await Twitter.getStreamRules();
    const mappedRules = mapActiveRules(activeRules);
    for (var i in eventData.matching_rules) {
        let matching_rule = eventData.matching_rules[i];

        if (matching_rule.tag == "voto") {

          console.log("ricevuto un voto")
          console.log(eventData)

        } else if (matching_rule.tag == "candidatura") {

          console.log("ricevuta candidatura")
          console.log(eventData)

        }
    }
}

function mapActiveRules(activeRules: StreamingV2GetRulesResult){
  let mappedRules = [];
  for(let element of activeRules.data){
    const hashtag = element.value.split(" ")[0];
    const type = Database.getTypeFromHashtag(hashtag);
    
  }
}

export async function setListenersForSocket(socket: any): Promise<void> {
  await addListener(socket, '/readyToReceiveData', () => {sendPastData(socket)});
  await addListener(socket, '/testSocketConnection', () => {socket.emit("test",{"test":"test"})});
}

async function addListener(socket:any, event: string, listener: Function) {
  socket.on(event, async (args:any, callback:any) => {
      try {
          const result = await listener(args);
          if (!result)
              if (callback) callback();
          else
              if (callback) callback(result);
      } catch (err) {
          console.log(err);
          callback(err);
      }
  });
}

export async function disconnect(socket: any) {
  
}

export async function sendPastData(socket: any) {
  const dataFromLiteraryContests = Database.literaryContestsData;
  const dataFromTriviaGames = Database.triviaGamesData;
  await sendSocketMessage(socket, "dataFromLiteraryContests",{"dataFromLiteraryContests":dataFromLiteraryContests});
  await sendSocketMessage(socket, "dataFromTriviaGames",{"dataFromTriviaGames":dataFromTriviaGames});
}

async function sendSocketMessage(socket: any, event: string, data: any) {
  socket.emit(event,data);
}