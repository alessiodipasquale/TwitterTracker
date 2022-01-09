import { httpPost } from "./http-service"

/**
 * Filtered research for tweets
 * @param {*} text 
 * @param {*} count 
 * @param {*} author 
 * @param {*} remove 
 * @param {*} since 
 * @param {*} until 
 * @param {*} geocode 
 * @returns http response object
 */

export const searchTweet = (text, count, author, remove, since, until, geocode) => {
    return httpPost("searchTweetsByKeyword", { text, count, author, remove, since, until, geocode })
}