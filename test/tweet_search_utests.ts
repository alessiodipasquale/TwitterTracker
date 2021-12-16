import Twitter from "../server/routes/Twitter";
import {expect} from 'chai';
import { delay } from "../server/utils/Utils"

Twitter.authentication();

describe('Tweet Search By Keyword utests', () => {
	const query = { query: 'hi', options: { max_results: 50 } }
	const id: string = "1454832552271884290";

	describe('#NonEmptySearch', () => {
		it('should find at least some tweets', async function() {
			/* expects to find some tweets */
			
			await Twitter.searchTweetsByKeyword(query)
				.then(paginator => {
					expect(paginator.data).not.to.be.empty;
				});
		});
	});

	describe('#SimpleQuery', () => {
		it('should have a non-empty body', async function() {
			/* expects to find some text */
			await delay(500);
			await Twitter.searchTweetsByKeyword(query)
				.then(paginator => {
					for (let tweet of paginator.data.data) {
						expect(tweet.text).not.to.be.empty;
					}
				});
		});
	});

	describe('#SearchById', () => {
		it('should find a specific tweet', async function() {
			await Twitter.searchTweetById(id,{})
				.then(paginator => {
					expect(paginator.data.id).to.equal(id);
				});
		});
	});
	
});
