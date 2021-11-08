import Axios from "axios";

export const httpPost = (url,body) => {
    const ENDPOINT="http://localhost:3000/";
    return Axios.post(ENDPOINT+url, body);
}

export const httpGet = (url,body) => {
    const ENDPOINT ="http://localhost:3000/";
    return Axios.get(ENDPOINT+url, body);
}