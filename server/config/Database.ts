import Config from './Config';
import Data from './Data.json'
import fs from 'fs';
import Socket from '../connection/Socket'
import type { StreamDefinition } from '../types/StreamDefinition'

/**
 * Class that manage writing and reading from a json database, "Data.json"
 */

export default abstract class Database {

    /**
     * Attribute that change database path based on production/developement phase 
     */

    private static production = true;

    /**
     * Getter method
     * @returns All the streams active and present in the database
     */

    public static get streamDefinitions(): StreamDefinition[] {
        const objectArray = JSON.parse(JSON.stringify(Data.streamDefinitions));
        for (const elem of objectArray) {
            elem.startDate = new Date(elem.startDate);
            elem.startDate = new Date(elem.endDate)
        }
        return objectArray as StreamDefinition[];
    }

    /**
     * Setter method
     * @param definitions - Is the new value to substitute streamDefinitions in database
     */

    public static set streamDefinitions(definitions: StreamDefinition[]) {
        const allData = Data;
        const objectData = JSON.parse(JSON.stringify({ streamDefinitions: definitions }));
        for (const elem of objectData) {
            elem.startDate = new Date(elem.startDate).toISOString().substring(0, 10);
            elem.endDate = new Date(elem.endDate).toISOString().substring(0, 10);
        }
        allData.streamDefinitions = objectData.streamDefinitions;
        const stringedData = JSON.stringify(allData)
        try {
            if (Database.production) {
                fs.writeFileSync(Config.productionDatabasePath, stringedData);
            } else fs.writeFileSync(Config.devDatabasePath, stringedData);

        } catch (error) {
            console.error(error);
        }
    }

    /**
     * Creation of a new stream
     * @param newStream - Is the value for the new stream created
     */

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

    /**
     * Deletion of a stream
     * @param toDelete - Is the name of the stream to delete
     * @param type - Is the type of the stream
     */

    public static deleteStreamDef(toDelete: string, type: string) {
        let currentStreamDefs: StreamDefinition[] = Database.streamDefinitions;
        currentStreamDefs = currentStreamDefs.filter((element) => {
            return element.name != toDelete
        })
        Database.streamDefinitions = currentStreamDefs;
        Database.deleteStreamData(toDelete, type);
    }

    /**
     * Deletion of data related to a stream
     * @param toDelete - Is the name of the stream whose data we want to delete
     * @param type - Is the type of the stream
     */

    public static deleteStreamData(toDelete: string, type: string) {
        let currentStreamData: any[] = [];
        if (type == 'triviaGame')
            currentStreamData = Database.triviaGamesData
        if (type == 'literaryContest')
            currentStreamData = Database.literaryContestsData
        if (type == 'custom')
            currentStreamData = Database.customStreamsData

        currentStreamData = currentStreamData.filter((element) => {
            return element.name != toDelete
        })

        if (type == 'triviaGame')
            Database.triviaGamesData = currentStreamData;
        if (type == 'literaryContest')
            Database.literaryContestsData = currentStreamData;
        if (type == 'custom')
            Database.customStreamsData = currentStreamData;
    }

    /**
     * Getter method
     * @returns Data from literary contests currenctly active
     */

    public static get literaryContestsData() {
        return JSON.parse(JSON.stringify(Data.DataFromLiteraryContests));
    }

    /**
     * Setter method
     * @param newData - Data that substitute current data present in database related to literary contests
     */

    public static set literaryContestsData(newData: any[]) {
        const allData = Data;
        allData.DataFromLiteraryContests = newData;
        const stringedData = JSON.stringify(allData)
        try {
            if (Database.production) {
                fs.writeFileSync(Config.productionDatabasePath, stringedData);
            } else fs.writeFileSync(Config.devDatabasePath, stringedData);

        } catch (error) {
            console.error(error);
        }
    }

    /**
     * Getter method
     * @returns Data from trivia games currenctly active
     */

    public static get triviaGamesData() {
        return JSON.parse(JSON.stringify(Data.DataFromTriviaGames));
    }

    /**
     * Setter method
     * @param newData Data that substitute current data present in database related to trivia games
     */

    public static set triviaGamesData(newData: any[]) {
        const allData = Data;
        allData.DataFromTriviaGames = newData
        const stringedData = JSON.stringify(allData)
        try {
            if (Database.production) {
                fs.writeFileSync(Config.productionDatabasePath, stringedData);
            } else fs.writeFileSync(Config.devDatabasePath, stringedData);

        } catch (error) {
            console.error(error);
        }
    }

    /**
     * Getter method
     * @returns Data from custom streams currenctly active
     */

    public static get customStreamsData() {
        return JSON.parse(JSON.stringify(Data.DataFromCustomStreams));
    }

    /**
     * Setter method
     * @param newData - Data that substitute current data present in database related to custom streams
     */

    public static set customStreamsData(newData: any[]) {
        const allData = Data;
        allData.DataFromCustomStreams = newData
        const stringedData = JSON.stringify(allData)
        try {
            if (Database.production) {
                fs.writeFileSync(Config.productionDatabasePath, stringedData);
            } else fs.writeFileSync(Config.devDatabasePath, stringedData);

        } catch (error) {
            console.error(error);
        }
    }

    /**
     * Initialize data from a new literary contest
     * @param newStream - Informations needed for data initialization
     */

    public static newLiteraryContest(newStream: StreamDefinition) {
        const allData = Data;
        const objectData = allData.DataFromLiteraryContests;
        objectData.push({ name: newStream.name, voters: [], books: [] });
        allData.DataFromLiteraryContests = objectData;
        const stringedData = JSON.stringify(allData)
        try {
            if (Database.production) {
                fs.writeFileSync(Config.productionDatabasePath, stringedData);
            } else fs.writeFileSync(Config.devDatabasePath, stringedData);

        } catch (error) {
            console.error(error);
        }
        return true;
    }

    /**
     * Initialize data from a new trivia game
     * @param newStream - Informations needed for data initialization
     */

    public static newTriviaGame(newStream: StreamDefinition) {

        const allData = Data;
        const objectData = allData.DataFromTriviaGames;
        const buildedQuestions = [];
        for (const question of newStream.extras.questions) {
            const lowerCase = []
            for (const cAnswer of question.correctAnswers) {
                lowerCase.push(cAnswer.toLowerCase())
            }
            const obj = { number: question.number, text: question.text, correctAnswers: lowerCase, participants: [] }
            buildedQuestions.push(obj)
        }
        objectData.push({ name: newStream.name, questions: buildedQuestions });
        allData.DataFromTriviaGames = objectData;
        const stringedData = JSON.stringify(allData)
        try {
            if (Database.production) {
                fs.writeFileSync(Config.productionDatabasePath, stringedData);
            } else fs.writeFileSync(Config.devDatabasePath, stringedData);

        } catch (error) {
            console.error(error);
        }
        return true;
    }

    /**
     * Initialize data from a new custom stream
     * @param newStream - Informations needed for data initialization
     */

    public static newCustomStream(newStream: StreamDefinition) {
        const allData = Data;
        const objectData = allData.DataFromCustomStreams;
        objectData.push({ name: newStream.name, totalCount: 0, username: newStream.extras.username, keyword: newStream.extras.keyword, tweets: [] })
        allData.DataFromCustomStreams = objectData;
        const stringedData = JSON.stringify(allData)
        try {
            if (Database.production) {
                fs.writeFileSync(Config.productionDatabasePath, stringedData);
            } else fs.writeFileSync(Config.devDatabasePath, stringedData);

        } catch (error) {
            console.error(error);
        }
        return true;
    }

    /**
     * Assessment function that control if the event is already present in database
     * @param name - Name of the event to find
     */

    public static eventAlreadyPresent(name: string) {
        const data = Database.streamDefinitions;
        for (const elem of data) {
            if (elem.name == name)
                return true;
        }
        return false;
    }

    /**
     * Utility function to retrieve type of a stream from its hashtag
     * @param hashtag - Name of the event to find
     */

    public static getTypeFromHashtag(hashtag: string) {
        const streamDefinitions = Database.streamDefinitions;
        for (const element of streamDefinitions) {
            if (element.name == hashtag) {
                return element.type;
            }
        }
        return "custom";
    }

    /**
     * New book candidation
     * @param hashtag - Name of the event
     * @param name - Name of the book
     * @param author_id - Id of the author of the Tweet
     */

    public static candidateNewBook(hashtag: string, name: string, author_id: string) {
        if (!Database.bookAlreadyPresent(hashtag, name) && !Database.expired(hashtag)) {
            const allData = Data;
            const objectData = allData.DataFromLiteraryContests;
            for (const elem of objectData) {
                if (elem.name == hashtag) {
                    elem.books.push({ candidatedBy: author_id, bookName: name, votes: 0, votedBy: [] })
                }
            }
            allData.DataFromLiteraryContests = objectData;
            const stringedData = JSON.stringify(allData)
            try {
                if (Database.production) {
                    fs.writeFileSync(Config.productionDatabasePath, stringedData);
                } else fs.writeFileSync(Config.devDatabasePath, stringedData);

            } catch (error) {
                console.error(error);
            }
            return true;
        }
        return false;
    }

    /**
     * Assessment function that control if the book is already present in the contest
     * @param hashtag - Name of the event to find
     * @param name - Name of the book to find
     */

    private static bookAlreadyPresent(hashtag: string, name: string) {
        const data = Data.DataFromLiteraryContests;
        for (const contest of data) {
            if (contest.name == hashtag) {
                for (const book of contest.books) {
                    if (book.bookName.toLowerCase() == name.toLowerCase()) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    /**
     * New book votation
     * @param hashtag - Name of the event
     * @param name - Name of the book
     * @param author_id - Id of the author of the Tweet
     */

    public static async voteBook(hashtag: string, name: string, author_id: string) {
        if (Database.bookAlreadyPresent(hashtag, name) && !Database.expired(hashtag)) {
            if (!Database.reachedMaxVotes(hashtag, author_id) && !Database.hasVotedBook(hashtag, name, author_id)) {
                const allData = Data;
                const objectData = allData.DataFromLiteraryContests;
                for (const contest of objectData) {
                    if (contest.name == hashtag) {
                        //incrementare voto in voters
                        let found = false;
                        for (const voter of contest.voters) {
                            if (voter.author_id == author_id) {
                                found = true;
                                voter.numVotes = voter.numVotes + 1;
                            }
                        }
                        if (!found) {
                            contest.voters.push({ author_id, numVotes: 1 })
                        }
                        //aggiungere ai votanti e ai voti del libro
                        for (const book of contest.books) {
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
                    if (Database.production) {
                        fs.writeFileSync(Config.productionDatabasePath, stringedData);
                    } else fs.writeFileSync(Config.devDatabasePath, stringedData);

                } catch (error) {
                    console.error(error);
                }
                return true;
            }
        } else {
            Database.candidateNewBook(hashtag, name, author_id)
            await Socket.broadcast("newCandidateInLiteraryContest", { contestName: hashtag, bookName: name, candidatedBy: author_id })
            Database.voteBook(hashtag, name, author_id)
            await Socket.broadcast("newVoteInLiteraryContest", { contestName: hashtag, bookName: name, votedBy: author_id })
        }
        return false;
    }

    private static reachedMaxVotes(hashtag: string, author_id: string) {
        const data = Data.DataFromLiteraryContests;
        for (const contest of data) {
            if (contest.name == hashtag) {
                for (const voter of contest.voters) {
                    if (voter.author_id == author_id && voter.numVotes == Config.maxVotes)
                        return true;
                }
            }
        }
        return false;
    }

    /**
     * Assessment function that control if the book was already voted by a specific user
     * @param hashtag - Name of the event to find
     * @param name - Name of the book to find
     * @param author_id - Id of the user to find
     */

    private static hasVotedBook(hashtag: string, name: string, author_id: string) {
        const data = Data.DataFromLiteraryContests;
        for (const contest of data) {
            if (contest.name == hashtag) {
                for (const book of contest.books) {
                    if (book.bookName.toLowerCase() == name.toLowerCase()) {
                        for (const voter of book.votedBy) {
                            if (voter == author_id)
                                return true;
                        }
                    }
                }
            }
        }
        return false;
    }

    /**
     * New answer in a trivia game
     * @param hashtag - Name of the event
     * @param answerNumber - Number of the answer
     * @param answer - Value of the answer
     * @param author_id - Id of the author of the Tweet
     * @param username - Username of the author of the Tweet
     */

    public static registerAnswer(hashtag: string, answerNumber: number, answer: string, author_id: string, username: string) {
        if (!Database.hasAlreadyAnswered(hashtag, answerNumber, author_id) && !Database.expired(hashtag)) {
            const allData = Data;
            const objectData = allData.DataFromTriviaGames;
            let correct;
            for (const game of objectData) {
                if (game.name == hashtag) {
                    for (const question of game.questions) {
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
                if (Database.production) {
                    fs.writeFileSync(Config.productionDatabasePath, stringedData);
                } else fs.writeFileSync(Config.devDatabasePath, stringedData);

            } catch (error) {
                console.error(error);
            }
            return correct;
        }
        return -1;
    }

    /**
     * Assessment function that control if an user has already answered to a question
     * @param hashtag - Name of the event to find
     * @param answerNumber - Number of the answer
     * @param author_id - Id of the user to find
     */

    private static hasAlreadyAnswered(hashtag: string, answerNumber: number, author_id: string) {
        const data = Data.DataFromTriviaGames;
        for (const game of data) {
            if (game.name == hashtag) {
                for (const question of game.questions) {
                    if (question.number == answerNumber) {
                        for (const participant of question.participants) {
                            if (participant.userId == author_id)
                                return true;
                        }
                    }
                }
            }
        }
        return false;
    }

    /**
     * New Tweet related to a custom stream
     * @param hashtag - Name of the stream
     * @param tweetId - Id of the Tweet
     * @param text - Text of the Tweet
     * @param username - Username of the user that tweeted  
     */

    public static registerTweetInCustomStream(hashtag: string, tweetId: string, text: string, username: string) {
        if(!Database.expired(hashtag)){
            const allData = Data;
            const objectData = allData.DataFromCustomStreams;
            let shifted = false;
            let changed = false
            for (const element of objectData) {
                if (element.name == hashtag && (element.username === "" || element.username === username)) {
                    element.totalCount = element.totalCount + 1;
                    if (element.tweets.length >= Config.maxElementsFromCustomStream) {
                        element.tweets.shift()
                        shifted = true;
                    }
                    changed = true;
                    element.tweets.push({ id: tweetId, text, username })
                }
            }
            if (!changed) return -1;
            allData.DataFromCustomStreams = objectData;
            const stringedData = JSON.stringify(allData)
            try {
                if (Database.production) {
                    fs.writeFileSync(Config.productionDatabasePath, stringedData);
                } else fs.writeFileSync(Config.devDatabasePath, stringedData);

                return shifted;
            } catch (error) {
                console.error(error);
                return -1;
            }
        } else return -1;
    }

    /**
     * Function to retrieve an hashtag by a keyword in a custom stream
     * @param kw - keyword
     * @returns the name of the event
     */

    public static retrieveHashtagByKeyword(kw: string) {
        const data = Database.customStreamsData;
        for (const element of data) {
            if (element.keyword == kw)
                return element.name;
        }
    }

    /**
     * Function that control if passed stream is expired
     * @param hashtag - Name of the stream to find
     */

    private static expired(hashtag: string) {
        const today = new Date();
        let expired = true;
        const streams = Database.streamDefinitions;
        for (const stream of streams) {
            if (stream.name == hashtag) {
                if (today <= (new Date(stream.endDate)))
                    expired = false;
            }
        }
        return expired;
    }
}