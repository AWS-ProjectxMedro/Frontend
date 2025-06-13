import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
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
  const [enteredOtp, setEnteredOtp] = useState(Array(6).fill(""));
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [registrationData, setRegistrationData] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [otpCooldown, setOtpCooldown] = useState(0);
  const navigate = useNavigate();

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
  }, [navigate]);

  const onLogin = async (data) => {
    setLoading(true);
    try {
      const res = await axios.post(`${baseUrl}/api/users/login`, {
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
localStorage.setItem("userRole", userRole); // should be "admin" for admin users
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
    // If Firebase login is needed, replace this with proper call
    onLogin(data);
  };

  const toggleForm = () => {
    setIsRegister(!isRegister);
    setShowOtpField(false);
    setIsOtpVerified(false);
    setEnteredOtp(Array(6).fill(""));
    reset();
  };

  useEffect(() => {
    if (showOtpField) {
      document.getElementById("otp-input-0")?.focus();
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
      toast.success("OTP Sent!");
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
      toast.error(error.response?.data?.message || "Error resending OTP");
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
      toast.error(error.response?.data?.message || "OTP Verification Failed");
    } finally {
      setLoading(false);
    }
  };

  const registerUser = async () => {
    setLoading(true);
    try {
      const data = {
        name: registrationData.name,
        email: registrationData.email,
        phone: registrationData.phone,
        password: registrationData.password,
      };
      await axios.post(`${baseUrl}/api/users/register`, data);
      toast.success("Registration Successful!");
      setIsRegister(false);
      setShowOtpField(false);
      setIsOtpVerified(false);
      setEnteredOtp(Array(6).fill(""));
      reset();
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
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

  return (
    <div className="auth-container">
      <Seo title={isRegister ? "Register" : "Login"} description={isRegister ? "Create your account" : "Log in to your account"} page={isRegister ? "Register" : "Login"} keywords="wealth, financial freedom, risk management, strategies" />
      <Header />
      <div className="main-login">
        <div className="auth-card">
          <div className="logo-section1">
            <img src={logo1} alt="Logo" className="logo1-img" />
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
                  <InputField label="Phone" type="tel" id="phone" registerProps={register("phone", { required: "Phone is required" })} error={errors.phone} />
                  <InputField label="Password" type="password" id="password" showToggle showPassword={showPassword} togglePassword={() => setShowPassword(!showPassword)} registerProps={register("password", { required: "Password is required" })} error={errors.password} />
                  <InputField label="Confirm Password" type="password" id="confirmPassword" showToggle showPassword={showPassword} togglePassword={() => setShowPassword(!showPassword)} registerProps={register("confirmPassword", { required: "Confirm password is required", validate: (val) => val === watch("password") || "Passwords do not match" })} error={errors.confirmPassword} />
                  <button type="submit" className="auth-button" disabled={loading}>{loading ? "Sending OTP..." : "Register"}</button>
                </form>
              ) : (
                <>
                  <form onSubmit={verifyOtp}>
                    <div className="otp-inputs">
                      {enteredOtp.map((val, i) => (
                        <input key={i} type="text" maxLength="1" value={val} onChange={(e) => {
                          const newOtp = [...enteredOtp];
                          newOtp[i] = e.target.value.replace(/[^0-9]/g, "");
                          setEnteredOtp(newOtp);
                          if (i < 5 && e.target.value) {
                            document.getElementById(`otp-input-${i + 1}`)?.focus();
                          }
                        }} id={`otp-input-${i}`} />
                      ))}
                    </div>
                    <button type="submit" disabled={loading || enteredOtp.join("").length !== 6}>{loading ? "Verifying..." : "Verify OTP"}</button>
                  </form>
                  <button onClick={resendOtp} disabled={otpCooldown > 0}>{otpCooldown > 0 ? `Resend OTP in ${otpCooldown}s` : "Resend OTP"}</button>
                  {isOtpVerified && <button onClick={registerUser} disabled={loading}>{loading ? "Registering..." : "Create Account"}</button>}
                </>
              )}
              <p className="toggle-message">Already have an account? <button onClick={toggleForm}>Log in</button></p>
            </>
          ) : (
            <>
              <h2 className="auth-title-log">Log In</h2>
              <form className="auth-form-log" onSubmit={handleSubmit(handleLogin)}>
                <InputField label="Email" type="email" id="loginEmail" registerProps={register("email", { required: "Email is required" })} error={errors.email} />
                <InputField label="Password" type="password" id="loginPassword" showToggle showPassword={showLoginPassword} togglePassword={() => setShowLoginPassword(!showLoginPassword)} registerProps={register("password", { required: "Password is required" })} error={errors.password} />
                <button type="submit" className="auth-button" disabled={loading}>{loading ? "Logging in..." : "Login"}</button>
              </form>
              <p className="toggle-message-log">Don’t have an account? <button onClick={toggleForm}>Register</button></p>
            </>
          )}
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
