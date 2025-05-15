import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Dashboard from "./Dashboard";
import AdminDashboard from "./AdminDashboard";
import Header from "../Component/Header";
import Footer from "../Component/Footer";
import Seo from "../Component/Seo";
import logo1 from "../assets/image/logo1.png";
import logo6 from "../assets/image/logo6.png";
import loginAnimation from "../assets/image/Login_no_bg_v2.gif";
import "../assets/styles/Login.scss";

const InputField = ({ label, type, id, registerProps, error, showToggle, showPassword, togglePassword }) => (
  <div className="form-group">
    <label htmlFor={id}>{label}</label>
    <input
      type={showToggle && !showPassword ? "password" : type}
      id={id}
      {...registerProps}
      placeholder={`Enter your ${label.toLowerCase()}`}
    />
    {error && <p className="error">{error.message}</p>}
  </div>
);

const LoginRegister = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [isRegister, setIsRegister] = useState(false);
  const [showOtpField, setShowOtpField] = useState(false);
  const [enteredOtp, setEnteredOtp] = useState(Array(6).fill(""));
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [registrationData, setRegistrationData] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [otpCooldown, setOtpCooldown] = useState(0);
  const navigate = useNavigate();
  const baseUrl = process.env.REACT_APP_API_BASE_URL;

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
    watch,
  } = useForm();

  const toggleForm = () => {
    setIsRegister(!isRegister);
    setShowOtpField(false);
    setIsOtpVerified(false);
  };

  useEffect(() => {
    if (showOtpField) {
      const firstInput = document.getElementById("otp-input-0");
      firstInput && firstInput.focus();
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
      await axios.post(`${baseUrl}/api/users/verify-phone`, { phone: data.phone });
      toast.success("OTP Sent! Check your phone.");
      setPhoneNumber(data.phone);
      setRegistrationData(data);
      setShowOtpField(true);
      setOtpCooldown(60);
    } catch (error) {
      toast.error(error.response?.data?.message || "Error sending OTP");
    } finally {
      setLoading(false);
    }
  };

  const resendOtp = async () => {
    if (otpCooldown > 0) return;
    setLoading(true);
    try {
      await axios.post(`${baseUrl}/api/users/verify-phone`, { phone: phoneNumber });
      toast.success("OTP Resent!");
      setOtpCooldown(60);
    } catch (error) {
      toast.error("Error resending OTP");
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${baseUrl}/api/users/verify-phone/verify`, {
        phone: phoneNumber,
        otp: enteredOtp.join(""),
      });
      toast.success("OTP Verified!");
      setIsOtpVerified(true);
    } catch (error) {
      toast.error("Invalid OTP or Verification Failed.");
    } finally {
      setLoading(false);
    }
  };

  const registerUser = async () => {
    setLoading(true);
    try {
      await axios.post(`${baseUrl}/api/users/register`, registrationData);
      toast.success("Registration Successful!");
      setIsRegister(false);
      setShowOtpField(false);
      setIsOtpVerified(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const onLogin = async (data) => {
    setLoading(true);
    try {
      const res = await axios.post(`${baseUrl}/api/users/login`, {
        email: data.email,
        password: data.password,
      });

      toast.success("Login Successful!");
      setIsAuthenticated(true);
      const role = res.data.user?.role;
      setUserRole(role);

      console.log("User role:", role);
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  // CONDITIONAL RENDER BASED ON ROLE
  if (isAuthenticated) {
    if (userRole === "admin") {
      return <AdminDashboard setIsAuthenticated={setIsAuthenticated} />;
    } else {
      return <AdminDashboard setIsAuthenticated={setIsAuthenticated} />;
    }
  }

  return (
    <div className="auth-container">
      <Seo title="Login Page" description="this is login page" page="Login" keywords="wealth, financial freedom, risk management, strategies" />
      <Header />
      <div className="main-login">
        <div className="auth-card">
          <div className="logo-section1">
            <img src={logo1} alt="The Capital Tree Logo" className="logo1-img" height="50" width="50" />
            <h1 className="brand-name">TheCapitalTree</h1>
          </div>

          {isRegister ? (
            <>
              <h2 className="auth-title">Register</h2>
              <p className="auth-subtitle">Create an account to get started</p>

              {!showOtpField ? (
                <form className="auth-form" onSubmit={handleSubmit(handleRegistration)}>
                  <InputField label="Name" type="text" id="name" registerProps={register("name", { required: "Name is required" })} error={errors.name} />
                  <InputField label="Email" type="email" id="email" registerProps={register("email", { required: "Email is required" })} error={errors.email} />
                  <InputField label="Phone" type="tel" id="phone" registerProps={register("phone", {
                    required: "Phone number is required",
                    pattern: { value: /^[0-9]{10}$/, message: "Enter a valid 10-digit phone number" },
                  })} error={errors.phone} />
                  <InputField label="Password" type="password" id="password" showToggle showPassword={showPassword} togglePassword={() => setShowPassword(!showPassword)} registerProps={register("password", {
                    required: "Password is required",
                    pattern: {
                      value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{8,16}$/,
                      message: "Must include uppercase, lowercase, special char, 8–16 chars",
                    },
                  })} error={errors.password} />
                  <InputField label="Confirm Password" type="password" id="confirmPassword" showToggle showPassword={showPassword} togglePassword={() => setShowPassword(!showPassword)} registerProps={register("confirmPassword", {
                    required: "Confirm password is required",
                    validate: (value) => value === watch("password") || "Passwords do not match",
                  })} error={errors.confirmPassword} />
                  <button type="submit" className="auth-button register-button" disabled={loading}>
                    {loading ? "Sending OTP..." : "Register"}
                  </button>
                </form>
              ) : (
                <>
                  <form className="otp-form" onSubmit={verifyOtp}>
                    <div className="form-group otp-boxes">
                      <label>Verify OTP</label>
                      <div className="otp-inputs">
                        {enteredOtp.map((digit, index) => (
                          <input
                            key={index}
                            type="text"
                            maxLength="1"
                            className="otp-input"
                            id={`otp-input-${index}`}
                            value={digit}
                            onChange={(e) => {
                              const value = e.target.value.replace(/[^0-9]/g, "");
                              const newOtp = [...enteredOtp];
                              newOtp[index] = value;
                              setEnteredOtp(newOtp);
                              if (value && index < 5) {
                                const nextInput = document.getElementById(`otp-input-${index + 1}`);
                                nextInput && nextInput.focus();
                              }
                            }}
                            onKeyDown={(e) => {
                              if (e.key === "Backspace" && !enteredOtp[index] && index > 0) {
                                const prevInput = document.getElementById(`otp-input-${index - 1}`);
                                prevInput && prevInput.focus();
                              }
                            }}
                          />
                        ))}
                      </div>
                    </div>
                    <button type="submit" className="auth-button otp-verify-button" disabled={loading}>
                      {loading ? "Verifying..." : "Verify OTP"}
                    </button>
                  </form>
                  <button onClick={resendOtp} disabled={otpCooldown > 0} className="resend-otp-button">
                    {otpCooldown > 0 ? `Resend OTP in ${otpCooldown}s` : "Resend OTP"}
                  </button>
                  {isOtpVerified && (
                    <button className="auth-button final-register-button" onClick={registerUser} disabled={loading}>
                      {loading ? "Registering..." : "Create Account"}
                    </button>
                  )}
                </>
              )}
              <p className="toggle-message">
                Already have an account? <button onClick={toggleForm}>Log in</button>
              </p>
            </>
          ) : (
            <>
              <h2 className="auth-title-log">Log In</h2>
              <p className="auth-subtitle-log">Join for exclusive access</p>
              <form className="auth-form-log" onSubmit={handleSubmit(onLogin)}>
                <InputField label="Email" type="email" id="email" registerProps={register("email", { required: "Email is required" })} error={errors.email} />
                <InputField label="Password" type="password" id="password" showToggle showPassword={showLoginPassword} togglePassword={() => setShowLoginPassword(!showLoginPassword)} registerProps={register("password", {
                  required: "Password is required",
                  pattern: {
                    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{8,16}$/,
                    message: "Enter correct password",
                  },
                })} error={errors.password} />
                <button type="submit" className="auth-button login-button" disabled={loading}>
                  {loading ? "Logging in..." : "Login"}
                </button>
              </form>
              <p className="toggle-message-log">
                Don’t have an account? <button onClick={toggleForm}>Register</button>
              </p>
            </>
          )}
        </div>

        <div className="loginAnimation">
          <img src={loginAnimation} alt="MoneyTree" height="300" width="360" />
          <h2>
            Welcome To <img src={logo6} alt="" height="35" className="welcomelogo" /> TheCapitalTree
          </h2>
        </div>
      </div>
      <Footer />
      <ToastContainer />
    </div>
  );
};

export default LoginRegister;
