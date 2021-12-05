import { BadRequest } from '../config/Error';
import { IRequest, IResponse } from '../config/Express';
import Twitter from "./Twitter";
import { buildQ, formatData } from "../Utils/Utils";
import { Tweetv2SearchParams } from 'twitter-api-v2';
import Database from '../config/Database';
import { StreamDefinition } from '../types/StreamDefinition'
import Config from '../config/Config';
import Socket from '../connection/Socket';

export const searchTweetById: any = async(req: IRequest, res:IResponse) : Promise<void> => {
    const id: string = req.params.tweetId;
    Twitter.searchTweetById(id,{})
    .then(data => {
        res.send(data)
    }).catch(err => {
        throw new BadRequest('INCORRECT_BODY', `Il body non è corretto`)
    })
}

export const searchByKeyword: any = async(req: IRequest, res:IResponse) : Promise<void> => {
    const optionalParams : Partial<Tweetv2SearchParams> = {
        start_time: req.body.since,
        end_time: req.body.until,
        max_results: req.body.count ?? 15,
        expansions: Config.standardSearchOptions.expansions,
        'place.fields':Config.standardSearchOptions['place.fields'],
        'tweet.fields':Config.standardSearchOptions['tweet.fields'],
        'user.fields': Config.standardSearchOptions['user.fields']
    }

    //'[lat lon raggioinkm]'
    const queryParams = { 
        keywords: req.body.text ?? "",
        point_radius: req.body.geocode,
        from: req.body.author ?? "",
        exclude: (req.body.remove).split(" ") ?? "",
        attitude: req.body.attitude ?? "",
    }
    
    let queryOptions : Partial<Tweetv2SearchParams> | undefined = Object.fromEntries(Object.entries(optionalParams).filter(([_, v]) => v != null && v !==""));
    let queryPath: string = buildQ(queryParams)

    Twitter.searchTweetsByKeyword({query: queryPath, options: queryOptions})
    .then(paginator => {
        const formattedData = formatData(paginator.data);
        res.send(formattedData)
    })
    .catch(err => {
        console.log(err.stack)
        res.status(400).send({ error: 'INCORRECT_BODY', description: `Il body non è corretto` });
        //throw new BadRequest('INCORRECT_BODY', `Il body non è corretto`)
    })
}

export const getUserInformations: any = async(req: IRequest, res:IResponse) : Promise<void> => {
    const options = {}
    var query;
    if(req.body.id){
        query = { id: req.body.id}
    }else{
        query = { username: req.body.username }
    }
    Twitter.getUserInformations({query,options})
    .then(data => {
        res.send(data)
    }).catch(err => {
        throw new BadRequest('INCORRECT_BODY', `Il body non è corretto`)
    })
}
export const getRetweetsByTweetId: any = async(req: IRequest, res:IResponse) : Promise<void> => {
    const options = {}
    const id: string = req.params.tweetId;
    const query = {id:id};
    console.log(query);
    Twitter.getRetweetsByTweetId({query, options})
    .then(data => {
        res.send(data)
    }).catch(err => {
        throw new BadRequest('INCORRECT_BODY', `Il body non è corretto`)
    })
}
export const getRetweetersByTweetId: any = async(req: IRequest, res:IResponse) : Promise<void> => {
    const options = {}
    const id: string = req.params.tweetId;
    const query = {id:id};

    Twitter.getRetweetersByTweetId({query, options})
    .then(data => {
        res.send(data)
    }).catch(err => {
        throw new BadRequest('INCORRECT_BODY', `Il body non è corretto`)
    })
}
export const getSentimentFromTweet: any = async(req: IRequest, res:IResponse) : Promise<void> => {
    const id: string = req.params.tweetId;
    const query = {id:id};

    Twitter.getSentimentFromTweet(query)
    .then(data => {
        res.send(data);
    }).catch(err => {
        throw new BadRequest('INCORRECT_BODY', `Il body non è corretto`)
    })
}

export const getSentimentFromGroupOfTweets: any = async(req: IRequest, res:IResponse) : Promise<void> => {
    let ids: string[] = [];
    let analysis: any[] = [];
    let tweets = req.data.data;
    for(let t of tweets){
        ids.push(t.id_str);
    }
    for(let id of ids){
        const query = {id:id};
        Twitter.getSentimentFromTweet(query)
        .then(data => {
            analysis.push(data);
        }).catch(err => {
            throw new BadRequest('INCORRECT_BODY', `Il body non è corretto`)
        })
    }
    let value = 0;
    let positive = [];
    let negative = [];
    for(let element of analysis){
        value += element.score;
        for(let goodElem of element.positive){
            positive.push(goodElem);
        }
        for(let badElem of element.negative){
            negative.push(badElem);
        }
    }
    let toReturn = {value, positive, negative};
    res.send(toReturn);
}

export const addElementToStreamData = (req: IRequest, res:IResponse) => {
    try{
        let currentStreamDefs: StreamDefinition[] = (Database.streamDefinitions) as StreamDefinition[];
        const newStream = req.body.streamDefinitions as StreamDefinition;
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
        res.send();
    }catch(err){
        throw new BadRequest('INCORRECT_BODY', `Il body non è corretto`)
    }
}


export const removeStreamElementFromData = (req: IRequest, res:IResponse) => {
    try{
        let currentStreamDefs: StreamDefinition[] = (Database.streamDefinitions) as StreamDefinition[];
        const toDelete :string = req.params.streamName;
        currentStreamDefs.filter((element)=>{
            element.name != toDelete
        })
        Database.streamDefinitions = currentStreamDefs;
        if(false){
            //implement data removing?
        }
        res.send();
    }catch(err){
        throw new BadRequest('INCORRECT_BODY', `Il body non è corretto`)
    }
}