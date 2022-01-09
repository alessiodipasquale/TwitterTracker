import { httpGet, httpPost } from "./http-service";

/**
 * Sentiment analysis for a single tweet
 * @param {*} tweets 
 * @returns http response object
 */

export const getSentimentFromTweet = (tweetId) => {
    return httpGet("getSentimentFromTweet/"+tweetId);
}

/**
 * Sentiment analysis for a group of tweets passed
 * @param {*} tweets 
 * @returns http response object
 */

export const getSentimentFromGroupOfTweets = (tweets) => {
    return httpPost("getSentimentFromGroupOfTweets/", tweets);
}