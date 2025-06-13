import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import InvestmentTools from '../InvestmentTools';

// --- Mocks ---
// We need to import the mocked hook so we can change its behavior in tests.
import useFetchData from '../hooks/useFetchData'; 

const mockMakeRequest = jest.fn();
const mockClear = jest.fn();
jest.mock('../hooks/useFetchData', () => jest.fn(() => ({
  data: null,
  loading: false,
  error: null,
  makeRequest: mockMakeRequest,
  clear: mockClear,
})));

const mockResetZoom = jest.fn();
jest.mock('../hooks/useChartZoom', () => () => ({
  brushDomain: { startIndex: null, endIndex: null },
  handleBrushUpdate: jest.fn(),
  handleWheelZoom: jest.fn(),
  resetZoom: mockResetZoom,
  setBrushDomain: jest.fn(),
}));

jest.mock('../Sidebar', () => () => <div data-testid="sidebar" />);
jest.mock('../shared/DataCard', () => ({ title }) => <div data-testid="data-card"><h2>{title}</h2></div>);
jest.mock('../shared/DataTable', () => ({ title, data }) => <div data-testid="data-table"><h2>{title}</h2></div>);
jest.mock('../shared/LoadingSpinner', () => () => <div data-testid="loading-spinner" />);
jest.mock('../shared/ErrorMessage', () => ({ message }) => <div data-testid="error-message">{message}</div>);
jest.mock('../shared/InputForm', () => ({ onSubmit, isLoading }) => (
  <form data-testid="input-form" onSubmit={(e) => { e.preventDefault(); onSubmit({ symbol: 'TEST' }); }}>
    <button type="submit" disabled={isLoading}>Fetch Data</button>
  </form>
));
jest.mock('../shared/ChartDisplay', () => ({ chartBaseTitle }) => <div data-testid="chart-display">{chartBaseTitle}</div>);
jest.mock('../shared/ChartControls', () => () => <div data-testid="chart-controls" />);
jest.mock('../shared/BuyStockModal', () => ({ isOpen }) => isOpen ? <div data-testid="buy-stock-modal" /> : null);
jest.mock('html2canvas', () => jest.fn());

const renderComponent = () => {
    return render(
      <HelmetProvider>
        <MemoryRouter>
          <InvestmentTools />
        </MemoryRouter>
      </HelmetProvider>
    );
};

describe('InvestmentTools Component', () => {
  let localStorageMock;

  beforeEach(() => {
    localStorageMock = (() => {
      let store = {};
      return {
        getItem(key) { return store[key] || null; },
        setItem(key, value) { store[key] = value.toString(); },
        clear() { store = {}; },
      };
    })();
    Object.defineProperty(window, 'localStorage', { value: localStorageMock });

    // Clear mock history before each test
    mockMakeRequest.mockClear();
    mockClear.mockClear();
    mockResetZoom.mockClear();
    useFetchData.mockClear();
  });

  describe('Authentication Handling', () => {
    test('renders access denied message when not logged in', () => {
      localStorageMock.setItem('authToken', '');
      renderComponent();
      expect(screen.getByRole('heading', { name: /Access Denied/i })).toBeInTheDocument();
    });

    test('renders the main tool when logged in', () => {
      localStorageMock.setItem('authToken', 'fake-token');
      useFetchData.mockReturnValue({ data: null, loading: false, error: null, makeRequest: jest.fn(), clear: jest.fn() });
      renderComponent();
      expect(screen.getByRole('heading', { name: /Investment Tool/i })).toBeInTheDocument();
    });
  });

  describe('User Interaction and API Calls', () => {
    beforeEach(() => {
      localStorageMock.setItem('authToken', 'fake-token');
    });

    test('renders the initial state with the correct placeholder text', () => {
      useFetchData.mockReturnValue({ data: null, loading: false, error: null, makeRequest: jest.fn(), clear: jest.fn() });
      renderComponent();
      expect(screen.getByRole('combobox')).toHaveValue('globalQuote');
      // CORRECTED ASSERTION: Match the actual text in the component.
      expect(screen.getByText(/Select API and parameters to fetch data/i)).toBeInTheDocument();
    });

    test('calls makeRequest on form submission', async () => {
      const user = userEvent.setup();
      useFetchData.mockReturnValue({ data: null, loading: false, error: null, makeRequest: mockMakeRequest, clear: mockClear });
      renderComponent();
      
      const submitButton = screen.getByRole('button', { name: /Fetch Data/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockMakeRequest).toHaveBeenCalledWith(expect.stringContaining('/api/market/quote/TEST'));
      });
    });
  });

  describe('Data Display', () => {
    beforeEach(() => {
      localStorageMock.setItem('authToken', 'fake-token');
    });

    test('renders DataCard for Global Quote data', () => {
      // CORRECTED MOCK: Directly set the return value of the mocked hook for this test.
      useFetchData.mockReturnValue({
        data: { symbol: 'AAPL', price: '150.00' },
        loading: false, error: null, makeRequest: jest.fn(), clear: jest.fn(),
      });
      renderComponent();
      expect(screen.getByTestId('data-card')).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: /Global Quote for AAPL/i })).toBeInTheDocument();
    });

    test('renders Chart and Table for time series data', async () => {
      // CORRECTED MOCK
      useFetchData.mockReturnValue({
        data: { 
          metaData: { '2. Symbol': 'IBM' },
          data: [{ date: '2023-01-01', close: 130.00 }]
        },
        loading: false, error: null, makeRequest: jest.fn(), clear: jest.fn(),
      });
      renderComponent();
      
      const user = userEvent.setup();
      await user.selectOptions(screen.getByRole('combobox'), 'daily');

      expect(await screen.findByTestId('chart-display')).toBeInTheDocument();
      expect(screen.getByTestId('data-table')).toBeInTheDocument();
    });

    test('shows loading spinner when loading', () => {
      // CORRECTED MOCK
      useFetchData.mockReturnValue({
        data: null, loading: true, error: null, makeRequest: jest.fn(), clear: jest.fn(),
      });
      renderComponent();
      expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
    });

    test('shows error message on error', () => {
      // CORRECTED MOCK
      useFetchData.mockReturnValue({
        data: null, loading: false, error: 'Failed to fetch', makeRequest: jest.fn(), clear: jest.fn(),
      });
      renderComponent();
      expect(screen.getByTestId('error-message')).toHaveTextContent('Failed to fetch');
    });
  });
});