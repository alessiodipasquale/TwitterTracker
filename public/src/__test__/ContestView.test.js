import {render, screen, fireEvent} from '@testing-library/react'
import React from 'react'

import '@testing-library/jest-dom'

import ContestView from '../pages/ContestView';

describe('Contest View tests', () => {
	console.error = jest.fn(); // disables error log

	test('should create contest tabs', () => {
		render( <ContestView /> )

		expect(screen.getByText(/Literary Contests/i)).toBeInTheDocument()
		expect(screen.getByText(/Trivia Games/i)).toBeInTheDocument()
		expect(screen.getByText(/Custom streams/i)).toBeInTheDocument()
	})

});
