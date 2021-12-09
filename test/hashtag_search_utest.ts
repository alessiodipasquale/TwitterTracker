import Twitter from "../server/routes/Twitter";
import {expect} from 'chai';
import { delay } from "../server/Utils/Utils";

Twitter.authentication();

describe('Tweet Search By Hashtags utests', () => {
    var hashtags = ['#vcMsa4GxBaV4PuHsbaBY'];
    var query = "#vcMsa4GxBaV4PuHsbaBYX6VMSCvqwVQQJtTJ8b7zbDdQHLSJLkjm26Jvy4KUQbmqeQKcRGpSVcjuP3NbXWnADGUNBfj33f38WCVD";

    const options = {
        max_results: 10
    }
    
    describe('#IncludeHashtag', () => {
      it('should contain the hashtag in the tweet entities', async function() {
        await delay(500);
        let paginator = await Twitter.searchTweetsByKeyword({query, options})
        
        for(let tweet of paginator.data.data){
          expect(tweet.text).to.include(hashtags[0]);
        }
        /*expect(paginator.data.data.every(tweet => 
            //hashtags.some(hashtag => tweet.text.toLocaleLowerCase().includes(hashtag.toLocaleLowerCase()))
        )).to.be.true;*/
      });
    });
});