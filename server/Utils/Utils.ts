import qParams from "./Interfaces/QueryParams";
import { Tweetv2TimelineResult, TweetV2SingleStreamResult } from 'twitter-api-v2';
import Config from "../config/Config";

/* Builds the q field */
export function buildQ(q: qParams): string {

    let query = q.keywords || "";

    q.from && (query += " from:" + q.from)

    q.exclude && q.exclude.forEach(element => {
      if (element)
        query = query.concat("-").concat(element).concat(" ")
    });

    q.point_radius && (query += " point_radius:" + q.point_radius)

    if (q.attitude) {
      query = query.concat(q.attitude).concat(" ");
    }

    return query;
  };

  export function delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
  }

  export function formatData(data: Tweetv2TimelineResult): any {
    let toReturn: any = data;

    if(data.includes){
      const fields = Config.FieldsFromStandardQuery;
      const stringData = JSON.stringify(data);
      const object = JSON.parse(stringData);
      for(let expectedField of fields){
        if(object.includes[expectedField.dataName]){
          for(let tweet of object.data){
            if(tweet[expectedField.matchingParam]) {
              let matchingParameter: string;
              if(expectedField.internalMatchingParam){
                const middleParam = tweet[expectedField.matchingParam]
                matchingParameter = middleParam[expectedField.internalMatchingParam]
              }else{
                matchingParameter = tweet[expectedField.matchingParam];
              }
              for(let element of object.includes[expectedField.dataName]){
                if (element.id == matchingParameter){
                  tweet[expectedField.newBodyName] = element;
                }
              }
            }
          }
        }
      }
      toReturn = object.data;
    }
    return toReturn;
  }

export async function tweetEventHandler(eventData: TweetV2SingleStreamResult) {

    for (var i in eventData.matching_rules) {
        let matching_rule = eventData.matching_rules[i];

        if (matching_rule.tag == "voto") {

          console.log("ricevuto un voto")

        } else if (matching_rule.tag == "candidatura") {

          console.log("ricevuta candidatura")

        }
    }
}
