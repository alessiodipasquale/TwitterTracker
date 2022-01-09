import {httpGet} from './http-service'

/**
 * Request that returns retweets based on a single tweet
 * @param {*} tweetId 
 * @returns http response object
 */

export const getRetweetsByTweetId = (tweetId) => {
    return httpGet("getRetweets/"+tweetId);
}

/**
 * Request that returns retweeters based on a single tweet
 * @param {*} tweetId 
 * @returns http response object
 */

export const getRetweetersByTweetId = (tweetId) => {
    return httpGet("getRetweeters/"+tweetId);
}