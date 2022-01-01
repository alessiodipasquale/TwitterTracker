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

export const deleteContest = (contestName) => {
    return httpPost("removeStreamElementFromData", {streamName:contestName, type:"literaryContest"})
}

export const deleteTrivia = (contestName) => {
    return httpPost("removeStreamElementFromData", {streamName:contestName, type:"triviaGame"})
}

export const deleteCustom = (contestName) => {
    return httpPost("removeStreamElementFromData", {streamName:contestName, type:"custom"})
}