import { httpPost } from "./http-service"

export const getTweetsByLocation = (latitude, longitude, radius, text, count) => {  
    return httpPost("searchTweetsByLocation",{latitude,longitude,radius, text, count })
}