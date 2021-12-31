import {render, screen} from '@testing-library/react'
import React from 'react'

import '@testing-library/jest-dom'

import UserTracking from '../pages/UserTracking';

describe('User Tracking tests', () => {
	console.error = jest.fn(); // disables error log

	beforeEach(() => {
		render( <UserTracking /> )
	});
	
	test('should create form', () => {
		expect(screen.getByPlaceholderText(/Enter user name/i)).toBeInTheDocument()
		expect(screen.getByText(/Follow User/i)).toBeInTheDocument()
	})

	test('should create map', () => {
		const map = document.querySelector('.leaflet-container')
		expect(map).toBeTruthy()
	})

	test('should create tweet container', () => {
		expect(screen.getByText(/Tweets from the user will appear here./i)).toBeInTheDocument()
	})

});
