import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import axios from 'axios';
import MarketGuides from '../MarketGuides'; // The component to test

// --- Mocks ---
// Mock the entire axios library, providing a mock 'get' function.
jest.mock('axios', () => ({
  get: jest.fn(),
}));

// Mock child components to test the MarketGuides page in isolation.
// The path '../Sidebar' is relative to this test file's assumed location.
jest.mock('../Sidebar', () => () => <div data-testid="sidebar" />);

// Define a reusable set of mock blogs for our tests.
const mockBlogs = [
  {
    _id: 'blog1',
    title: 'Expert Market Analysis 2024',
    author: 'Admin',
    content: '<p>This is the full content of the expert market analysis. It provides deep insights.</p>',
    imageUrl: 'http://example.com/analysis.jpg',
    createdAt: '2024-01-15T11:00:00.000Z',
    views: 250,
    likes: 45,
  },
  {
    _id: 'blog2',
    title: 'Top Investment Strategies',
    author: 'TheCapitalTree Team',
    content: '<p>Discover top strategies to maximize your investment returns this year.</p>',
    imageUrl: 'http://example.com/strategies.jpg',
    createdAt: '2024-01-14T09:30:00.000Z',
    views: 300,
    likes: 60,
  },
];

/**
 * A helper function to render the component with all necessary providers.
 */
const renderMarketGuidesPage = () => {
  return render(
    <HelmetProvider>
      <MemoryRouter>
        <MarketGuides />
      </MemoryRouter>
    </HelmetProvider>
  );
};


describe('MarketGuides Component', () => {

  // Clear mock history before each test for clean, isolated tests.
  beforeEach(() => {
    axios.get.mockClear();
  });

  test('shows a loading state initially', () => {
    // Mock a promise that never resolves to keep the component in its loading state.
    axios.get.mockReturnValue(new Promise(() => {}));
    renderMarketGuidesPage();
    
    expect(screen.getByText(/Loading articles.../i)).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: /Expert Market Analysis 2024/i })).not.toBeInTheDocument();
  });

  test('fetches and displays a list of blogs on a successful API call', async () => {
    // Mock a successful API response for this test.
    axios.get.mockResolvedValueOnce({ data: mockBlogs });
    renderMarketGuidesPage();

    // The 'loading' text should disappear, and blog titles should appear.
    // We use `findBy*` to wait for the re-render after the API call.
    expect(await screen.findByText('Expert MarketAnalysis 2024')).toBeInTheDocument();
    expect(screen.getByText('Top Investment Strategies')).toBeInTheDocument();

    // Spot-check details of the first blog card to ensure correct mapping.
    const firstAuthorDate = screen.getByText(/By Admin/i);
    expect(firstAuthorDate).toBeInTheDocument();
    expect(firstAuthorDate).toHaveTextContent(/on/i); // More robust date check

    expect(screen.getByText(/This is the full content of the expert market analysis/i)).toBeInTheDocument();
    expect(screen.getByText(/250 Views/i)).toBeInTheDocument();
    expect(screen.getByText(/45 Likes/i)).toBeInTheDocument();
    
    // Check that there are two "Read More" links, one for each blog post.
    const readMoreLinks = screen.getAllByRole('link', { name: /Read More →/i });
    expect(readMoreLinks).toHaveLength(2);
  });

  test('displays an error message when the API call fails', async () => {
    // Suppress the expected console.error from polluting the test output.
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    // Mock a failed API response for this test.
    axios.get.mockRejectedValueOnce(new Error('API is down'));
    renderMarketGuidesPage();

    // Wait for the error message to be displayed.
    expect(await screen.findByText(/Failed to load articles. API is down/i)).toBeInTheDocument();
    
    // Ensure the loading spinner is gone and no blogs are rendered.
    expect(screen.queryByText(/Loading articles.../i)).not.toBeInTheDocument();
    expect(screen.queryByText('Expert Market Analysis 2024')).not.toBeInTheDocument();
    
    // Restore the original console.error function.
    consoleErrorSpy.mockRestore();
  });

  test('displays a message when no blogs are returned from the API', async () => {
    // Mock a successful response but with an empty array of data.
    axios.get.mockResolvedValueOnce({ data: [] });
    renderMarketGuidesPage();

    // Wait for the "no articles" message to appear.
    expect(await screen.findByText(/No articles found at the moment/i)).toBeInTheDocument();
  });

  test('renders the main page structure and Sidebar', () => {
    axios.get.mockResolvedValue({ data: [] }); // Provide a default mock.
    renderMarketGuidesPage();

    // Check for the main heading and the mocked Sidebar component.
    expect(screen.getByRole('heading', { level: 1, name: /Blog & Insights/i })).toBeInTheDocument();
    expect(screen.getByTestId('sidebar')).toBeInTheDocument();
  });
});