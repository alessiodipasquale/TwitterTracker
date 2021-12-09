//import mongoose, { ConnectionOptions } from 'mongoose';
import Config from './Config';
import Data from './Data.json'
import fs from 'fs';
import Socket from '../connection/Socket'
import type { StreamDefinition } from '../types/StreamDefinition'

export default abstract class Database {
    static async init() {

    }

    public static get streamDefinitions(): StreamDefinition[] {
        let objectArray = JSON.parse(JSON.stringify(Data.streamDefinitions));
        for(let elem of objectArray){
            elem.startDate = new Date(elem.startDate);
            elem.startDate = new Date(elem.endDate)
        }
        return objectArray as StreamDefinition[];
    }

    public static set streamDefinitions(definitions: StreamDefinition[]) {
        let allData = Data;
        const objectData = JSON.parse(JSON.stringify({streamDefinitions: definitions}));
        for(let elem of objectData){
            elem.startDate = new Date(elem.startDate).toISOString().substring(0, 10);
            elem.endDate = new Date(elem.endDate).toISOString().substring(0, 10);
        }
        allData.streamDefinitions = objectData.streamDefinitions;
        const stringedData = JSON.stringify(allData)
        try {
            fs.writeFileSync('./server/config/Data.json', stringedData);
        } catch (error) {
            console.error(error);
        }
    }

    public static newStreamDef(newStream: StreamDefinition){
        let currentStreamDefs: StreamDefinition[] = (Database.streamDefinitions) as StreamDefinition[];
        currentStreamDefs = currentStreamDefs.concat(newStream);
        switch(newStream.type){
            case 'literaryContest':{
                const done = Database.newLiteraryContest(newStream);
                if(done)
                    Socket.broadcast('newLiteraryContestCreated',newStream)
                break;
            }
            case 'triviaGame':{
                const done = Database.newTriviaGame(newStream);
                if(done)
                    Socket.broadcast('newTriviaGameCreated',newStream)
                break;
            }
            default:{
                console.log('Unrecognized type of stream');
            }
        }
        Database.streamDefinitions = currentStreamDefs;
    }

    public static deleteStreamDef(toDelete: string, type:string){
        let currentStreamDefs: StreamDefinition[] = (Database.streamDefinitions) as StreamDefinition[];
        currentStreamDefs = currentStreamDefs.filter((element)=>{
            return element.name != toDelete
        })
        Database.streamDefinitions = currentStreamDefs;
        if(true){
            Database.deleteStreamData(toDelete, type)
        }
    }

    public static deleteStreamData(toDelete: string, type:string){
        let currentStreamData: any[] = []; 
        if(type == 'triviaGame')
            currentStreamData = Database.triviaGamesData
        if(type == 'literaryContest')
            currentStreamData = Database.literaryContestsData
        
        currentStreamData = currentStreamData.filter((element)=>{
            return element.name != toDelete
        })

        if(type == 'triviaGame')
            Database.triviaGamesData = currentStreamData;
        if(type == 'literaryContest')
            Database.literaryContestsData = currentStreamData;
    }

    public static get literaryContestsData(){
        let objectArray = JSON.parse(JSON.stringify(Data.DataFromLiteraryContests));
        return objectArray;
    }

    public static get triviaGamesData(){
        let objectArray = JSON.parse(JSON.stringify(Data.DataFromTriviaGames));
        return objectArray;
    }

    public static set literaryContestsData(newData: any[]){
        let allData = Data;
        allData.DataFromLiteraryContests = newData;
        const stringedData = JSON.stringify(allData)
        try {
            fs.writeFileSync('./server/config/Data.json', stringedData);
        } catch (error) {
            console.error(error);
        }
    }

    public static set triviaGamesData(newData: any[]){
        let allData = Data;
        allData.DataFromTriviaGames = newData
        const stringedData = JSON.stringify(allData)
        try {
            fs.writeFileSync('./server/config/Data.json', stringedData);
        } catch (error) {
            console.error(error);
        }
    }

    public static newLiteraryContest(newStream: StreamDefinition){
        if(!Database.eventAlreadyPresent(newStream.name,"literaryContest")){
            let allData = Data;
            const objectData = allData.DataFromLiteraryContests;
            objectData.push({name: newStream.name, voters: [], books:[]});
            allData.DataFromLiteraryContests = objectData;
            const stringedData = JSON.stringify(allData)
            try {
                fs.writeFileSync('./server/config/Data.json', stringedData);
            } catch (error) {
                console.error(error);
            }
            return true;
        }
        return false;
    }

    public static newTriviaGame(newStream: StreamDefinition){
        if(!Database.eventAlreadyPresent(newStream.name,"triviaGame")){
            let allData = Data;
            const objectData = allData.DataFromTriviaGames;
            const buildedQuestions = [];
            for(let question of newStream.extras.questions){
                let lowerCase = []
                for(let cAnswer of question.correctAnswers){
                    lowerCase.push(cAnswer.toLowerCase())
                }
                const obj = {number:question.number, text:question.text, correctAnswers:lowerCase, participants:[]}
                buildedQuestions.push(obj)
            }
            objectData.push({name: newStream.name, questions: buildedQuestions});
            allData.DataFromTriviaGames = objectData;
            const stringedData = JSON.stringify(allData)
            try {
                fs.writeFileSync('./server/config/Data.json', stringedData);
            } catch (error) {
                console.error(error);
            }
            return true;
        }
        return false;
    }

    private static eventAlreadyPresent(name: string, type:string){
        let data;
        if(type=='literaryContest')
            data = Data.DataFromLiteraryContests;
        else data = Data.DataFromTriviaGames
        for(let elem of data){
            if(elem.name == name)
                return true;
        }
        return false;
    }

    public static getTypeFromHashtag(hashtag: string){
        const streamDefinitions = Database.streamDefinitions;
        for(let element of streamDefinitions){
            if(element.name == hashtag){
                return element.type;
            }
        }
        return -1;
    }

    public static candidateNewBook(hashtag:string, name:string, author_id:string){
        if(!Database.bookAlreadyPresent(hashtag,name)){
            let allData = Data;
            const objectData = allData.DataFromLiteraryContests;
            for(let elem of objectData){
                if(elem.name == hashtag){
                    elem.books.push({candidatedBy:author_id,bookName:name, votes:0, votedBy:[]})
                }
            }
            allData.DataFromLiteraryContests = objectData;
            const stringedData = JSON.stringify(allData)
            try {
                fs.writeFileSync('./server/config/Data.json', stringedData);
            } catch (error) {
                console.error(error);
            }
            return true;
        }
        return false;
    }
    private static bookAlreadyPresent(hashtag:string, name:string){
        const data = Data.DataFromLiteraryContests;
        for(let contest of data){
            if(contest.name == hashtag){
                for(let book of contest.books){
                    if(book.bookName.toLowerCase() == name.toLowerCase()){
                        return true;
                    }
                }
            } 
        }
        return false;
    }

    public static voteBook(hashtag:string, name:string, author_id:string){
        if(!Database.reachedMaxVotes(hashtag,author_id) && !Database.hasVotedBook(hashtag,name,author_id) && Database.bookAlreadyPresent(hashtag,name)){
            let allData = Data;
            const objectData = allData.DataFromLiteraryContests;
            for(let contest of objectData){
                if(contest.name == hashtag){
                    //incrementare voto in voters
                    let found = false;
                    for(let voter of contest.voters){
                        if(voter.author_id == author_id){
                            found = true;
                            voter.numVotes = voter.numVotes+1;
                        }
                    }
                    if(!found){
                        contest.voters.push({author_id, numVotes:1})
                    }
                    //aggiungere ai votanti e ai voti del libro
                    for(let book of contest.books){
                        if(book.bookName.toLowerCase() == name.toLowerCase()){
                            book.votes = book.votes+1;
                            book.votedBy.push(author_id)
                        }
                    }
                }
            }
            allData.DataFromLiteraryContests = objectData;
            const stringedData = JSON.stringify(allData)
            try {
                fs.writeFileSync('./server/config/Data.json', stringedData);
            } catch (error) {
                console.error(error);
            }
            return true;
        }
        return false;
    }

    private static reachedMaxVotes(hashtag:string ,author_id: string){
        const data = Data.DataFromLiteraryContests;
        for(let contest of data){
            if(contest.name == hashtag) {
                for(let voter of contest.voters){
                    if(voter.author_id == author_id && voter.numVotes == Config.maxVotes)
                        return true;
                }
            } 
        }
        return false;
    }

    private static hasVotedBook(hashtag:string ,name:string, author_id: string){
        const data = Data.DataFromLiteraryContests;
        for(let contest of data){
            if(contest.name == hashtag) {
                for(let book of contest.books){
                    if(book.bookName.toLowerCase() == name.toLowerCase()){
                        for(let voter of book.votedBy){
                            if(voter == author_id)
                                return true;
                        }
                    }
                }
            } 
        }
        return false;
    }

    public static registerAnswer(hashtag:string,answerNumber:number, answer:string, author_id:string, username:string){
        if(!Database.hasAlreadyAnswered(hashtag,answerNumber, author_id)){
            let allData = Data;
            const objectData = allData.DataFromTriviaGames;
            let correct;
            for(let game of objectData){
                if(game.name == hashtag){
                    for(let question of game.questions){
                        if(question.number == answerNumber){
                            correct = question.correctAnswers.includes(answer.toLowerCase())
                            question.participants.push({username: username, userId:author_id, answeredTo: answerNumber, answer:answer, isCorrect:correct})
                        }
                    }
                }
            }
            allData.DataFromTriviaGames = objectData;
            const stringedData = JSON.stringify(allData)
            try {
                fs.writeFileSync('./server/config/Data.json', stringedData);
            } catch (error) {
                console.error(error);
            }
            return correct;
        }
        return -1;
    }

    private static hasAlreadyAnswered(hashtag:string, answerNumber:number, author_id: string){
        const data = Data.DataFromTriviaGames;
        for(let game of data){
            if(game.name == hashtag) {
                for(let question of game.questions){
                    if(question.number == answerNumber){
                        for(let participant of question.participants){
                            if(participant.userId == author_id)
                                return true;
                        }
                    }
                }
            } 
        }
        return false;
    }
};