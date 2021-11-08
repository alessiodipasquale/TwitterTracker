import Twitter from "../server/routes/Twitter";
import {expect} from 'chai';

Twitter.init();

describe('Tweet Search By Hashtags utests', () => {

    var hashtags: string[] = ['I MADE A TWEET WITH A SPECIFIC HASHTAG #VCMSA4GXBAV4PUHSBABYX6VMSCVQWVQQJTTJ8B7ZBDDQHLSJLKJM'];
    var count = 1;
    var q = "#vcMsa4GxBaV4PuHsbaBYX6VMSCvqwVQQJtTJ8b7zbDdQHLSJLkjm26Jvy4KUQbmqeQKcRGpSVcjuP3NbXWnADGUNBfj33f38WCVD";
    var query = {q: q, count:count};

    describe('#IncludeHashtag', () => {
      it('should contain the hashtag in the tweet entities', async function() {
        await Twitter.searchTweetsByHashtag(query).then(data => {

            let res: any = JSON.parse(JSON.stringify(data));
            for (var i = 0; i < res.data.statuses.length; i++) {
                var tweet = res.data.statuses[i];
                tweet.text = tweet.text.toUpperCase()
                for(var j = 0; j<tweet.entities.hashtags.length; j++){
                    tweet.entities.hashtags[j].text = (tweet.entities.hashtags[j].text).toUpperCase();
                }
                expect(tweet).to.satisfy(function(tweet: any){
                    if(tweet.text.includes(hashtags[0]) || tweet.entities.hashtags.includes(hashtags[0])) return true;
                    else return false
                });
            }
        });
      });
    });
});
