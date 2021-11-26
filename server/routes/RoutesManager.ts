import { BadRequest } from '../config/Error';
import { IRequest, IResponse } from '../config/Express';
import Twitter from "./Twitter";
import { buildQ, formatData } from "../Utils/Utils";
import { Tweetv2SearchParams } from 'twitter-api-v2';

export const searchTweetById: any = async(req: IRequest, res:IResponse) : Promise<void> => {
    const id: string = req.params.tweetId;
    Twitter.searchTweetById(id)
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
      expansions: [
        "geo.place_id",
        "author_id"
      ],
      'place.fields':[
            "contained_within", 
            "country", 
            "country_code", 
            "full_name", 
            "geo", 
            "id", 
            "name", 
            "place_type"
        ],
        'tweet.fields':[
            "attachments", 
            "author_id", 
            "context_annotations", 
            "conversation_id", 
            "created_at", 
            "entities", 
            "geo", 
            "id", 
            "in_reply_to_user_id", 
            "lang", 
            "public_metrics",
            "possibly_sensitive", 
            "referenced_tweets", 
            "reply_settings", 
            "source", 
            "text",
            "withheld"
        ],
        'user.fields': [
            "name",
            "username",
            "profile_image_url",
            "verified",
            "description"
        ],
    }

    //'[lat lon raggioinkm]'
    const queryParams = { 
        keywords: req.body.text ?? "",
        point_radius: req.body.geocode,
        from: req.body.author ?? "",
        exclude: req.body.remove ?? "",
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
    const id: string = req.params.tweetId;
    const count = 10;
    const query = {id:id, count:count};
    Twitter.getRetweetsByTweetId(query)
    .then(data => {
        res.send(data)
    }).catch(err => {
        throw new BadRequest('INCORRECT_BODY', `Il body non è corretto`)
    })
}
export const getRetweetersByTweetId: any = async(req: IRequest, res:IResponse) : Promise<void> => {
    const id: string = req.params.tweetId;
    const count = 10;
    const query = {id:id, count:count};

    Twitter.getRetweetersByTweetId(query)
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
