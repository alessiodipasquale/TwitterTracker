import {render, screen, fireEvent} from '@testing-library/react'
import React from 'react'

import '@testing-library/jest-dom'

import ContestHandler from '../pages/ContestHandler';

describe('Contest Handler tests', () => {
	console.error = jest.fn(); // disables error log

	test('should create control buttons', () => {
		render( <ContestHandler /> )

		expect(screen.getByText(/Create Literary Contest/i)).toBeInTheDocument()
		expect(screen.getByText(/Create Trivia Game/i)).toBeInTheDocument()
		expect(screen.getByText(/Create custom stream/i)).toBeInTheDocument()
	})

});
