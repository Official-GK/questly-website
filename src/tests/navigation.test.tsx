import { render, screen, fireEvent } from '@testing-library/react';
import { HashRouter, useNavigate } from 'react-router-dom';
import Dashboard from '../pages/Dashboard';
import '@testing-library/jest-dom';

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', () => ({
  ...vi.importActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('Dashboard Navigation', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it('should navigate to the correct course page when clicking a course card', () => {
    render(
      <HashRouter>
        <Dashboard />
      </HashRouter>
    );

    // Find and click the React course card
    const reactCard = screen.getByText('Introduction to React');
    fireEvent.click(reactCard);

    // Check if navigation was called with the correct route
    expect(mockNavigate).toHaveBeenCalledWith('/course/react-intro');
  });
});
