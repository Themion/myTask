import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import App from '~/App';

describe('App', () => {
  it('renders', () => {
    render(<App />);
    const linkElement = screen.getByText(/Vite \+ React/i);
    expect(linkElement).toBeDefined();
  });
});
