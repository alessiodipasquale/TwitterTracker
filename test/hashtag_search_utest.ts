import Twitter from "../server/routes/Twitter";
import {expect} from 'chai';
import { delay } from "../server/Utils/Utils";

Twitter.init();

describe('Tweet Search By Hashtags utests', () => {
    var hashtags = ['#vcMsa4GxBaV4PuHsbaBYX6VMSCvqwVQQJtTJ8b7zbDdQHLSJLkjm26Jvy4KUQbmqeQKcRGpSVcjuP3NbXWnADGUNBfj33f38WCVD'];
    var query = "#vcMsa4GxBaV4PuHsbaBYX6VMSCvqwVQQJtTJ8b7zbDdQHLSJLkjm26Jvy4KUQbmqeQKcRGpSVcjuP3NbXWnADGUNBfj33f38WCVD";

    const options = {
        max_results: 10
    }

    describe('#IncludeHashtag', () => {
      it('should contain the hashtag in the tweet entities', async function() {
        
        let paginator = await Twitter.searchTweetsByKeyword({query, options})
        
        console.log(paginator)

        expect(paginator.tweets.every(tweet => 
            hashtags.some(hashtag => tweet.text.toLocaleLowerCase().includes(hashtag.toLocaleLowerCase()))
        )).to.be.true;
      });
    });
})


            // let res: any = JSON.parse(JSON.stringify(data));
            // for (var i = 0; i < res.data.statuses.length; i++) {
            //     var tweet = res.data.statuses[i];
            //     tweet.text = tweet.text.toUpperCase()
            //     for(var j = 0; j<tweet.entities.hashtags.length; j++){
            //         tweet.entities.hashtags[j].text = (tweet.entities.hashtags[j].text).toUpperCase();
            //     }
            //     expect(tweet).to.satisfy(function(tweet: any){
            //         if(tweet.text.includes(hashtags[0]) || tweet.entities.hashtags.includes(hashtags[0])) return true;
            //         else return false
            //     });
