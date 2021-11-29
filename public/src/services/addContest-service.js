import { httpPost } from "./http-service"

export const addContest = (hashtag, startDate, rules) => {

    let endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + 2);

    let bd = {
      streamDefinitions: {name: hashtag, startDate: startDate, endDate: endDate.toISOString(), rules: rules}
    };

    return httpPost("addElementToStreamData", bd);
}
