import { httpPost } from "./http-service"

export const createContest = (contest) => {
    return httpPost("addElementToStreamData", {streamDefinitions: contest});
}
