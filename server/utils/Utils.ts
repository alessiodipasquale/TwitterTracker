import queryParams from "./Interfaces/QueryParams";
import { Tweetv2TimelineResult } from 'twitter-api-v2';
import Config from "../config/Config";
import Sentiment from "sentiment";
import Translate from "@vitalets/google-translate-api";

/* Builds the q field */
export function buildQ(q: queryParams): string {

  let query = q.keywords+" " || "";

  q.from && (query += " from:" + q.from + " ")

  if (q.exclude) {
    q.exclude.forEach(element => {
      if (element)
        query = query.concat("-");
      query = query.concat(element).concat(" ")
    });
  }

  q.point_radius && (query += " point_radius:" + q.point_radius)

  if (q.attitude) {
    query = query.concat(q.attitude).concat(" ");
  }

  return query;
}

export function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function formatData(data: Tweetv2TimelineResult): any {
  let toReturn: any = data;

  if (data.includes) {
    const fields = Config.FieldsFromStandardQuery;
    const stringData = JSON.stringify(data);
    const object = JSON.parse(stringData);
    for (const expectedField of fields) {
      if (object.includes[expectedField.dataName]) {
        for (const tweet of object.data) {
          if (tweet[expectedField.matchingParam]) {
            let matchingParameter: string;
            if (expectedField.internalMatchingParam) {
              const middleParam = tweet[expectedField.matchingParam]
              matchingParameter = middleParam[expectedField.internalMatchingParam]
            } else {
              matchingParameter = tweet[expectedField.matchingParam];
            }
            for (const element of object.includes[expectedField.dataName]) {
              if (element.id == matchingParameter) {
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

export async function translateAndGetSentiments(inputText: string) {
  const sentiment = new Sentiment();
  const options: any = Config.sentimentAnalysisOptions;

  const translated: any = await Translate(String(inputText), { to: 'en' });
  const full_text: string = translated.text;

  const result = sentiment.analyze(full_text, options);
  const originalwords: string[] = [];
  for (const elem of result.words) {
    const orig: any = await Translate(String(elem), { from: 'en', to: translated.from.language.iso });
    if (inputText.toLowerCase().includes(orig.text.toLowerCase()) || inputText.toLowerCase().includes(orig.text.substring(0, orig.text.length - 1).toLowerCase()))
      originalwords.push(orig.text.toLowerCase());
  }
  result.words = originalwords;
  return result;
}
