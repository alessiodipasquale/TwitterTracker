import { configure, mount } from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import Layout from '../components/Layout';
configure({adapter: new Adapter()});

describe('Home tests', () => {
	console.error = jest.fn(); // disables error log
	
	describe('should render Tweet Search form', () => {
		const wrapper = mount( < Layout / > );

		test('should generate input fields', () => {
			expect(wrapper.findWhere(element => element.prop('placeholder') == 'Enter Keywords to look for').hostNodes()).toHaveLength(1);
			expect(wrapper.findWhere(element => element.prop('placeholder') == 'Max number of tweets').hostNodes()).toHaveLength(1);
			expect(wrapper.findWhere(element => element.prop('placeholder') == 'Enter Author').hostNodes()).toHaveLength(1);
			expect(wrapper.findWhere(element => element.prop('placeholder') == 'List of words to exclude from search').hostNodes()).toHaveLength(1);
			expect(wrapper.findWhere(element => element.prop('placeholder') == 'Insert city').hostNodes()).toHaveLength(1);
			expect(wrapper.findWhere(element => element.prop('placeholder') == 'Insert Radius').hostNodes()).toHaveLength(1);
			expect(wrapper.findWhere(element => element.prop('placeholder') == 'Only get tweets since...').hostNodes()).toHaveLength(1);
			expect(wrapper.findWhere(element => element.prop('placeholder') == 'Only get tweets up to...').hostNodes()).toHaveLength(1);
		});

		test('should generate submit button', () => {
			expect(wrapper.find('button').findWhere(element => element.text() == 'Search Tweets').hostNodes()).toHaveLength(1);
		});

		test('should generate map', () => {
			expect(wrapper.html().includes('leaflet-container')).toEqual(true);
		});

		test('should generate tweet container', () => {
			expect(wrapper.find('.text-muted').text()).toEqual('Your Tweets will appear here. Do a research.');
		});

		test('should generate buttons for general analysis', () => {
			expect(wrapper.find('button').findWhere(element => element.text() == 'General sentiment analysis').hostNodes()).toHaveLength(1);
			expect(wrapper.find('button').findWhere(element => element.text() == 'General wordcloud').hostNodes()).toHaveLength(1);
		});
	});
});
