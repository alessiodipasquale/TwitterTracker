import {httpGet} from './http-service'
export const getRetweetsByTweetId = (tweetId) => {
    return httpGet("getRetweets/"+tweetId);
}

export const getRetweetersByTweetId = (tweetId) => {
    return httpGet("getRetweeters/"+tweetId);
}