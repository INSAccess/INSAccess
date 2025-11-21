import { describe, test, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from '../App.jsx';
import { AuthProvider } from '../contexts/AuthContext.jsx';
import RandomUtils from '../utils/RandomUtils.jsx';

describe('App', () => {
  test('renders the App component', () => {
    // Mock the auth fetch so AuthProvider quickly resolves with a token
    vi.spyOn(RandomUtils, 'fetchData').mockResolvedValue({ data: 'test-token', error: null });

    render(
      <AuthProvider>
        <App />
      </AuthProvider>
    );
    screen.debug();
  });
});   