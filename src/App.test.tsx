import React from 'react';
import { render, screen } from '@testing-library/react';
import ContactForm from './ContactForm';

test('renders contact form heading', () => {
  render(<ContactForm />);
  const headingElement = screen.getByText(/Send me a message. Let's have a chat!/i);
  expect(headingElement).toBeInTheDocument();
});
