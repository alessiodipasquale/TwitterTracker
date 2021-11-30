//import mongoose, { ConnectionOptions } from 'mongoose';
import Config from './Config';
import Data from './Data.json'
import fs from 'fs';
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

    public static get literaryContestsData(){
        let objectArray = JSON.parse(JSON.stringify(Data.DataFromLiteraryContests));
        return objectArray;
    }

    public static get triviaGamesData(){
        let objectArray = JSON.parse(JSON.stringify(Data.DataFromTriviaGames));
        return objectArray;
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
                    if(book.bookName == name){
                        return true;
                    }
                }
            } 
        }
        return false;
    }

    public static voteBook(hashtag:string, name:string, author_id:string){
        if(!Database.reachedMaxVotes(hashtag,author_id) && !Database.hasVotedBook(hashtag,name,author_id)){
            let allData = Data;
            const objectData = allData.DataFromLiteraryContests;
            for(let contest of objectData){
                //incrementare voto in voters
                let found = false;
                for(let voter of contest.voters){
                    if(voter.author_id == author_id){
                        found = true;
                        voter.numVotes = voter.numVotes+1;
                    }
                }
                //aggiungere ai votanti e ai voti del libro
                for(let book of contest.books){
                    book.votes = book.votes+1;
                    book.votedBy.push(author_id)
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
                    if(book.bookName == name){
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
};