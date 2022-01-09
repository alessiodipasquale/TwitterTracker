import { httpPost } from "./http-service"

/**
 * Request for geographic service
 * @param {*} latitude 
 * @param {*} longitude 
 * @param {*} radius 
 * @param {*} text 
 * @param {*} count 
 * @returns Geolocalized tweets
 */

export const getTweetsByLocation = (latitude, longitude, radius, text, count) => {  
    return httpPost("searchTweetsByLocation",{latitude,longitude,radius, text, count })
}