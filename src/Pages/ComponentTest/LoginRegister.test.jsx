import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import axios from 'axios';
import { toast } from 'react-toastify';
import LoginRegister from '../Login';

// Mocks
jest.mock('axios');
jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
  ToastContainer: () => <div data-testid="toast-container" />,
}));
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));
jest.mock('../../Component/Header', () => () => <div data-testid="header" />);
jest.mock('../../Component/Footer', () => () => <div data-testid="footer" />);
jest.mock('../../Component/Seo', () => () => <div data-testid="seo" />);
jest.mock('../../assets/image/logo1.png', () => 'logo1-mock');
jest.mock('../../assets/image/logo6.png', () => 'logo6-mock');
jest.mock('../../assets/image/Login_no_bg_v2.gif', () => 'login-animation-mock');

const mockToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxMjM0NSIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

const renderComponent = (props = {}) => {
  return render(
    <HelmetProvider>
      <MemoryRouter>
        <LoginRegister {...props} />
      </MemoryRouter>
    </HelmetProvider>
  );
};

describe('LoginRegister Component', () => {
  beforeEach(() => {
    axios.post.mockClear();
    mockNavigate.mockClear();
    toast.success.mockClear();
    toast.error.mockClear();
  });

  test('renders login form by default', () => {
    renderComponent();
    expect(screen.getByRole('heading', { name: /Log In/i })).toBeInTheDocument();
    // Use the selector to be specific
    expect(screen.getByLabelText(/Email/i, { selector: 'input' })).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i, { selector: 'input' })).toBeInTheDocument();
  });

  test('toggles between login and register forms', async () => {
    const user = userEvent.setup();
    renderComponent();
    await user.click(screen.getByRole('button', { name: /Register/i }));
    expect(screen.getByRole('heading', { name: /Register/i })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /Log in/i }));
    expect(screen.getByRole('heading', { name: /Log In/i })).toBeInTheDocument();
  });

  describe('Login Flow', () => {
    test('successfully logs in a user and navigates', async () => {
      const user = userEvent.setup();
      const onLoginSuccess = jest.fn();
      axios.post.mockResolvedValueOnce({ data: { token: mockToken } });
      renderComponent({ onLoginSuccess });

      await user.type(screen.getByLabelText(/Email/i), 'test@example.com');
      // VVV CORRECTED LINE VVV
      await user.type(screen.getByLabelText(/Password/i, { selector: 'input' }), 'Password123!');
      
      await user.click(screen.getByRole('button', { name: 'Login' }));

      await waitFor(() => {
        expect(axios.post).toHaveBeenCalledWith(expect.stringContaining('/api/users/login'), expect.any(Object));
        expect(toast.success).toHaveBeenCalledWith('Login Successful!');
        expect(onLoginSuccess).toHaveBeenCalled();
        expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
      });
    });

    test('shows an error toast on failed login', async () => {
      const user = userEvent.setup();
      axios.post.mockRejectedValueOnce({
        response: { data: { message: 'Invalid credentials' } },
      });
      renderComponent();

      await user.type(screen.getByLabelText(/Email/i), 'wrong@example.com');
      // VVV CORRECTED LINE VVV
      await user.type(screen.getByLabelText(/Password/i, { selector: 'input' }), 'wrongpassword');

      await user.click(screen.getByRole('button', { name: 'Login' }));

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith('Invalid credentials');
        expect(mockNavigate).not.toHaveBeenCalled();
      });
    });
  });

  describe('Registration Flow', () => {
    // This test already uses specific queries, so it should be fine.
    // I am including it for completeness.
    test('handles the full registration process successfully', async () => {
      const user = userEvent.setup();
      axios.post
        .mockResolvedValueOnce({})
        .mockResolvedValueOnce({})
        .mockResolvedValueOnce({});
      renderComponent();

      await user.click(screen.getByRole('button', { name: /Register/i }));
      
      await user.type(screen.getByLabelText(/Name/i), 'Test User');
      await user.type(screen.getByLabelText(/Email/i), 'register@example.com');
      await user.type(screen.getByLabelText(/Phone/i), '1234567890');
      
      // The ^ makes the regex more specific, so it only matches labels starting with "Password"
      await user.type(screen.getByLabelText(/^Password/i), 'Password123!');
      await user.type(screen.getByLabelText(/Confirm Password/i), 'Password123!');
      
      await user.click(screen.getByRole('button', { name: /Register/i }));

      expect(await screen.findByText(/Verify OTP sent to 1234567890/i)).toBeInTheDocument();
      expect(toast.success).toHaveBeenCalledWith('OTP Sent! Check your phone.');
      
      const otpInputs = screen.getAllByRole('textbox').filter(input => input.id.startsWith('otp-input'));
      await user.type(otpInputs[0], '123456');

      await user.click(screen.getByRole('button', { name: /Verify OTP/i }));

      expect(await screen.findByRole('button', { name: /Create Account/i })).toBeInTheDocument();
      expect(toast.success).toHaveBeenCalledWith('OTP Verified! Please complete your registration.');

      await user.click(screen.getByRole('button', { name: /Create Account/i }));

      await waitFor(() => {
        expect(toast.success).toHaveBeenCalledWith('Registration Successful! Please log in.');
        expect(screen.getByRole('heading', { name: /Log In/i })).toBeInTheDocument();
      });
    });
  });
});