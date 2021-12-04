import { httpPost } from "./http-service"

export const searchTweet = (text, count, author, remove, since, until, geocode) => {
    return httpPost("searchTweetsByKeyword", { text, count, author, remove, since, until, geocode })
}