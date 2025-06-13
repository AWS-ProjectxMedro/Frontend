import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axios from 'axios';
import Payment from './Payment';

// 1. MOCK DEPENDENCIES
// Mock axios to control API responses in our tests
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Mock child components and static assets to isolate the Payment component
jest.mock('../dashboard/Sidebar', () => () => <div data-testid="sidebar">Mocked Sidebar</div>);
jest.mock('../../assets/image/instamojo.jpg', () => 'instamojo-image-src');

// Mock browser APIs and console to spy on them and prevent side effects
const mockWindowOpen = jest.spyOn(window, 'open').mockImplementation(() => null);
const mockAlert = jest.spyOn(window, 'alert').mockImplementation(() => {});
const mockConsoleError = jest.spyOn(console, 'error').mockImplementation(() => {});


// 2. TEST SUITE
describe('Payment Component', () => {

    // Clear all mocks before each test to ensure a clean slate
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders the initial form correctly', () => {
        render(<Payment />);

        // Check for static elements and form inputs
        expect(screen.getByText('Payment Gateway integration')).toBeInTheDocument();
        expect(screen.getByAltText('Instamojo Payment Gateway')).toBeInTheDocument();
        expect(screen.getByTestId('sidebar')).toBeInTheDocument();
        expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/phone/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/amount/i)).toBeInTheDocument();

        // Initially, only the "Get Token" button should be visible
        expect(screen.getByRole('button', { name: /get token/i })).toBeInTheDocument();
        expect(screen.queryByRole('button', { name: /pay now/i })).not.toBeInTheDocument();

        // The token display area should be hidden
        expect(screen.queryByText(/token:/i)).not.toBeInTheDocument();
    });

    test('updates form fields on user input', async () => {
        const user = userEvent.setup();
        render(<Payment />);

        // Simulate typing into each input field
        await user.type(screen.getByLabelText(/name/i), 'John Doe');
        await user.type(screen.getByLabelText(/email/i), 'john@example.com');
        await user.type(screen.getByLabelText(/phone/i), '1234567890');
        await user.type(screen.getByLabelText(/amount/i), '150');

        // Assert that the input values have been updated
        expect(screen.getByLabelText(/name/i)).toHaveValue('John Doe');
        expect(screen.getByLabelText(/email/i)).toHaveValue('john@example.com');
        expect(screen.getByLabelText(/phone/i)).toHaveValue('1234567890');
        expect(screen.getByLabelText(/amount/i)).toHaveValue('150');
    });

    describe('Token Fetching Logic', () => {
        test('fetches and displays token, and shows "Pay Now" button on success', async () => {
            const user = userEvent.setup();
            const mockToken = 'mock-jwt-token-12345';
            mockedAxios.get.mockResolvedValue({ data: mockToken });
            
            render(<Payment />);

            // Simulate form submission to get the token
            await user.click(screen.getByRole('button', { name: /get token/i }));

            // Check for the loading spinner state
            const loadingButton = await screen.findByRole('button', { name: /loading/i });
            expect(loadingButton).toBeDisabled();

            // After the API call resolves, check the UI updates
            await waitFor(() => {
                expect(screen.getByText(`Token: ${mockToken}`)).toBeInTheDocument();
            });
            expect(screen.getByRole('button', { name: /pay now/i })).toBeInTheDocument();
        });

        test('handles error when fetching token', async () => {
            const user = userEvent.setup();
            mockedAxios.get.mockRejectedValue(new Error('Network Error'));

            render(<Payment />);
            
            await user.click(screen.getByRole('button', { name: /get token/i }));
            
            // Wait for the button to become enabled again after the error
            await waitFor(() => {
                expect(screen.getByRole('button', { name: /get token/i })).not.toBeDisabled();
            });

            // The UI should not show the token or "Pay Now" button
            expect(screen.queryByText(/token:/i)).not.toBeInTheDocument();
            expect(screen.queryByRole('button', { name: /pay now/i })).not.toBeInTheDocument();
            expect(mockConsoleError).toHaveBeenCalledWith("Error fetching token:", expect.any(Error));
        });
    });

    describe('Payment Handling Logic', () => {
        const mockToken = 'mock-jwt-token-12345';
        
        // Helper function to get the component into a state where the token is fetched
        const setupWithToken = async () => {
            const user = userEvent.setup();
            mockedAxios.get.mockResolvedValue({ data: mockToken });
            render(<Payment />);
            
            // Fill form and get token
            await user.type(screen.getByLabelText(/name/i), 'Jane Doe');
            await user.type(screen.getByLabelText(/email/i), 'jane@example.com');
            await user.type(screen.getByLabelText(/phone/i), '9876543210');
            await user.type(screen.getByLabelText(/amount/i), '500');
            await user.click(screen.getByRole('button', { name: /get token/i }));
            await screen.findByText(`Token: ${mockToken}`);
            return { user };
        };

        test('initiates payment successfully and opens payment URL', async () => {
            const mockPaymentUrl = 'https://pay.instamojo.com/order123';
            mockedAxios.post.mockResolvedValue({ data: mockPaymentUrl });
            
            const { user } = await setupWithToken();

            // Click "Pay Now"
            await user.click(screen.getByRole('button', { name: /pay now/i }));

            // Check for loading spinner
            expect(await screen.findByRole('button', { name: /loading/i })).toBeDisabled();

            // After API call, assert that window.open was called with the correct URL
            await waitFor(() => {
                expect(mockWindowOpen).toHaveBeenCalledWith(mockPaymentUrl, '_blank');
            });
            
            // Assert that the POST request was made with the correct form data
            expect(mockedAxios.post).toHaveBeenCalledWith(
                expect.any(String),
                {
                    amount: '500',
                    name: 'Jane Doe',
                    email: 'jane@example.com',
                    phone: '9876543210',
                    token: mockToken,
                }
            );
        });

        test('handles API error during payment initiation', async () => {
            mockedAxios.post.mockRejectedValue(new Error('Order creation failed'));
            
            const { user } = await setupWithToken();
            
            await user.click(screen.getByRole('button', { name: /pay now/i }));

            // Wait for the UI to settle after the error
            await waitFor(() => {
                expect(screen.getByRole('button', { name: /pay now/i })).not.toBeDisabled();
            });

            // Assert that an alert was shown and error logged, but window was not opened
            expect(mockWindowOpen).not.toHaveBeenCalled();
            expect(mockAlert).toHaveBeenCalledWith("Error creating payment order. Check console for details.");
            expect(mockConsoleError).toHaveBeenCalledWith("Error creating order:", expect.any(Error));
        });

        test('handles case where API returns no payment URL', async () => {
            mockedAxios.post.mockResolvedValue({ data: null }); // API returns a falsy value
            
            const { user } = await setupWithToken();
            
            await user.click(screen.getByRole('button', { name: /pay now/i }));

            await waitFor(() => {
                expect(screen.getByRole('button', { name: /pay now/i })).not.toBeDisabled();
            });

            // Assert that the correct failure alert was shown
            expect(mockWindowOpen).not.toHaveBeenCalled();
            expect(mockAlert).toHaveBeenCalledWith("Failed to create payment order. Please try again.");
            expect(mockConsoleError).toHaveBeenCalledWith("No payment URL received");
        });
    });
});