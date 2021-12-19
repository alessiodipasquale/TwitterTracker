import Twitter from "./Twitter";
import {TweetV2SingleStreamResult } from 'twitter-api-v2';
import Database from '../config/Database';
import Socket from '../connection/Socket';
import Config from '../config/Config';
import { BadRequest } from "../config/Error";

/**
 * Handler for V2 stream event
 * @param eventData - Data retrieved from the event handling
 */

export async function tweetEventHandler(eventData: TweetV2SingleStreamResult) {
    const hashtag = eventData.data.text.split(" ")[0];
    console.log(eventData)
    const type = Database.getTypeFromHashtag(hashtag);
    let value = null;
    if(type != "custom" )
      value = eventData.data.text.split("\"")[1];
    const options = Config.standardSearchOptions
    const tweet = await Twitter.searchTweetById(eventData.data.id,options)
    try{
      await manageStreamRequest(type,value,hashtag,eventData.matching_rules[0], tweet)
    }catch(err){
      throw BadRequest
    }
  
}

/**
 * Stream requests manager that handle data from a new Tweet related to a stream and uses it in a properly way
 * @param type - Type of the stream
 * @param value - Value passed
 * @param hashtag - Name of the stream
 * @param matchingRule - Rule matched by the Tweet
 * @param tweet - Retrieved tweet
 */

async function manageStreamRequest(type: string, value: string | null, hashtag: string, matchingRule: any, tweet: any){
  switch (type){
    case 'literaryContest':{
      if(matchingRule.tag == "candidatura"){
        const done = Database.candidateNewBook(hashtag, value!, tweet.data.author_id)
        if(done){
          await Socket.broadcast("newCandidateInLiteraryContest",{contestName:hashtag, bookName:value, candidatedBy: tweet.data.author_id })
        }
      }else{
        const done = await Database.voteBook(hashtag, value!, tweet.data.author_id)
        if(done){
          await Socket.broadcast("newVoteInLiteraryContest",{contestName:hashtag, bookName:value, votedBy: tweet.data.author_id })
        }
      }
      break;
    }
    case 'triviaGame':{
      const answerNumber = matchingRule.tag.split("_")[1];
      const done = Database.registerAnswer(hashtag, answerNumber, value!, tweet.data.author_id, tweet.includes.users[0].username);
      if(done != undefined && done != -1){
        Socket.broadcast("newAnswerInTriviaGame",{triviaName:hashtag, answerNumber:answerNumber, answer:value, isCorrect:done, userId:tweet.data.author_id, username:tweet.includes.users[0].username,})
      }
      break;
    }
    case 'custom':{
      const ht = Database.retrieveHashtagByKeyword(matchingRule.tag)
      const done = Database.registerTweetInCustomStream(ht, tweet.data.id, tweet.data.text, tweet.includes.users[0].username);
      if(done != undefined && done != -1){
        if(done) Socket.broadcast("elementShiftedInCustomStream",{hashtag:ht})
        Socket.broadcast("newElementInCustomStream",{customName:ht, username:tweet.includes.users[0].username, text:tweet.data.text, id:tweet.data.id})
      }
      break;
    }
  }
}

/**
 * Function that set standard listeners for a socket
 * @param socket - A Socket.io object
 */

export async function setListenersForSocket(socket: any): Promise<void> {
  await addListener(socket, '/readyToReceiveData', ()=>{ return sendPastData(socket) });
  await addListener(socket, '/testSocketConnection', () => {socket.emit("test",{"test":"test"})});
}

/**
 * Function that add a single listener to a socket
 * @param socket - A Socket.io object
 * @param event - Event to handle
 * @param listener - Function for event handling
 */

export async function addListener(socket:any, event: string, listener: any) {
  socket.on(event, async (callback:any) => {
      try {
          const result = await listener();
          if(callback){
            if (!result)
                callback();
            else callback(result);
          }
      } catch (err) {
          console.log(err);
          callback(err);
      }
  });
}

/**
 * Function that send past data to a specific socket
 * @param socket - A Socket.io object
 * @returns A JSON containing data from streams in database
 */

export function sendPastData(socket: any) {
  const dataFromLiteraryContests = Database.literaryContestsData;
  const dataFromTriviaGames = Database.triviaGamesData;
  const dataFromCustomStreams = Database.customStreamsData;
  return {dataFromLiteraryContests,dataFromTriviaGames, dataFromCustomStreams}
}
