import { httpGet, httpPost } from "./http-service";

export const getSentimentFromTweet = (tweetId) => {
    return httpGet("getSentimentFromTweet/"+tweetId);
}

export const getSentimentFromGroupOfTweets = (tweets) => {
    return httpPost("getSentimentFromGroupOfTweets/", tweets);
}