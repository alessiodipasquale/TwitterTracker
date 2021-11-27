import Twitter from "./Twitter";
import {TweetV2SingleStreamResult } from 'twitter-api-v2';

export async function tweetEventHandler(eventData: TweetV2SingleStreamResult) {
    for (var i in eventData.matching_rules) {
        console.log(eventData)
        let matching_rule = eventData.matching_rules[i];

        if (matching_rule.tag == "voto") {

          console.log("ricevuto un voto")

        } else if (matching_rule.tag == "candidatura") {

          console.log("ricevuta candidatura")

        }
    }
}