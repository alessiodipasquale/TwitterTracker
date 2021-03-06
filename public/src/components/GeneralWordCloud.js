/**
 * File that contains definition and style for general wordclouds
 */

import { useState, useEffect } from 'react';

import WordCloud from 'react-d3-cloud';

/**
 * Function that returns a general word cloud based on input tweets
 * @param {*} param0 tweets
 * @returns HTML containing wordcloud
 */

function GeneralWordClout({tweets}) {

  const [wordCloudData, setWordCloudData] = useState([]);

  function wordFreq(string) {
    var words = string.replace(/[.]/g, '').split(/\s/);

    var freqMap = {};
    var res = [];
    words.forEach(function(w) {
        if (!freqMap[w]) {
            freqMap[w] = {index: res.length};
            res.push({text: w, value: 0})
        }
        res[freqMap[w].index].value += 1;
    });

    freqMap = {};
    return res;
  }

  useEffect(() => {

    const wordF = wordFreq(tweets.map(tweet => tweet.text.toLowerCase()).join(" "));
    wordF.sort((v1, v2) => {return v1.value - v2.value});

    setWordCloudData(wordF.slice(wordF.length - 30, wordF.length));

    return () => setWordCloudData([]);

  }, []);

  return (
    <>
    <WordCloud
      data={wordCloudData}
      fontSize={(word) => ((word.value / 40) + 2) * 15} //old version: (word.value * 3 + 30) % 30}
      onWordClick={(event, d) => {
        console.log(`onWordClick: ${d.text}`);
        if(d.text.startsWith('http')){
          const newWindow = window.open(d.text, '_blank', 'noopener,noreferrer');
          if (newWindow) newWindow.opener = null;
        }else{
          if(d.text.startsWith('#')){
            const substr = d.text.substring(1);
            const newWindow = window.open(`https://www.google.com/search?q=${substr}`, '_blank', 'noopener,noreferrer');
            if (newWindow) newWindow.opener = null;
          }else{
            const newWindow = window.open(`https://www.google.com/search?q=${d.text}`, '_blank', 'noopener,noreferrer');
            if (newWindow) newWindow.opener = null;
          }
        }
      }}
      />

    </>
  );

}

export default GeneralWordClout;
