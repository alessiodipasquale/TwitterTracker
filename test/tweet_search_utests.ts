import Twitter from "../server/routes/Twitter";
import {expect} from 'chai';

Twitter.init();

describe('Tweet Search By Keyword utests', () => {
	const query = { q: "I made a tweet.", count: 10 };
	const id: string = "1454832552271884290";
	const idQuery = { id:id }; 

	describe('#NonEmptySearch', () => {
		it('should find at least some tweets', async function() {
			/* expects to find some tweets */
			await Twitter.searchTweetsByKeyword(query)
				.then(data => {
					let res: any = JSON.parse(JSON.stringify(data));
					expect(res.data).not.to.be.empty;
					expect(res.data.statuses).not.to.be.empty;
				});
		});
	});

	describe('#SimpleQuery', () => {
		it('should have a non-empty body', async function() {
			/* expects to find some text */
			Twitter.searchTweetsByKeyword(query)
				.then(data => {
					let res: any = JSON.parse(JSON.stringify(data));
					for (var i = 0; i < res.data.statuses.length; i++) {
						var tweet = res.data.statuses[i];
						expect(tweet.text).not.to.be.empty;
					}
				});
		});
	});

	describe('#SearchById', () => {
		it('should find a specific tweet', async function() {
			await Twitter.searchTweetById(idQuery)
				.then(data => {
					let res: any = JSON.parse(JSON.stringify(data));
					expect(res.data.id_str).to.equal(id);
				});
		});
	});
	
});
