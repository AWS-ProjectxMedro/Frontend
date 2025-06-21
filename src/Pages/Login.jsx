import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Header from "../Component/Header";
import Footer from "../Component/Footer";
import Seo from "../Component/Seo";
import logo1 from "../assets/image/logo1.png";
import logo6 from "../assets/image/logo6.png";
import loginAnimation from "../assets/image/Login_no_bg_v2.gif";
import "../assets/styles/Login.scss";

const baseUrl = process.env.REACT_APP_API_BASE_URL;

const ADMIN_EMAILS = [
  "gaurav@example.com",
  "gaurav@example.com",
];

// Input field component
const InputField = ({ label, type, id, registerProps, error, showToggle, showPassword, togglePassword }) => (
  <div className="form-group">
    <label htmlFor={id}>{label}</label>
    <div style={{ position: 'relative' }}>
      <input
        type={showToggle && !showPassword ? "password" : type}
        id={id}
        {...registerProps}
        placeholder={`Enter your ${label.toLowerCase()}`}
      />
      {showToggle && (
        <button
          type="button"
          onClick={togglePassword}
          style={{
            position: 'absolute',
            right: '10px',
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: '16px',
            color: '#666'
          }}
        >
          
        </button>
      )}
    </div>
    {error && <p className="error">{error.message}</p>}
  </div>
);

const LoginRegister = ({ onLoginSuccess }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [showOtpField, setShowOtpField] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [enteredOtp, setEnteredOtp] = useState(Array(6).fill(""));
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [registrationData, setRegistrationData] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [otpCooldown, setOtpCooldown] = useState(0);
  const [otpError, setOtpError] = useState("");
  const [otpAttempts, setOtpAttempts] = useState(0);
  const [resetToken, setResetToken] = useState("");
  
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm();

  const getUserRole = (email, backendRole = null) => {
    if (backendRole === "admin") return "admin";
    if (ADMIN_EMAILS.includes(email.toLowerCase())) return "admin";
    return "user";
  };

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const role = localStorage.getItem("userRole");

    if (token && role) {
      navigate(role === "admin" ? "/adminDashboard" : "/dashboard");
    }

    // Check if there's a reset token in URL params
    const urlResetToken = searchParams.get('token');
    if (urlResetToken) {
      setResetToken(urlResetToken);
      setShowResetPassword(true);
      setShowForgotPassword(false);
      setIsRegister(false);
    }
  }, [navigate, searchParams]);

  const onLogin = async (data) => {
    setLoading(true);
    try {
      const res = await axios.post(`/api/users/login`, {
        email: data.email,
        password: data.password,
      });

      const token = res.data.token;
      if (token) {
        const payload = parseJwt(token);
        const userRole = getUserRole(data.email, payload.role);
        const user = {
          id: payload.userId,
          email: data.email,
          role: userRole,
        };

        localStorage.setItem("authToken", token);
        localStorage.setItem("userRole", userRole);
        localStorage.setItem("userData", JSON.stringify(user));

        toast.success("Login Successful!");

        if (typeof onLoginSuccess === "function") {
          onLoginSuccess(token, userRole, user);
        }

        navigate(userRole === "admin" ? "/adminDashboard" : "/dashboard");
      } else {
        toast.error("Login failed: No token received");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (data) => {
    onLogin(data);
  };

  // Forgot Password Handler
  const handleForgotPassword = async (data) => {
    setLoading(true);
    try {
      await axios.post(`${baseUrl}/api/users/forgot-password`, {
        email: data.email,
      });
      toast.success("Password reset link sent to your email!");
      setShowForgotPassword(false);
      reset();
    } catch (error) {
      console.error("Forgot password error:", error);
      toast.error(error.response?.data?.message || "Failed to send reset link");
    } finally {
      setLoading(false);
    }
  };

  // Reset Password Handler
  const handleResetPassword = async (data) => {
    setLoading(true);
    try {
      await axios.post(`${baseUrl}/api/users/reset-password`, {
        token: resetToken,
        newPassword: data.newPassword,
      });
      toast.success("Password reset successfully! You can now login with your new password.");
      setShowResetPassword(false);
      setResetToken("");
      reset();
      // Navigate to login page and remove token from URL
      navigate('/login', { replace: true });
    } catch (error) {
      console.error("Reset password error:", error);
      toast.error(error.response?.data?.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  const toggleForm = () => {
    setIsRegister(!isRegister);
    setShowOtpField(false);
    setIsOtpVerified(false);
    setEnteredOtp(Array(6).fill(""));
    setOtpError("");
    setOtpAttempts(0);
    setShowForgotPassword(false);
    setShowResetPassword(false);
    reset();
  };

  const showForgotPasswordForm = () => {
    setShowForgotPassword(true);
    setIsRegister(false);
    setShowOtpField(false);
    setShowResetPassword(false);
    reset();
  };

  const backToLogin = () => {
    setShowForgotPassword(false);
    setShowResetPassword(false);
    setIsRegister(false);
    setShowOtpField(false);
    setResetToken("");
    reset();
  };

  useEffect(() => {
    if (showOtpField) {
      setTimeout(() => {
        document.getElementById("otp-input-0")?.focus();
      }, 100);
    }
  }, [showOtpField]);

  useEffect(() => {
    if (otpCooldown > 0) {
      const timer = setTimeout(() => setOtpCooldown(otpCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [otpCooldown]);

  const handleRegistration = async (data) => {
    setLoading(true);
    try {
      const response = await axios.post(`${baseUrl}/api/users/register`, {
        name: data.name,
        email: data.email,
        phone: data.phone,
        password: data.password,
        confirmPassword: data.confirmPassword
      });
      
      toast.success("Registration successful! OTP sent to your phone.");
      setPhoneNumber(data.phone);
      setRegistrationData(data);
      setShowOtpField(true);
      setOtpCooldown(60);
      setOtpAttempts(0);
      setOtpError("");
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const resendOtp = async () => {
    if (otpCooldown > 0) return;
    setLoading(true);
    try {
      await axios.post(`${baseUrl}/api/users/resend-otp`, { phone: phoneNumber });
      toast.success("OTP Resent!");
      setOtpCooldown(60);
      setEnteredOtp(Array(6).fill(""));
      setOtpError("");
      document.getElementById("otp-input-0")?.focus();
    } catch (error) {
      toast.error(error.response?.data?.message || "Error resending OTP. Please try registration again.");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (value, index) => {
    const sanitizedValue = value.replace(/[^0-9]/g, "");
    const newOtp = [...enteredOtp];
    newOtp[index] = sanitizedValue;
    setEnteredOtp(newOtp);
    setOtpError("");

    // Auto-focus next input
    if (sanitizedValue && index < 5) {
      setTimeout(() => {
        document.getElementById(`otp-input-${index + 1}`)?.focus();
      }, 50);
    }

    // Auto-submit when all digits are entered
    if (sanitizedValue && index === 5 && newOtp.every(digit => digit !== "")) {
      setTimeout(() => {
        verifyOtp(null, newOtp.join(""));
      }, 100);
    }
  };

  const handleOtpKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !enteredOtp[index] && index > 0) {
      setTimeout(() => {
        document.getElementById(`otp-input-${index - 1}`)?.focus();
      }, 50);
    }
    if (e.key === 'ArrowLeft' && index > 0) {
      document.getElementById(`otp-input-${index - 1}`)?.focus();
    }
    if (e.key === 'ArrowRight' && index < 5) {
      document.getElementById(`otp-input-${index + 1}`)?.focus();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const paste = e.clipboardData.getData('text').replace(/[^0-9]/g, '').slice(0, 6);
    const newOtp = Array(6).fill("");
    for (let i = 0; i < paste.length; i++) {
      newOtp[i] = paste[i];
    }
    setEnteredOtp(newOtp);
    setOtpError("");
    
    // Focus the next empty input or last input
    const nextEmptyIndex = newOtp.findIndex(digit => digit === "");
    const focusIndex = nextEmptyIndex === -1 ? 5 : nextEmptyIndex;
    setTimeout(() => {
      document.getElementById(`otp-input-${focusIndex}`)?.focus();
    }, 50);

    // Auto-submit if complete
    if (paste.length === 6) {
      setTimeout(() => {
        verifyOtp(null, paste);
      }, 100);
    }
  };

  const verifyOtp = async (e, otpValue = null) => {
    if (e) e.preventDefault();
    
    const otp = otpValue || enteredOtp.join("");
    
    if (otp.length !== 6) {
      setOtpError("Please enter a complete 6-digit OTP");
      return;
    }

    setLoading(true);
    setOtpError("");
    
    try {
      await axios.post(`${baseUrl}/api/users/verify-phone`, {
        phone: phoneNumber,
        otp: otp,
      });
      
      toast.success("Phone number verified successfully! You can now login.");
      
      // Reset form and go back to login
      setIsRegister(false);
      setShowOtpField(false);
      setIsOtpVerified(false);
      setEnteredOtp(Array(6).fill(""));
      setOtpError("");
      setOtpAttempts(0);
      reset();
    } catch (error) {
      const errorMessage = error.response?.data?.message || "OTP Verification Failed";
      setOtpError(errorMessage);
      setOtpAttempts(prev => prev + 1);
      
      // Clear OTP inputs on error
      setEnteredOtp(Array(6).fill(""));
      setTimeout(() => {
        document.getElementById("otp-input-0")?.focus();
      }, 100);
      
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const parseJwt = (token) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      return JSON.parse(atob(base64));
    } catch (error) {
      console.error("JWT parse error", error);
      return {};
    }
  };

  const formatPhoneNumber = (phone) => {
    if (phone.length <= 4) return phone;
    return `${phone.slice(0, -4).replace(/./g, '*')}${phone.slice(-4)}`;
  };

  // Render different forms based on state
  const renderForm = () => {
    if (showResetPassword) {
      return (
        <>
          <h2 className="auth-title">Reset Password</h2>
          <p className="auth-subtitle">Enter your new password</p>
          <form className="auth-form" onSubmit={handleSubmit(handleResetPassword)}>
            <InputField 
              label="New Password" 
              type="password" 
              id="newPassword" 
              showToggle 
              showPassword={showNewPassword} 
              togglePassword={() => setShowNewPassword(!showNewPassword)} 
              registerProps={register("newPassword", { 
                required: "New password is required", 
                minLength: { value: 6, message: "Password must be at least 6 characters" } 
              })} 
              error={errors.newPassword} 
            />
            <InputField 
              label="Confirm New Password" 
              type="password" 
              id="confirmNewPassword" 
              showToggle 
              showPassword={showConfirmNewPassword} 
              togglePassword={() => setShowConfirmNewPassword(!showConfirmNewPassword)} 
              registerProps={register("confirmNewPassword", { 
                required: "Confirm new password is required", 
                validate: (val) => val === watch("newPassword") || "Passwords do not match" 
              })} 
              error={errors.confirmNewPassword} 
            />
            <button type="submit" className="auth-button" disabled={loading}>
              {loading ? (
                <span className="button-loading">
                  <span className="spinner"></span>
                  Resetting...
                </span>
              ) : (
                "Reset Password"
              )}
            </button>
          </form>
          <button 
            type="button" 
            onClick={backToLogin}
            className="back-to-login"
          >
            ← Back to Login
          </button>
        </>
      );
    }

    if (showForgotPassword) {
      return (
        <>
          <h2 className="auth-title">Forgot Password</h2>
          <p className="auth-subtitle">Enter your email to receive a reset link</p>
          <form className="auth-form" onSubmit={handleSubmit(handleForgotPassword)}>
            <InputField 
              label="Email" 
              type="email" 
              id="forgotEmail" 
              registerProps={register("email", { required: "Email is required" })} 
              error={errors.email} 
            />
            <button type="submit" className="auth-button" disabled={loading}>
              {loading ? (
                <span className="button-loading">
                  <span className="spinner"></span>
                  Sending...
                </span>
              ) : (
                "Send Reset Link"
              )}
            </button>
          </form>
          <button 
            type="button" 
            onClick={backToLogin}
            className="back-to-login"
          >
            ← Back to Login
          </button>
        </>
      );
    }

    if (isRegister) {
      return (
        <>
          <h2 className="auth-title">Register</h2>
          <p className="auth-subtitle">Create an account to get started</p>
          {!showOtpField ? (
            <form className="auth-form" onSubmit={handleSubmit(handleRegistration)}>
              <InputField label="Name" type="text" id="name" registerProps={register("name", { required: "Name is required" })} error={errors.name} />
              <InputField label="Email" type="email" id="email" registerProps={register("email", { required: "Email is required" })} error={errors.email} />
              <InputField label="Phone" type="tel" id="phone" registerProps={register("phone", { required: "Phone is required" })} error={errors.phone} />
              <InputField label="Password" type="password" id="password" showToggle showPassword={showPassword} togglePassword={() => setShowPassword(!showPassword)} registerProps={register("password", { required: "Password is required", minLength: { value: 6, message: "Password must be at least 6 characters" } })} error={errors.password} />
              <InputField label="Confirm Password" type="password" id="confirmPassword" showToggle showPassword={showPassword} togglePassword={() => setShowPassword(!showPassword)} registerProps={register("confirmPassword", { required: "Confirm password is required", validate: (val) => val === watch("password") || "Passwords do not match" })} error={errors.confirmPassword} />
              <button type="submit" className="auth-button" disabled={loading}>
                {loading ? (
                  <span className="button-loading">
                    <span className="spinner"></span>
                    Registering...
                  </span>
                ) : (
                  "Register"
                )}
              </button>
            </form>
          ) : (
            <div className="otp-section">
              <div className="otp-header">
                <div className="otp-icon">📱</div>
                <h3 className="otp-title">Verify Your Phone Number</h3>
                <p className="otp-subtitle">
                  We've sent a 6-digit code to<br />
                  <strong>{formatPhoneNumber(phoneNumber)}</strong>
                </p>
              </div>
              
              <form onSubmit={verifyOtp} className="otp-form">
                <div className="otp-inputs-container">
                  <div className="otp-inputs">
                    {enteredOtp.map((val, i) => (
                      <input 
                        key={i} 
                        type="text" 
                        inputMode="numeric"
                        pattern="[0-9]*"
                        maxLength="1" 
                        value={val} 
                        onChange={(e) => handleOtpChange(e.target.value, i)}
                        onKeyDown={(e) => handleOtpKeyDown(e, i)}
                        onPaste={i === 0 ? handleOtpPaste : undefined}
                        id={`otp-input-${i}`} 
                        className={`otp-input ${otpError ? 'error' : ''} ${val ? 'filled' : ''}`}
                        autoComplete="off"
                      />
                    ))}
                  </div>
                  {otpError && (
                    <div className="otp-error">
                      <span className="error-icon">⚠️</span>
                      {otpError}
                    </div>
                  )}
                </div>
                
                <button 
                  type="submit" 
                  className="auth-button otp-verify-btn" 
                  disabled={loading || enteredOtp.join("").length !== 6}
                >
                  {loading ? (
                    <span className="button-loading">
                      <span className="spinner"></span>
                      Verifying...
                    </span>
                  ) : (
                    "Verify OTP"
                  )}
                </button>
              </form>
              
              <div className="otp-footer">
                <p className="otp-help-text">Didn't receive the code?</p>
                <button 
                  type="button"
                  onClick={resendOtp} 
                  disabled={otpCooldown > 0 || loading}
                  className="resend-button"
                >
                  {otpCooldown > 0 ? (
                    <span>
                      <span className="cooldown-icon">⏱️</span>
                      Resend in {otpCooldown}s
                    </span>
                  ) : (
                    <span>
                      <span className="resend-icon">📤</span>
                      Resend OTP
                    </span>
                  )}
                </button>
                
                {otpAttempts > 2 && (
                  <div className="otp-warning">
                    <span className="warning-icon">🚨</span>
                    Multiple failed attempts. Please check your phone number or contact support.
                  </div>
                )}
              </div>
              
              <button 
                type="button" 
                onClick={toggleForm}
                className="back-to-login"
              >
                ← Back to Login
              </button>
            </div>
          )}
          <p className="toggle-message">Already have an account? <button onClick={toggleForm}>Log in</button></p>
        </>
      );
    }

    // Default login form
    return (
      <>
        <h2 className="auth-title-log">Log In</h2>
        <form className="auth-form-log" onSubmit={handleSubmit(handleLogin)}>
          <InputField label="Email" type="email" id="loginEmail" registerProps={register("email", { required: "Email is required" })} error={errors.email} />
          <InputField label="Password" type="password" id="loginPassword" showToggle showPassword={showLoginPassword} togglePassword={() => setShowLoginPassword(!showLoginPassword)} registerProps={register("password", { required: "Password is required" })} error={errors.password} />
          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? (
              <span className="button-loading">
                <span className="spinner"></span>
                Logging in...
              </span>
            ) : (
              "Login"
            )}
          </button>
        </form>
        <div className="auth-links">
          <button 
            type="button" 
            onClick={showForgotPasswordForm}
            className="forgot-password-link"
          >
            Forgot Password?
          </button>
        </div>
        <p className="toggle-message-log">Don't have an account? <button onClick={toggleForm}>Register</button></p>
      </>
    );
  };

  return (
    <div className="auth-container">
      <Seo 
        title={showResetPassword ? "Reset Password" : showForgotPassword ? "Forgot Password" : isRegister ? "Register" : "Login"} 
        description={showResetPassword ? "Reset your password" : showForgotPassword ? "Reset your password" : isRegister ? "Create your account" : "Log in to your account"} 
        page={showResetPassword ? "Reset Password" : showForgotPassword ? "Forgot Password" : isRegister ? "Register" : "Login"} 
        keywords="wealth, financial freedom, risk management, strategies" 
      />
      <Header />
      <div className="main-login">
        <div className="auth-card">
          <div className="logo-section1">
            <img src={logo1} alt="Logo" className="logo1-img" />
            <h1 className="brand-name">TheCapitalTree</h1>
          </div>

          {renderForm()}
        </div>

        <div className="loginAnimation">
          <img src={loginAnimation} alt="Login Graphic" height="300" width="360" />
          <h2>Welcome To <img src={logo6} alt="" height="35" className="welcomelogo" /> TheCapitalTree</h2>
        </div>
      </div>
      <Footer />
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default LoginRegister;
