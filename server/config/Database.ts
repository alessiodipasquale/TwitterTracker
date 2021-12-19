import Config from './Config';
import Data from './Data.json'
import fs from 'fs';
import Socket from '../connection/Socket'
import type { StreamDefinition } from '../types/StreamDefinition'

export default abstract class Database {

    public static get streamDefinitions(): StreamDefinition[] {
        const objectArray = JSON.parse(JSON.stringify(Data.streamDefinitions));
        for (const elem of objectArray) {
            elem.startDate = new Date(elem.startDate);
            elem.startDate = new Date(elem.endDate)
        }
        return objectArray as StreamDefinition[];
    }

    public static set streamDefinitions(definitions: StreamDefinition[]) {
        let allData = Data;
        const objectData = JSON.parse(JSON.stringify({ streamDefinitions: definitions }));
        for (const elem of objectData) {
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

    public static newStreamDef(newStream: StreamDefinition) {
        let currentStreamDefs: StreamDefinition[] = Database.streamDefinitions;
        currentStreamDefs = currentStreamDefs.concat(newStream);
        switch (newStream.type) {
            case 'literaryContest': {
                const done = Database.newLiteraryContest(newStream);
                if (done)
                    Socket.broadcast('newLiteraryContestCreated', newStream)
                break;
            }
            case 'triviaGame': {
                const done = Database.newTriviaGame(newStream);
                if (done)
                    Socket.broadcast('newTriviaGameCreated', newStream)
                break;
            }
            case 'custom': {
                const done = Database.newCustomStream(newStream);
                if (done)
                    Socket.broadcast('newCustomStreamCreated', newStream)
                break;
            }
        }
        Database.streamDefinitions = currentStreamDefs;
    }

    public static deleteStreamDef(toDelete: string, type: string) {
        let currentStreamDefs: StreamDefinition[] = Database.streamDefinitions;
        currentStreamDefs = currentStreamDefs.filter((element) => {
            return element.name != toDelete
        })
        Database.streamDefinitions = currentStreamDefs;
        Database.deleteStreamData(toDelete, type);
    }

    public static deleteStreamData(toDelete: string, type: string) {
        let currentStreamData: any[] = [];
        if (type == 'triviaGame')
            currentStreamData = Database.triviaGamesData
        if (type == 'literaryContest')
            currentStreamData = Database.literaryContestsData

        currentStreamData = currentStreamData.filter((element) => {
            return element.name != toDelete
        })

        if (type == 'triviaGame')
            Database.triviaGamesData = currentStreamData;
        if (type == 'literaryContest')
            Database.literaryContestsData = currentStreamData;
    }

    public static get literaryContestsData() {
        return JSON.parse(JSON.stringify(Data.DataFromLiteraryContests));
    }

    public static get triviaGamesData() {
        return JSON.parse(JSON.stringify(Data.DataFromTriviaGames));
    }

    public static get customStreamsData() {
        return JSON.parse(JSON.stringify(Data.DataFromCustomStreams));
    }

    public static set literaryContestsData(newData: any[]) {
        let allData = Data;
        allData.DataFromLiteraryContests = newData;
        const stringedData = JSON.stringify(allData)
        try {
            fs.writeFileSync('./server/config/Data.json', stringedData);
        } catch (error) {
            console.error(error);
        }
    }

    public static set triviaGamesData(newData: any[]) {
        let allData = Data;
        allData.DataFromTriviaGames = newData
        const stringedData = JSON.stringify(allData)
        try {
            fs.writeFileSync('./server/config/Data.json', stringedData);
        } catch (error) {
            console.error(error);
        }
    }

    public static newLiteraryContest(newStream: StreamDefinition) {
        let allData = Data;
        const objectData = allData.DataFromLiteraryContests;
        objectData.push({ name: newStream.name, voters: [], books: [] });
        allData.DataFromLiteraryContests = objectData;
        const stringedData = JSON.stringify(allData)
        try {
            fs.writeFileSync('./server/config/Data.json', stringedData);
        } catch (error) {
            console.error(error);
        }
        return true;
    }

    public static newTriviaGame(newStream: StreamDefinition) {

        let allData = Data;
        const objectData = allData.DataFromTriviaGames;
        const buildedQuestions = [];
        for (let question of newStream.extras.questions) {
            let lowerCase = []
            for (let cAnswer of question.correctAnswers) {
                lowerCase.push(cAnswer.toLowerCase())
            }
            const obj = { number: question.number, text: question.text, correctAnswers: lowerCase, participants: [] }
            buildedQuestions.push(obj)
        }
        objectData.push({ name: newStream.name, questions: buildedQuestions });
        allData.DataFromTriviaGames = objectData;
        const stringedData = JSON.stringify(allData)
        try {
            fs.writeFileSync('./server/config/Data.json', stringedData);
        } catch (error) {
            console.error(error);
        }
        return true;
    }

    public static newCustomStream(newStream: StreamDefinition){
        let allData = Data;
        const objectData = allData.DataFromCustomStreams;
        objectData.push({name: newStream.name, totalCount: 0, username: newStream.extras.username, keyword:newStream.extras.keyword, tweets:[]})
        allData.DataFromCustomStreams = objectData;
        const stringedData = JSON.stringify(allData)
        try {
            fs.writeFileSync('./server/config/Data.json', stringedData);
        } catch (error) {
            console.error(error);
        }
        return true;
    }

    public static eventAlreadyPresent(name: string) {
        let data = Database.streamDefinitions;
        for (let elem of data) {
            if (elem.name == name)
                return true;
        }
        return false;
    }

    public static getTypeFromHashtag(hashtag: string) {
        const streamDefinitions = Database.streamDefinitions;
        for (let element of streamDefinitions) {
            if (element.name == hashtag) {
                return element.type;
            }
        }
        return "custom";
    }

    public static candidateNewBook(hashtag: string, name: string, author_id: string) {
        if (!Database.bookAlreadyPresent(hashtag, name)) {
            let allData = Data;
            const objectData = allData.DataFromLiteraryContests;
            for (let elem of objectData) {
                if (elem.name == hashtag) {
                    elem.books.push({ candidatedBy: author_id, bookName: name, votes: 0, votedBy: [] })
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

    private static bookAlreadyPresent(hashtag: string, name: string) {
        const data = Data.DataFromLiteraryContests;
        for (let contest of data) {
            if (contest.name == hashtag) {
                for (let book of contest.books) {
                    if (book.bookName.toLowerCase() == name.toLowerCase()) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    public static async voteBook(hashtag: string, name: string, author_id: string) {
        if (Database.bookAlreadyPresent(hashtag, name)) {
            if (!Database.reachedMaxVotes(hashtag, author_id) && !Database.hasVotedBook(hashtag, name, author_id)) {
                let allData = Data;
                const objectData = allData.DataFromLiteraryContests;
                for (let contest of objectData) {
                    if (contest.name == hashtag) {
                        //incrementare voto in voters
                        let found = false;
                        for (let voter of contest.voters) {
                            if (voter.author_id == author_id) {
                                found = true;
                                voter.numVotes = voter.numVotes + 1;
                            }
                        }
                        if (!found) {
                            contest.voters.push({ author_id, numVotes: 1 })
                        }
                        //aggiungere ai votanti e ai voti del libro
                        for (let book of contest.books) {
                            if (book.bookName.toLowerCase() == name.toLowerCase()) {
                                book.votes = book.votes + 1;
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
        } else {
            Database.candidateNewBook(hashtag, name, author_id)
            await Socket.broadcast("newCandidateInLiteraryContest",{contestName:hashtag, bookName:name, candidatedBy: author_id })
            Database.voteBook(hashtag, name, author_id)
            await Socket.broadcast("newVoteInLiteraryContest",{contestName:hashtag, bookName:name, votedBy: author_id })
        }
        return false;
    }

    private static reachedMaxVotes(hashtag: string, author_id: string) {
        const data = Data.DataFromLiteraryContests;
        for (let contest of data) {
            if (contest.name == hashtag) {
                for (let voter of contest.voters) {
                    if (voter.author_id == author_id && voter.numVotes == Config.maxVotes)
                        return true;
                }
            }
        }
        return false;
    }

    private static hasVotedBook(hashtag: string, name: string, author_id: string) {
        const data = Data.DataFromLiteraryContests;
        for (let contest of data) {
            if (contest.name == hashtag) {
                for (let book of contest.books) {
                    if (book.bookName.toLowerCase() == name.toLowerCase()) {
                        for (let voter of book.votedBy) {
                            if (voter == author_id)
                                return true;
                        }
                    }
                }
            }
        }
        return false;
    }

    public static registerAnswer(hashtag: string, answerNumber: number, answer: string, author_id: string, username: string) {
        if (!Database.hasAlreadyAnswered(hashtag, answerNumber, author_id)) {
            let allData = Data;
            const objectData = allData.DataFromTriviaGames;
            let correct;
            for (let game of objectData) {
                if (game.name == hashtag) {
                    for (let question of game.questions) {
                        if (question.number == answerNumber) {
                            correct = question.correctAnswers.includes(answer.toLowerCase())
                            question.participants.push({ username: username, userId: author_id, answeredTo: answerNumber, answer: answer, isCorrect: correct })
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

    private static hasAlreadyAnswered(hashtag: string, answerNumber: number, author_id: string) {
        const data = Data.DataFromTriviaGames;
        for (let game of data) {
            if (game.name == hashtag) {
                for (let question of game.questions) {
                    if (question.number == answerNumber) {
                        for (let participant of question.participants) {
                            if (participant.userId == author_id)
                                return true;
                        }
                    }
                }
            }
        }
        return false;
    }

    public static registerTweetInCustomStream(hashtag: string, tweetId: string, text: string, username: string){
        let allData = Data;
        const objectData = allData.DataFromCustomStreams;
        let shifted = false;
        let changed = false
        for(let element of objectData){
            if(element.name == hashtag && (element.username === "" || element.username === username)){
                element.totalCount = element.totalCount + 1;
                if(element.tweets.length >= Config.maxElementsFromCustomStream){
                    element.tweets.shift()
                    shifted = true;
                }
                changed = true;
                element.tweets.push({id:tweetId, text, username})
            }
        }
        if(!changed) return -1;
        allData.DataFromCustomStreams = objectData;
        const stringedData = JSON.stringify(allData)
        try {
            fs.writeFileSync('./server/config/Data.json', stringedData);
            return shifted;
        } catch (error) {
            console.error(error);
            return -1;
        }
    }

    public static retrieveHashtagByKeyword(kw: string){
        const data = Database.customStreamsData;
        for(let element of data){
            if(element.keyword == kw)
                return element.name;
        }
    }
}