import { BadRequest } from '../config/Error';
import { IRequest, IResponse } from '../config/Express';
import Twitter from "./Twitter";
import { buildQ } from "../Utils/Utils";

export const searchTweetById: any = async(req: IRequest, res:IResponse) : Promise<void> => {

    const id: string = req.params.tweetId;
    const query = {id:id};

    Twitter.searchTweetById(query)
    .then(data => {
        res.send(data)
    }).catch(err => {
        throw new BadRequest('INCORRECT_BODY', `Il body non è corretto`)
    })
}
export const searchByKeyword: any = async(req: IRequest, res:IResponse) : Promise<void> => {
    const q = req.body.text ?? "";

    const optionalParams = {
      start_time: req.body.since ?? "",
      end_time: req.body.until ?? "",
      max_results: req.body.count ?? 15
    }

 
    const author = req.body.author ?? "";
    const remove: string = req.body.remove ?? "";

    const attitude: string = req.body.attitude ?? "";

    const query = buildQ({base_query: q, author:author, remove:remove.split(" ") ,attitude})

    Twitter.searchTweetsByKeyword(query, optionalParams)
    .then(data => {
        res.send(data)
    }).catch(err => {
        res.status(400).send({ error: 'INCORRECT_BODY', description: `Il body non è corretto` });
        //throw new BadRequest('INCORRECT_BODY', `Il body non è corretto`)
    })
}
export const searchTweetsByAuthor: any = async(req: IRequest, res:IResponse) : Promise<void> => {
    const count: string = req.body.count;
    const q = buildQ({author: req.body.author});
    const query: any = {q:q, count: count};

    Twitter.getUserInformations(query)
    .then(data => {
        res.send(data)
    }).catch(err => {
        throw new BadRequest('INCORRECT_BODY', `Il body non è corretto`)
    })
}
export const searchTweetsByLocation: any = async(req: IRequest, res:IResponse) : Promise<void> => {
    const radius = (req.body.radius/1000)+'km'
    const geocode = req.body.latitude + "," + req.body.longitude + "," + radius;
    const q = req.body.text ? req.body.text : "";
    const count = req.body.count ? req.body.count : 10;
    const query = {q:q, geocode: geocode, count: count};

    Twitter.searchTweetsByLocation(query)
    .then(data => {
        res.send(data)
    }).catch(err => {
        throw new BadRequest('INCORRECT_BODY', `Il body non è corretto`)
    })
}
export const searchTweetsByHashtag: any = async(req: IRequest, res:IResponse) : Promise<void> => {
    const count: string = req.body.count;
    const q = buildQ({hashtags: req.body.hashtags});
    const query: any = {q:q, count: count};

    Twitter.searchTweetsByHashtag(query)
    .then(data => {
        res.send(data)
    }).catch(err => {
        throw new BadRequest('INCORRECT_BODY', `Il body non è corretto`)
    })
}
export const getUserInformations: any = async(req: IRequest, res:IResponse) : Promise<void> => {
    const screen_name: string = req.body.username;
    const q = "";
    const query: any = {q:q, screen_name: screen_name};

    Twitter.getUserInformations(query)
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

    Twitter.getRetweetsByTweetId(query)
    .then((data:any) => {
        const users:any[] = [];
        for(let element of data.data){
            users.push(element.user)
        }
        res.send(users)
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
    let tweets = req.data.data.statuses;
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
