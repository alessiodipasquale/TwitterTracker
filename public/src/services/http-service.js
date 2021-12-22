import Axios from "axios";

export const httpPost = (url,body) => {
    // console.log(process.env)
    const ENDPOINT=process.env.REACT_APP_ENDPOINT;
    return Axios.post(ENDPOINT+url, body);
}

export const httpGet = (url,body) => {
    // console.log(process.env)
    const ENDPOINT =process.env.REACT_APP_ENDPOINT;
    return Axios.get(ENDPOINT+url, body);
}
