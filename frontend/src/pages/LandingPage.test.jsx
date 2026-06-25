import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import LandingPage from './LandingPage';

describe('LandingPage', () => {
  it('renders the hero heading and CTA', () => {
    render(
      <MemoryRouter>
        <LandingPage />
      </MemoryRouter>
    );

    expect(screen.getByText(/AI-Powered Fitness Platform/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Get Started/i })).toBeInTheDocument();
  });
});
