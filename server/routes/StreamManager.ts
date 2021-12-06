import Twitter from "./Twitter";
import {TweetV2SingleStreamResult, StreamingV2GetRulesResult } from 'twitter-api-v2';
import Database from '../config/Database';
import Socket from '../connection/Socket';
import Config from '../config/Config';

export async function tweetEventHandler(eventData: TweetV2SingleStreamResult) {
    const hashtag = eventData.data.text.split(" ")[0];
    console.log(eventData)
    const type = Database.getTypeFromHashtag(hashtag);
    const value = eventData.data.text.split("\"")[1];
    const options = Config.standardSearchOptions
    const tweet = await Twitter.searchTweetById(eventData.data.id,options)
    if(type != -1)
      await manageStreamRequest(type,value,hashtag,eventData.matching_rules[0], tweet)
}

async function manageStreamRequest(type: string, value: string, hashtag: string, matchingRule: any, tweet: any){
  switch (type){
    case 'literaryContest':{
      if(matchingRule.tag == "candidatura"){
        const done = Database.candidateNewBook(hashtag, value, tweet.data.author_id)
        if(done){
          await Socket.broadcast("newCandidateInLiteraryContest",{contestName:hashtag, bookName:value, candidatedBy: tweet.data.author_id })
        }
      }else{
        const done = Database.voteBook(hashtag, value, tweet.data.author_id)
        if(done){
          await Socket.broadcast("newVoteInLiteraryContest",{contestName:hashtag, bookName:value, votedBy: tweet.data.author_id })
        }
      }
      break;
    }
    case 'triviaGame':{
      const answerNumber = matchingRule.tag.split("_")[1];
      const done = Database.registerAnswer(hashtag, answerNumber, value, tweet.data.author_id);
      if(done != undefined && done != -1){
        Socket.broadcast("newAnswerInTriviaGame",{triviaName:hashtag, answerNumber:answerNumber, answer:value, isCorrect:done, userId:tweet.data.author_id,})
      }
      break;
    }
  }
}

export async function setListenersForSocket(socket: any): Promise<void> {
  await addListener(socket, '/readyToReceiveData', () => {sendPastData(socket)});
  await addListener(socket, '/testSocketConnection', () => {socket.emit("test",{"test":"test"})});
}


export async function addListener(socket:any, event: string, listener: Function) {
  socket.on(event, async (args:any, callback:any) => {
      try {
          const result = await listener(args);
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

export async function disconnect(socket: any) {
  
}

export async function sendPastData(socket: any) {
  const dataFromLiteraryContests = Database.literaryContestsData;
  const dataFromTriviaGames = Database.triviaGamesData;
  await Socket.sendSocketMessage(socket, "dataFromLiteraryContests",{"dataFromLiteraryContests":dataFromLiteraryContests});
  await Socket.sendSocketMessage(socket, "dataFromTriviaGames",{"dataFromTriviaGames":dataFromTriviaGames});
}