import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axios from 'axios';
import Profile from './Profile';

// 1. MOCK DEPENDENCIES
// Mock axios for controlling API responses
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Mock child components, hooks, and libraries
jest.mock('../dashboard/Sidebar', () => () => <div data-testid="sidebar">Mocked Sidebar</div>);
jest.mock('react-toastify', () => ({
    ToastContainer: () => <div data-testid="toast-container"></div>, // Mock component
    toast: {
        success: jest.fn(),
        error: jest.fn(),
        warn: jest.fn(),
    },
}));
import { toast } from 'react-toastify';

// Mock static assets
jest.mock('../../assets/image/logo4.png', () => 'default-profile-image.png');

// Mock console methods to keep test output clean
const mockConsoleWarn = jest.spyOn(console, 'warn').mockImplementation(() => {});
const mockConsoleError = jest.spyOn(console, 'error').mockImplementation(() => {});

// 2. SETUP LOCALSTORAGE MOCK
// A helper object to mock localStorage
const localStorageMock = (() => {
    let store = {};
    return {
        getItem: (key) => store[key] || null,
        setItem: (key, value) => {
            store[key] = value.toString();
        },
        clear: () => {
            store = {};
        },
        removeItem: (key) => {
            delete store[key];
        },
    };
})();

// Apply the mock to the window object
Object.defineProperty(window, 'localStorage', {
    value: localStorageMock,
});


// 3. TEST SUITE
describe('Profile Component', () => {
    
    // Clear mocks before each test
    beforeEach(() => {
        jest.clearAllMocks();
        localStorageMock.clear();
    });

    test('shows loading state initially', () => {
        render(<Profile />);
        expect(screen.getByText('Loading profile...')).toBeInTheDocument();
        // The main form should not be visible yet
        expect(screen.queryByText('User Profile Setting')).not.toBeInTheDocument();
    });

    test('renders form with empty fields if no user data in localStorage', async () => {
        render(<Profile />);
        
        // Wait for the loading state to disappear
        await waitFor(() => {
            expect(screen.queryByText('Loading profile...')).not.toBeInTheDocument();
        });

        // Check that the form is rendered with its fields empty
        expect(screen.getByText('User Profile Setting')).toBeInTheDocument();
        expect(screen.getByLabelText(/name/i)).toHaveValue('');
        expect(screen.getByLabelText(/email address/i)).toHaveValue('');
        expect(screen.getByLabelText(/phone/i)).toHaveValue('');
        
        // Verify that a warning was logged
        expect(mockConsoleWarn).toHaveBeenCalledWith("Profile.jsx: No user data found in localStorage.");
    });

    test('loads and displays user data from localStorage', async () => {
        const userData = {
            name: 'John Doe',
            email: 'john.doe@example.com',
            phone: '1234567890',
        };
        localStorageMock.setItem('userData', JSON.stringify(userData));

        render(<Profile />);

        // Wait for the component to finish loading data
        expect(await screen.findByLabelText(/name/i)).toHaveValue('John Doe');
        
        // Check all fields
        expect(screen.getByLabelText(/email address/i)).toHaveValue('john.doe@example.com');
        expect(screen.getByLabelText(/phone/i)).toHaveValue('1234567890');
        // Email should be read-only as per component logic
        expect(screen.getByLabelText(/email address/i)).toBeDisabled();
    });
    
    test('handles user input and updates form state', async () => {
        const user = userEvent.setup();
        render(<Profile />);
        await waitFor(() => expect(screen.queryByText('Loading profile...')).not.toBeInTheDocument());

        const nameInput = screen.getByLabelText(/name/i);
        const phoneInput = screen.getByLabelText(/phone/i);
        const countryInput = screen.getByLabelText(/country/i);

        await user.clear(nameInput);
        await user.type(nameInput, 'Jane Doe');
        await user.type(phoneInput, '9876543210');
        await user.type(countryInput, 'Canada');

        expect(nameInput).toHaveValue('Jane Doe');
        expect(phoneInput).toHaveValue('9876543210');
        expect(countryInput).toHaveValue('Canada');
    });

    describe('Form Submission', () => {
        const setupForSubmission = async () => {
            const user = userEvent.setup();
            const initialUserData = {
                name: 'John Doe',
                email: 'john.doe@example.com',
                phone: '1112223333',
            };
            localStorageMock.setItem('userData', JSON.stringify(initialUserData));
            localStorageMock.setItem('authToken', 'mock-auth-token');

            render(<Profile />);
            await waitFor(() => expect(screen.queryByText('Loading profile...')).not.toBeInTheDocument());

            // Simulate user changing data
            const nameInput = screen.getByLabelText(/name/i);
            const phoneInput = screen.getByLabelText(/phone/i);
            await user.clear(nameInput);
            await user.type(nameInput, 'Johnathan Doe');
            await user.clear(phoneInput);
            await user.type(phoneInput, '5554443333');
            
            return { user };
        };

        test('submits updated data and shows success toast on API success', async () => {
            mockedAxios.put.mockResolvedValue({ data: {} }); // Mock a successful API response
            const { user } = await setupForSubmission();

            const saveButton = screen.getByRole('button', { name: /save changes/i });
            await user.click(saveButton);

            // Verify axios was called correctly
            await waitFor(() => {
                expect(mockedAxios.put).toHaveBeenCalledWith(
                    expect.stringContaining('/api/users/profile/update'), // Check URL
                    { // Check payload
                        name: 'Johnathan Doe',
                        phone: '5554443333',
                        country: '',
                        state: '',
                    },
                    { // Check headers
                        headers: { Authorization: `Bearer mock-auth-token` }
                    }
                );
            });
            
            // Verify success toast was called
            expect(toast.success).toHaveBeenCalledWith("Profile updated successfully!");
        });

        test('shows error toast on API failure', async () => {
            const errorMessage = "Update failed due to invalid data";
            mockedAxios.put.mockRejectedValue({
                response: { data: { message: errorMessage } }
            });

            const { user } = await setupForSubmission();
            
            const saveButton = screen.getByRole('button', { name: /save changes/i });
            await user.click(saveButton);

            // Wait for the async submission logic to complete
            await waitFor(() => {
                expect(mockedAxios.put).toHaveBeenCalled();
            });

            // Verify error toast and console log
            expect(toast.error).toHaveBeenCalledWith(errorMessage);
            expect(mockConsoleError).toHaveBeenCalledWith("Profile.jsx: Error updating profile:", expect.any(Object));
        });
    });
});