import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Sidebar from './Sidebar';

// 1. MOCK DEPENDENCIES
// Mock react-router-dom to control navigation and link rendering
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'), // import and retain all actual exports
    useNavigate: () => mockNavigate, // override useNavigate with a mock
    // Mock NavLink to be a simple <a> tag to check its props
    NavLink: jest.fn(({ children, to, onClick, className }) => (
        <a href={to} onClick={onClick} className={className({ isActive: false })}>
            {children}
        </a>
    )),
}));

// Mock react-icons to simplify the test output
jest.mock('react-icons/fa', () => ({
    FaBars: () => <div data-testid="bars-icon" />,
    FaTimes: () => <div data-testid="times-icon" />,
}));

// Mock static assets
jest.mock('../../assets/image/logo3.png', () => 'logo.png');

// Mock console.error to prevent logging during the edge-case test
const mockConsoleError = jest.spyOn(console, 'error').mockImplementation(() => {});

// Mock localStorage
const localStorageMock = (() => {
    let store = {};
    return {
        getItem: key => store[key] || null,
        setItem: (key, value) => { store[key] = value.toString() },
        removeItem: key => { delete store[key] },
        clear: () => { store = {} },
    };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });


// 2. TEST SUITE
describe('Sidebar Component', () => {

    const mockSetIsAuthenticated = jest.fn();

    // Clear all mocks before each test to ensure isolation
    beforeEach(() => {
        jest.clearAllMocks();
        localStorageMock.clear();
    });

    test('renders correctly with all navigation links', () => {
        render(<Sidebar setIsAuthenticated={mockSetIsAuthenticated} />);

        // Check for static elements
        expect(screen.getByText('Dashboard')).toBeInTheDocument();
        expect(screen.getByRole('img', { name: /logo/i })).toBeInTheDocument();

        // Check for all navigation links
        expect(screen.getByRole('link', { name: 'Dashboard' })).toHaveAttribute('href', '/dashboard');
        expect(screen.getByRole('link', { name: 'Investment Tool' })).toHaveAttribute('href', '/InvestmentTools');
        expect(screen.getByRole('link', { name: 'Market Guides' })).toHaveAttribute('href', '/MarketGuides');
        expect(screen.getByRole('link', { name: 'Profile' })).toHaveAttribute('href', '/Profile');
        expect(screen.getByRole('link', { name: 'Payment' })).toHaveAttribute('href', '/Payment');
        expect(screen.getByText('Sign Out')).toBeInTheDocument();
    });

    describe('Sign Out Functionality', () => {
        test('calls setIsAuthenticated, removes token, and navigates to login on sign out', async () => {
            const user = userEvent.setup();
            localStorage.setItem('authToken', 'test-token');
            render(<Sidebar setIsAuthenticated={mockSetIsAuthenticated} />);

            const signOutButton = screen.getByText('Sign Out');
            await user.click(signOutButton);
            
            // Verify all sign-out actions occurred
            expect(localStorage.getItem('authToken')).toBeNull();
            expect(mockSetIsAuthenticated).toHaveBeenCalledWith(false);
            expect(mockNavigate).toHaveBeenCalledWith('/login');
        });

        test('still navigates to login if setIsAuthenticated is not a function', async () => {
            const user = userEvent.setup();
            // Render the component with a non-function prop
            render(<Sidebar setIsAuthenticated={null} />);

            const signOutButton = screen.getByText('Sign Out');
            await user.click(signOutButton);

            // It should still clear the token and navigate
            expect(localStorage.getItem('authToken')).toBeNull();
            expect(mockNavigate).toHaveBeenCalledWith('/login');

            // The component's prop-checking function should not have been called
            expect(mockSetIsAuthenticated).not.toHaveBeenCalled();
            // The component's error handler should have been called
            expect(mockConsoleError).toHaveBeenCalledWith("setIsAuthenticated is NOT a function in handleSignOut!");
        });
    });

    describe('Mobile Navigation', () => {
        test('toggles the mobile sidebar visibility on button click', async () => {
            const user = userEvent.setup();
            render(<Sidebar setIsAuthenticated={mockSetIsAuthenticated} />);

            const sidebar = screen.getByRole('complementary'); // <aside> has this role
            const toggleButton = screen.getByRole('button', { name: /toggle navigation/i });
            
            // Initial state: closed
            expect(sidebar).not.toHaveClass('is-open');
            expect(screen.getByTestId('bars-icon')).toBeInTheDocument();
            expect(screen.queryByTestId('times-icon')).not.toBeInTheDocument();
            expect(screen.queryByTestId('sidebar-overlay')).not.toBeInTheDocument();

            // First click: open
            await user.click(toggleButton);
            expect(sidebar).toHaveClass('is-open');
            expect(screen.getByTestId('times-icon')).toBeInTheDocument();
            expect(screen.queryByTestId('bars-icon')).not.toBeInTheDocument();
            // The overlay is rendered outside the component, so we look in the whole document.body
            expect(document.querySelector('.dashboard__sidebar-overlay')).toBeInTheDocument();


            // Second click: close
            await user.click(toggleButton);
            expect(sidebar).not.toHaveClass('is-open');
            expect(screen.getByTestId('bars-icon')).toBeInTheDocument();
            expect(screen.queryByTestId('times-icon')).not.toBeInTheDocument();
        });

        test('closes the mobile sidebar when a navigation link is clicked', async () => {
            const user = userEvent.setup();
            render(<Sidebar setIsAuthenticated={mockSetIsAuthenticated} />);
            
            const sidebar = screen.getByRole('complementary');
            const toggleButton = screen.getByRole('button', { name: /toggle navigation/i });

            // Open the sidebar
            await user.click(toggleButton);
            expect(sidebar).toHaveClass('is-open');

            // Click a link
            const profileLink = screen.getByRole('link', { name: 'Profile' });
            await user.click(profileLink);

            // Expect the sidebar to be closed
            expect(sidebar).not.toHaveClass('is-open');
        });

        test('closes the mobile sidebar when the overlay is clicked', async () => {
            const user = userEvent.setup();
            render(<Sidebar setIsAuthenticated={mockSetIsAuthenticated} />);

            const sidebar = screen.getByRole('complementary');
            const toggleButton = screen.getByRole('button', { name: /toggle navigation/i });
            
            // Open the sidebar
            await user.click(toggleButton);
            expect(sidebar).toHaveClass('is-open');

            // Find and click the overlay
            const overlay = document.querySelector('.dashboard__sidebar-overlay');
            expect(overlay).toBeInTheDocument();
            await user.click(overlay);

            // Expect the sidebar to be closed
            expect(sidebar).not.toHaveClass('is-open');
        });
    });
});