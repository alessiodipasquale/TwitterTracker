import Twitter from "./Twitter";
import {TweetV2SingleStreamResult } from 'twitter-api-v2';

export async function tweetEventHandler(eventData: TweetV2SingleStreamResult) {
    for (var i in eventData.matching_rules) {
        console.log(eventData)
        let matching_rule = eventData.matching_rules[i];

        if (matching_rule.tag == "voto") {

          console.log("ricevuto un voto")

        } else if (matching_rule.tag == "candidatura") {

          console.log("ricevuta candidatura")

        }
    }
}

export async function setListenersForSocket(socket: any): Promise<void> {
  await addListener(socket, '/readyToReceiveData', () => {console.log("Front end is ready")});
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