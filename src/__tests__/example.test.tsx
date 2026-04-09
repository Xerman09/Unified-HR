import { expect, test } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';

// Simple component for testing
const Welcome = () => <h1>Welcome to Unified-HR</h1>;

test('renders welcome message', () => {
  render(<Welcome />);
  const element = screen.getByText(/welcome to unified-hr/i);
  expect(element).toBeInTheDocument();
});

test('math works', () => {
  expect(1 + 1).toBe(2);
});
