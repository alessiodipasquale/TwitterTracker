import { httpPost } from "./http-service"

export const addContest = (hashtag, endDate, rules) => {

    let startDate = new Date();

    let bd = {
      streamDefinitions: {
        name: hashtag,
        type: "literaryContest",
        startDate: startDate.toISOString(),
        endDate: new Date(endDate).toISOString(),
        rules: rules
      }
    };

    return httpPost("addElementToStreamData", bd);
}
