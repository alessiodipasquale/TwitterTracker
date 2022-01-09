import Axios from "axios";

/**
 * Standard definition for http post requests used in this project
 * @param {*} url 
 * @param {*} body 
 * @returns http response object
 */

export const httpPost = (url,body) => {
    // console.log(process.env)
    const ENDPOINT=process.env.REACT_APP_ENDPOINT;
    return Axios.post(ENDPOINT+url, body);
}

/**
 * Standard definition for http get requests used in this project
 * @param {*} url 
 * @param {*} body 
 * @returns http response object
 */

export const httpGet = (url,body) => {
    // console.log(process.env)
    const ENDPOINT =process.env.REACT_APP_ENDPOINT;
    return Axios.get(ENDPOINT+url, body);
}
