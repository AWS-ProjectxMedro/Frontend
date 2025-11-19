import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Header from "../Component/Header";
import Footer from "../Component/Footer";
import Seo from "../Component/Seo";
import authIllustration from "../assets/image/Saly-14.png";
import "../assets/styles/Login.scss";

const baseUrl = process.env.REACT_APP_API_BASE_URL || 'https://api.thecapitaltree.in';

// InputField component
const InputField = ({ 
  label, 
  type, 
  id, 
  registerProps, 
  error, 
  showToggle, 
  showPassword, 
  togglePassword,
  isPhoneInput = false,
  phoneValue = "",
  onPhoneChange,
  validationState = null,
  placeholder = ""
}) => (
  <div className="form-group">
    <div style={{ position: 'relative' }}>
      {isPhoneInput ? (
        <div style={{ display: 'flex', alignItems: 'stretch', gap: '0' }}>
          <div style={{
            padding: '0.85rem 1rem',
            backgroundColor: '#f0f0f0',
            border: `2px solid ${error ? '#ff4757' : validationState === 'valid' ? '#2ed573' : '#e5e5e5'}`,
            borderRight: 'none',
            borderRadius: '12px 0 0 12px',
            fontSize: '1rem',
            color: '#333',
            fontWeight: '500',
            minWidth: '70px',
            textAlign: 'center',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            +91
          </div>
          <div style={{ position: 'relative', flex: 1, marginLeft: '8px' }}>
            <input
              type="tel"
              id={id}
              value={phoneValue}
              onChange={(e) => {
                const value = e.target.value.replace(/[^0-9]/g, '').slice(0, 10);
                if (onPhoneChange) {
                  onPhoneChange(value);
                }
              }}
              placeholder={placeholder || "Contact Number"}
              style={{
                width: '100%',
                padding: '0.85rem 1rem',
                border: `2px solid ${error ? '#ff4757' : validationState === 'valid' ? '#2ed573' : '#e5e5e5'}`,
                borderRadius: '0 12px 12px 0',
                fontSize: '1rem',
                transition: 'all 0.3s ease',
                backgroundColor: '#ffffff',
                color: '#333',
                boxSizing: 'border-box',
                height: '100%'
              }}
              maxLength="10"
              className={error ? 'input-error' : validationState === 'valid' ? 'input-valid' : ''}
            />
            {validationState === 'valid' && (
              <div style={{
                position: 'absolute',
                right: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#2ed573',
                fontSize: '16px'
              }}>
                ✓
              </div>
            )}
          </div>
        </div>
      ) : (
        <>
          <input
            type={showToggle && !showPassword ? "password" : type}
            id={id}
            {...registerProps}
            placeholder={placeholder || `Enter your ${label.toLowerCase()}`}
            className={error ? 'input-error' : validationState === 'valid' ? 'input-valid' : ''}
            style={{
              border: `2px solid ${error ? '#ff4757' : validationState === 'valid' ? '#2ed573' : '#e5e5e5'}`,
              backgroundColor: '#FDF8F0',
            }}
          />
          <div style={{
            position: 'absolute',
            right: '10px',
            top: '50%',
            transform: 'translateY(-50%)',
            display: 'flex',
            gap: '5px'
          }}>
            {validationState === 'valid' && (
              <span style={{ color: '#2ed573', fontSize: '16px' }}>✓</span>
            )}
            {showToggle && (
              <button
                type="button"
                onClick={togglePassword}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '18px',
                  color: '#000000'
                }}
              >
                {showPassword ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                    <line x1="1" y1="1" x2="23" y2="23"/>
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                )}
              </button>
            )}
          </div>
        </>
      )}
    </div>
    {error && (
      <div className="error-message">
        <span className="error-icon">⚠️</span>
        <p className="error">{error.message}</p>
      </div>
    )}
  </div>
);

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [validationStates, setValidationStates] = useState({});
  const [formErrors, setFormErrors] = useState({});

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm({
    mode: 'onChange',
    reValidateMode: 'onChange'
  });

  const watchedPassword = watch("password");
  const watchedEmail = watch("email");
  const watchedUsername = watch("username");
  const watchedPhone = watch("phone");
  const watchedConfirmPassword = watch("confirmPassword");

  // Validation functions
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return { isValid: false, message: "Email is required" };
    if (!emailRegex.test(email)) return { isValid: false, message: "Please enter a valid email address" };
    return { isValid: true, message: "" };
  };

  const validatePassword = (password) => {
    if (!password) return { isValid: false, message: "Password is required" };
    if (password.length < 8) return { isValid: false, message: "Password must be at least 8 characters" };
    return { isValid: true, message: "" };
  };

  const validatePhone = (phone) => {
    if (!phone) return { isValid: false, message: "Phone number is required" };
    // Remove any non-digit characters except + for validation
    const cleanPhone = phone.replace(/[^\d+]/g, '');
    // Check if it starts with +91 and has 10 digits after
    if (!/^\+91\d{10}$/.test(cleanPhone)) {
      return { isValid: false, message: "Please enter a valid phone number with country code (+91)" };
    }
    return { isValid: true, message: "" };
  };

  const validateUsername = (username) => {
    if (!username) return { isValid: false, message: "Username is required" };
    if (username.length < 3) return { isValid: false, message: "Username must be at least 3 characters" };
    if (!/^[a-zA-Z0-9_]+$/.test(username)) return { isValid: false, message: "Username should only contain letters, numbers, and underscores" };
    return { isValid: true, message: "" };
  };

  // Real-time validation effect
  useEffect(() => {
    const newValidationStates = {};
    
    if (watchedUsername) {
      const usernameValidation = validateUsername(watchedUsername);
      newValidationStates.username = usernameValidation.isValid ? 'valid' : 'invalid';
    }
    
    if (watchedEmail) {
      const emailValidation = validateEmail(watchedEmail);
      newValidationStates.email = emailValidation.isValid ? 'valid' : 'invalid';
    }
    
    if (watchedPhone) {
      const phoneValidation = validatePhone(watchedPhone);
      newValidationStates.phone = phoneValidation.isValid ? 'valid' : 'invalid';
    }
    
    if (watchedPassword) {
      const passwordValidation = validatePassword(watchedPassword);
      newValidationStates.password = passwordValidation.isValid ? 'valid' : 'invalid';
    }

    if (watchedConfirmPassword && watchedPassword) {
      newValidationStates.confirmPassword = watchedConfirmPassword === watchedPassword ? 'valid' : 'invalid';
    }
    
    setValidationStates(newValidationStates);
  }, [watchedUsername, watchedEmail, watchedPhone, watchedPassword, watchedConfirmPassword]);

  const handleSignUp = async (data) => {
    setLoading(true);
    setFormErrors({});
    
    try {
      // Comprehensive validation before submission
      const validations = {
        username: validateUsername(data.username),
        email: validateEmail(data.email),
        phone: validatePhone(data.phone),
        password: validatePassword(data.password)
      };

      const hasErrors = Object.values(validations).some(v => !v.isValid);
      
      if (hasErrors) {
        const newErrors = {};
        Object.keys(validations).forEach(key => {
          if (!validations[key].isValid) {
            newErrors[key] = validations[key].message;
          }
        });
        setFormErrors(newErrors);
        toast.error("Please fix the validation errors before continuing.");
        return;
      }

      if (data.password !== data.confirmPassword) {
        setFormErrors({ confirmPassword: "Passwords do not match" });
        toast.error("Passwords do not match");
        return;
      }
      
      const registrationPayload = {
        name: data.username,
        email: data.email,
        phone: data.phone,
        password: data.password,
        confirmPassword: data.confirmPassword
      };

      const response = await axios.post(`${baseUrl}/api/users/register`, registrationPayload);

      toast.success("Registration successful! Redirecting to login...");
      
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error) {
      console.error("Registration error:", error);
      console.error("Error response:", error.response?.data);
      console.error("Error status:", error.response?.status);
      console.error("Error message:", error.message);
      
      let errorMessage = "Registration failed";
      
      // Handle network errors (backend not running)
      if (!error.response) {
        errorMessage = `Cannot connect to server. Please make sure the backend is running on ${baseUrl}`;
        toast.error(errorMessage);
        setFormErrors({ general: errorMessage });
        setLoading(false);
        return;
      }
      
      // Handle specific HTTP status codes
      if (error.response?.status === 409) {
        if (error.response.data?.message?.includes('email')) {
          errorMessage = "An account with this email already exists. Please login instead.";
          setFormErrors({ email: errorMessage });
        } else if (error.response.data?.message?.includes('phone')) {
          errorMessage = "An account with this phone number already exists.";
          setFormErrors({ phone: errorMessage });
        } else {
          errorMessage = "Account already exists. Please login instead.";
        }
      } else if (error.response?.status === 400) {
        errorMessage = error.response.data?.message || "Invalid registration data. Please check your input.";
      } else if (error.response?.status === 500) {
        errorMessage = "Server error. Please try again later.";
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast.error(errorMessage);
      setFormErrors({ general: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <Seo
        title="Sign Up"
        description="Create your account to get started"
        page="Sign Up"
        keywords="wealth, financial freedom, risk management, strategies"
      />
      <Header />
      <div className="main-login">
        <div className="illustration-section">
          <div className="illustration-copy">
            <h2 className="illustration-subtitle">Sign Up to</h2>
            <h1 className="illustration-title">The Capital Tree</h1>
            <p className="illustration-helper">
              If you don't have an account register<br />You can <Link to="/login" className="illustration-link">Sign in here !</Link>
            </p>
          </div>
          <div className="illustration-image">
            <img src={authIllustration} alt="Illustration" />
          </div>
        </div>
        <div className="auth-card">
          <h2 className="sign-text">Sign Up</h2>
          
          {formErrors.general && (
            <div className="general-error-message">
              <span className="error-icon">⚠️</span>
              <p>{formErrors.general}</p>
            </div>
          )}
          
          <form className="auth-form-log" onSubmit={handleSubmit(handleSignUp)}>
            <InputField 
              label="Email" 
              type="email" 
              id="email" 
              placeholder="Enter email"
              registerProps={register("email", { 
                required: "Email is required",
                validate: (value) => validateEmail(value).isValid || validateEmail(value).message
              })} 
              error={errors.email || (formErrors.email && { message: formErrors.email })}
              validationState={validationStates.email}
            />
            
            <InputField 
              label="Username" 
              type="text" 
              id="username" 
              placeholder="Username"
              registerProps={register("username", { 
                required: "Username is required",
                validate: (value) => validateUsername(value).isValid || validateUsername(value).message
              })} 
              error={errors.username || (formErrors.username && { message: formErrors.username })}
              validationState={validationStates.username}
            />
            
            <InputField 
              label="Phone Number" 
              type="tel" 
              id="phone" 
              placeholder="+91 1234567890"
              registerProps={{
                ...register("phone", { 
                  required: "Phone number is required",
                  validate: (value) => validatePhone(value).isValid || validatePhone(value).message,
                }),
                onChange: (e) => {
                  // Auto-format phone number with +91
                  let value = e.target.value.replace(/[^\d+]/g, '');
                  if (!value.startsWith('+91')) {
                    if (value.startsWith('91')) {
                      value = '+' + value;
                    } else if (value.startsWith('+')) {
                      // If it starts with + but not +91, replace with +91
                      if (!value.startsWith('+91')) {
                        value = '+91' + value.substring(1).replace(/\D/g, '');
                      }
                    } else {
                      value = '+91' + value;
                    }
                  }
                  // Limit to +91 followed by 10 digits
                  if (value.startsWith('+91')) {
                    const digits = value.substring(3).replace(/\D/g, '').slice(0, 10);
                    value = '+91' + digits;
                  }
                  e.target.value = value;
                  setValue("phone", value, { shouldValidate: true });
                }
              }} 
              error={errors.phone || (formErrors.phone && { message: formErrors.phone })}
              validationState={validationStates.phone}
            />
            
            <InputField 
              label="Password" 
              type="password" 
              id="password" 
              placeholder="Password"
              showToggle 
              showPassword={showPassword} 
              togglePassword={() => setShowPassword(!showPassword)} 
              registerProps={register("password", { 
                required: "Password is required",
                validate: (value) => validatePassword(value).isValid || validatePassword(value).message
              })} 
              error={errors.password || (formErrors.password && { message: formErrors.password })}
              validationState={validationStates.password}
            />
            
            <InputField 
              label="Confirm Password" 
              type="password" 
              id="confirmPassword" 
              placeholder="Confirm Password"
              showToggle 
              showPassword={showConfirmPassword} 
              togglePassword={() => setShowConfirmPassword(!showConfirmPassword)} 
              registerProps={register("confirmPassword", { 
                required: "Confirm password is required", 
                validate: (val) => val === watch("password") || "Passwords do not match" 
              })} 
              error={errors.confirmPassword || (formErrors.confirmPassword && { message: formErrors.confirmPassword })}
              validationState={validationStates.confirmPassword}
            />
            
            <button 
              type="submit" 
              className="auth-button login-btn-dark" 
              disabled={loading} 
              style={{ 
                textTransform: 'uppercase',
                backgroundColor: '#CADEB6',
                boxShadow: '0 4px 61px rgba(202, 222, 182, 0.5)',
                color: '#000000',
                fontWeight: 'bold'
              }}
            >
              {loading ? (
                <span className="button-loading">
                  <span className="spinner"></span>
                  Creating Account...
                </span>
              ) : (
                "CREATE ACCOUNT"
              )}
            </button>
          </form>
          
          <p className="toggle-message-log">
            Already have an account? 
            <Link to="/login" className="toggle-button">Sign in</Link>
          </p>
        </div>
      </div>
      <Footer />
      <ToastContainer 
        position="top-right" 
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
};

export default SignUp;
