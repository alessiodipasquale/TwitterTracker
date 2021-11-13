import { httpGet } from "./http-service";

export const getSentimentFromTweet = (tweetId) => {
    return httpGet("getSentimentFromTweet/"+tweetId);
}