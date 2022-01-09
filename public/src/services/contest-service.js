import { httpPost } from "./http-service"

/**
 * Service for contest creation
 * @param {*} contest contest options
 * @returns http request object
 */

export const createContest = (contest) => {
    return httpPost("addElementToStreamData", {streamDefinitions: contest});
}

/**
 * Service for trivia creation
 * @param {*} trivia trivia options
 * @returns http request object
 */

export const createTrivia = (trivia) => {
    return httpPost("addElementToStreamData", {streamDefinitions: trivia});
}

/**
 * Service for custom streams creation
 * @param {*} custom custom options
 * @returns http request object
 */

export const createCustom = (custom) => {
    return httpPost("addElementToStreamData", {streamDefinitions: custom});
}

/**
 * Service for contest deletion
 * @param {*} contestName contest to delete
 * @returns http request object
 */

export const deleteContest = (contestName) => {
    return httpPost("removeStreamElementFromData", {streamName:contestName, type:"literaryContest"})
}

/**
 * Service for trivia deletion
 * @param {*} contestName trivia to delete
 * @returns http request object
 */

export const deleteTrivia = (contestName) => {
    return httpPost("removeStreamElementFromData", {streamName:contestName, type:"triviaGame"})
}

/**
 * Service for custom stream deletion
 * @param {*} contestName custom stream to delete
 * @returns http request object
 */

export const deleteCustom = (contestName) => {
    return httpPost("removeStreamElementFromData", {streamName:contestName, type:"custom"})
}