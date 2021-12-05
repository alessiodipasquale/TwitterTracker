import { render, screen, cleanup } from '@testing-library/react';
import { shallow, configure, mount } from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import Layout from '../components/Layout';
configure({adapter: new Adapter()});

describe('Layout tests', () => {
  console.error = jest.fn(); // disables error log

  test('should render Layout component', () => {
    render( < Layout / > );
  });

  describe('should render Navbar', () => {
    const wrapper = mount( < Layout / > );
    test('React Pro Sidebar generated', () => {
      expect(wrapper.find('.pro-sidebar')).toHaveLength(1);
    });
    test('Title', () => {
      expect(wrapper.text().includes('Twitter Tracker')).toBe(true);
    });
    test('Home', () => {
      expect(wrapper.text().includes('Home')).toBe(true);
    });
    test('Contest Handler', () => {
      expect(wrapper.text().includes('Contest Handler')).toBe(true);
    });

  });
});
