import { httpPost } from "./http-service"

export const createContest = (contest) => {
    return httpPost("addElementToStreamData", {streamDefinitions: contest});
}

export const createTrivia = (trivia) => {
    return httpPost("addElementToStreamData", {streamDefinitions: trivia});
}

export const createCustom = (custom) => {
    return httpPost("addElementToStreamData", {streamDefinitions: custom});
}