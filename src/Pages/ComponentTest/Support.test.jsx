import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import axios from 'axios'; // Import the mocked version
import Support from '../Support';

// --- Mocks ---

// VVV THIS IS THE CORRECTED, MORE ROBUST MOCK VVV
// We are telling Jest that the mocked 'axios' module should be an object
// that has a 'get' property, and that 'get' property is a mock function.
jest.mock('axios', () => ({
  get: jest.fn(),
}));

// Mock child components
jest.mock('../../Component/Header', () => () => <div data-testid="header" />);
jest.mock('../../Component/Footer', () => () => <div data-testid="footer" />);
jest.mock('../../Component/Seo', () => () => <div data-testid="seo" />);


const mockFaqs = [
  { question: "How do I reset my password?", answer: "You can reset your password by going to the login page and clicking on 'Forgot Password'." },
  { question: "What are the support hours?", answer: "Our support team is available 24/7." },
];

const renderSupportPage = () => {
  return render(
    <HelmetProvider>
      <MemoryRouter>
        <Support />
      </MemoryRouter>
    </HelmetProvider>
  );
};


describe('Support Page', () => {
  
  // This `beforeEach` block will now work correctly because our mock for 'axios' 
  // explicitly defines 'get' as a mock function which has the .mockClear() method.
  beforeEach(() => {
    axios.get.mockClear();
  });

  test('renders static content and contact information correctly', () => {
    axios.get.mockResolvedValue({ data: [] });
    renderSupportPage();

    expect(screen.getByRole('heading', { level: 1, name: /How can we help?/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: /Frequently Asked Questions/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: /Contact Support/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Search for help/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Search/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Call Us/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Email Us/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Visit Us/i })).toBeInTheDocument();
    expect(screen.getByTitle(/The Capital Tree Location/i)).toBeInTheDocument();
  });

  test('fetches and displays FAQs from the API', async () => {
    axios.get.mockResolvedValueOnce({ data: mockFaqs });
    renderSupportPage();

    expect(await screen.findByText(mockFaqs[0].question)).toBeInTheDocument();
    expect(screen.getByText(mockFaqs[1].question)).toBeInTheDocument();
    expect(screen.queryByText(mockFaqs[0].answer)).not.toBeInTheDocument();
  });

  test('toggles FAQ answer visibility on click', async () => {
    axios.get.mockResolvedValueOnce({ data: mockFaqs });
    renderSupportPage();

    const firstQuestionButton = await screen.findByRole('button', { name: new RegExp(mockFaqs[0].question) });
    
    fireEvent.click(firstQuestionButton);
    const firstAnswer = await screen.findByText(mockFaqs[0].answer);
    expect(firstAnswer).toBeInTheDocument();
    
    fireEvent.click(firstQuestionButton);
    await waitFor(() => {
      expect(screen.queryByText(mockFaqs[0].answer)).not.toBeInTheDocument();
    });
  });

  test('handles API failure gracefully and does not display FAQs', async () => {
    axios.get.mockRejectedValueOnce(new Error('Network Error'));
    renderSupportPage();

    await waitFor(() => {
      expect(screen.queryByText(mockFaqs[0].question)).not.toBeInTheDocument();
    });
  });

});