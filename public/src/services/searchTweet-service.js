import { httpPost } from "./http-service"

export const searchTweet = (text, count, author, remove, since, until) => {
    return httpPost("searchTweetsByKeyword", { text, count, author, remove, since, until })
}