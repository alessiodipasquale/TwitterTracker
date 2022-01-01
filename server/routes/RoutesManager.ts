import { BadRequest } from '../config/Error';
import { Stopwatch } from 'ts-stopwatch';
import { IRequest, IResponse } from '../config/Express';
import Twitter from "./Twitter";
import { buildQ, delay, formatData, translateAndGetSentiments } from "../utils/Utils";
import { Tweetv2SearchParams, TweetSearchAllV2Paginator } from 'twitter-api-v2';
import Database from '../config/Database';
import { StreamDefinition } from '../types/StreamDefinition'
import Config from '../config/Config';
import Sentiment from 'sentiment'

/**
 * Search a tweet by its id
 * @param req - Express standard request
 * @param res - Express standard response
 */

export const searchTweetById: any = async (req: IRequest, res: IResponse): Promise<void> => {
    const id: string = req.params.tweetId;
    Twitter.searchTweetById(id, {})
        .then(data => {
            res.send(data)
        }).catch(err => {
            throw new BadRequest('INCORRECT_BODY', `Il body non è corretto`)
        })
}

/**
 * Search a group of tweets by parameters present in a standard query
 * @param req - Express standard request
 * @param res - Express standard response
 */

export const searchByKeyword: any = async (req: IRequest, res: IResponse): Promise<void> => {
    const optionalParams: Partial<Tweetv2SearchParams> = {
        start_time: req.body.since,
        end_time: req.body.until,
        max_results: req.body.count ?? 15,
        expansions: Config.standardSearchOptions.expansions,
        'place.fields': Config.standardSearchOptions['place.fields'],
        'tweet.fields': Config.standardSearchOptions['tweet.fields'],
        'user.fields': Config.standardSearchOptions['user.fields']
    }

    const controlNumber: number = optionalParams.max_results! as number;
    if(controlNumber >100) optionalParams.max_results = 100;

    //'[lat lon raggioinkm]'
    const queryParams = {
        keywords: req.body.text ?? "",
        point_radius: req.body.geocode,
        from: req.body.author ?? "",
        exclude: (req.body.remove).split(" ") ?? "",
        attitude: req.body.attitude ?? "",
    }

    const queryOptions: Partial<Tweetv2SearchParams> | undefined = Object.fromEntries(Object.entries(optionalParams).filter(([_, v]) => v != null && v !== ""));
    const queryPath: string = buildQ(queryParams)

    const stopwatch = new Stopwatch()
    stopwatch.start();

    Twitter.searchTweetsByKeyword({ query: queryPath, options: queryOptions })
        .then(async (paginator: TweetSearchAllV2Paginator) => {

            if (controlNumber > 100) {
                const paginators = [];
                let tot = paginator.meta.result_count;
                const formattedData: any = {};
                formattedData.tweets = [];

                paginators.push(paginator);
                while (paginator.meta.next_token && tot<controlNumber) {
                    paginator = await paginator.fetchNext();
                    tot = paginator.meta.result_count;
                    paginators.push(paginator);
                    delay(500)
                }
                let count = 0;
                for (const elem of paginators) {
                    const data = formatData(elem.data);
                    for (const tweet of data) {
                        if(count <= controlNumber){
                            formattedData.tweets.push(tweet)
                            count = count+1;
                        }
                    }
                }
                if(tot > controlNumber) tot = controlNumber;
                formattedData.dataRetrievingTime = { time: stopwatch.getTime(), result_count: tot }
                res.send(formattedData)
            } else {
                const formattedData: any = {};
                formattedData.tweets = [];
                formattedData.tweets = formatData(paginator.data);
                formattedData.dataRetrievingTime = { time: stopwatch.getTime(), result_count: paginator.meta.result_count }
                res.send(formattedData)
            }

        })
        .catch(err => {
            console.log(err.stack)
            res.status(400).send({ error: 'INCORRECT_BODY', description: `Il body non è corretto` });
            // verificare se si può tenere throw new BadRequest('INCORRECT_BODY', `Il body non è corretto`)
        })
}

/**
 * Search an user by Id
 * @param req - Express standard request
 * @param res - Express standard response
 */

export const getUserInformations: any = async (req: IRequest, res: IResponse): Promise<void> => {
    const options = {}
    let query;
    if (req.body.id) {
        query = { id: req.body.id }
    } else {
        query = { username: req.body.username }
    }
    Twitter.getUserInformations({ query, options })
        .then(data => {
            res.send(data)
        }).catch(err => {
            throw new BadRequest('INCORRECT_BODY', `Il body non è corretto`)
        })
}
export const getRetweetsByTweetId: any = async (req: IRequest, res: IResponse): Promise<void> => {
    const options = {}
    const id: string = req.params.tweetId;
    const query = { id: id };
    console.log(query);
    Twitter.getRetweetsByTweetId({ query, options })
        .then(data => {
            res.send(data)
        }).catch(err => {
            throw new BadRequest('INCORRECT_BODY', `Il body non è corretto`)
        })
}

/**
 * Search retweets related to a specific tweet id
 * @param req - Express standard request
 * @param res - Express standard response
 */

export const getRetweetersByTweetId: any = async (req: IRequest, res: IResponse): Promise<void> => {
    const options = {}
    const id: string = req.params.tweetId;
    const query = { id: id };

    Twitter.getRetweetersByTweetId({ query, options })
        .then(data => {
            res.send(data)
        }).catch(err => {
            throw new BadRequest('INCORRECT_BODY', `Il body non è corretto`)
        })
}

/**
 * Perform a sentiment analysis on a specific tweet
 * @param req - Express standard request
 * @param res - Express standard response
 */

export const getSentimentFromTweet: any = async (req: IRequest, res: IResponse): Promise<void> => {
    const id: string = req.params.tweetId;

    Twitter.searchTweetById(id, {})
        .then(async (data) => {
            const result = await translateAndGetSentiments(data.data.text);
            res.send(result);
        }).catch(err => {
            throw new BadRequest('INCORRECT_BODY', `Il body non è corretto`)
        })
}

/**
 * Perform a sentiment analysis on a group of tweets
 * @param req - Express standard request
 * @param res - Express standard response
 */

export const getSentimentFromGroupOfTweets: any = async (req: IRequest, res: IResponse): Promise<void> => {
    const ids: string[] = [];
    let toAnalize = ""
    const tweets = req.body;
    for (const id of tweets) {
        await Twitter.searchTweetById(id, {}).then(data => {
                toAnalize = toAnalize.concat(" ").concat((data.data.text).toString());
            }).catch(err => {
                console.log(err)
                //throw new BadRequest('INCORRECT_BODY', `Il body non è corretto`)
            })
    }
    const toReturn: any = {};
    console.log(toAnalize)
    //const result = await translateAndGetSentiments(toAnalize);
        const sentiment = new Sentiment();
        const options: any = Config.sentimentAnalysisOptions;
        const result = sentiment.analyze(toAnalize, options);
    toReturn.result = result;
    toReturn.numTweets = ids.length;
    res.send(toReturn);
}

/**
 * Wrapper function that add an element to present streams
 * @param req - Express standard request
 * @param res - Express standard response
 */

export const addElementToStreamData = async (req: IRequest, res: IResponse) => {
    try {
        if(!Database.eventAlreadyPresent(req.body.streamDefinitions.name)) {
            Database.newStreamDef(req.body.streamDefinitions as StreamDefinition);
            Twitter.rulesConstruction(req.body.streamDefinitions, "add");
        }
        res.send();
    } catch (err) {
        throw new BadRequest('INCORRECT_BODY', `Il body non è corretto`)
    }
}

/**
 * Wrapper function that remove an element from present streams
 * @param req - Express standard request
 * @param res - Express standard response
 */

export const removeStreamElementFromData = async (req: IRequest, res: IResponse) => {
    try {
        if(Database.eventAlreadyPresent(req.body.streamName)){
            await Twitter.removeFromRules(req.body.streamName);
            Database.deleteStreamDef(req.body.streamName, req.body.type)
        }
        res.send();
    } catch (err) {
        //console.log(err)
        throw new BadRequest('INCORRECT_BODY', `Il body non è corretto`)
    }
}

/**
 * Function that set the user to follow in User Tracking feature
 * @param req - Express standard request
 * @param res - Express standard response
 */

export const startFollowingUser = async (req: IRequest, res: IResponse) => {
    try {
        if(Twitter.currentlyActive_v1){
            await Twitter.stopStream_v1();
        }
        const userId:string = await Twitter.findIdByUsername(req.body.follow);
        await Twitter.startStream_v1([userId])
        res.send();
    } catch (err) {
        //throw new BadRequest('INCORRECT_BODY', `Il body non è corretto`)
        res.status(400).send();
    }
}
