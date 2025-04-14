import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Dashboard from "./Dashboard";
import Header from "../Component/Header";
import Footer from "../Component/Footer";
import Seo from "../Component/Seo";
import logo1 from "../assets/image/logo1.png";
import logo6 from "../assets/image/logo6.png";
import loginAnimation from "../assets/image/Login_no_bg_v2.gif";
import "../assets/styles/Login.scss";

const LoginRegister = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const [showOtpField, setShowOtpField] = useState(false);
  const [enteredOtp, setEnteredOtp] = useState(Array(6).fill(""));
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [registrationData, setRegistrationData] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

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

  const handleRegistration = async (data) => {
    try {
      console.log("sumit");
      const response = await axios.post("http://3.109.55.32:3308/api/users/verify-phone", {
        phone: data.phone,
      });
      toast.success("OTP Sent! Check your phone.");
      setPhoneNumber(data.phone);
      setRegistrationData(data);
      setShowOtpField(true);
    } catch (error) {
      toast.error(error.response?.data?.message || "Error sending OTP");
    }
  };

  const verifyOtp = async (e) => {
    
    
    try {
      await axios.post("http://3.109.55.32:3308/api/users/verify-phone/verify", {
        phone: phoneNumber,
        otp: enteredOtp.join(""),
      });
      toast.success("OTP Verified!");
      setIsOtpVerified(true);
    } catch (error) {
      toast.error("Invalid OTP or Verification Failed.");
    }
  };

  const registerUser = async () => {
    try {
      
      const response = await axios.post("http://3.109.55.32:3308/api/users/register", registrationData);
      toast.success("Registration Successful!");
      setIsRegister(false);
      setShowOtpField(false);
      setIsOtpVerified(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    }
  };

  const onLogin = async (data) => {
      
    try {
      
      const response = await axios.post("http://3.109.55.32:3308/api/users/login", data, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
      toast.success("Login Successful!");
      setIsAuthenticated(true);
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    }
  };

  useEffect(() => {}, []);

  if (isAuthenticated) {
    return <Dashboard setIsAuthenticated={setIsAuthenticated} />;
  }

  return (
    <div className="auth-container">
      <Seo title="Login Page" description="this is login page" page="Login" keywords="wealth, financial freedom, risk management, strategies" />
      <Header />
      <div className="main-login">
        <div className="auth-card">
          <div className="logo-section1">
            <div className="logo1">
              <img src={logo1} alt="The Capital Tree Logo" className="logo1-img" height="50" width="50" />
            </div>
            <h1 className="brand-name">TheCapitalTree</h1>
          </div>

          {isRegister ? (
            <>
              <h2 className="auth-title">Register</h2>
              <p className="auth-subtitle">Create an account to get started</p>
              {!showOtpField ? (
                <form className="auth-form" onSubmit={handleSubmit(handleRegistration)}>
                  <div className="form-group">
                    <label htmlFor="name">Name</label>
                    <input
                      type="text"
                      id="name"
                      placeholder="Enter your name"
                      {...register("name", { required: "Name is required" })}
                    />
                    {errors.name && <p className="error">{errors.name.message}</p>}
                  </div>
                  <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                      type="email"
                      id="email"
                      placeholder="Enter your email"
                      {...register("email", { required: "Email is required" })}
                    />
                    {errors.email && <p className="error">{errors.email.message}</p>}
                  </div>
                  <div className="form-group">
                    <label htmlFor="phone">Phone</label>
                    <input
                      type="tel"
                      id="phone"
                      placeholder="Enter your phone number"
                      {...register("phone", {
                        required: "Phone number is required",
                        pattern: { value: /^[0-9]{10}$/, message: "Enter a valid 10-digit phone number" },
                      })}
                    />
                    {errors.phone && <p className="error">{errors.phone.message}</p>}
                  </div>
                  <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      placeholder="Enter your password"
                      {...register("password", {
                        required: "Password is required",
                        pattern: {
                          value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{8,16}$/,
                          message: "Must include 1 uppercase, 1 lowercase, 1 special char, 8–16 chars",
                        },
                      })}
                    />
                    {errors.password && <p className="error">{errors.password.message}</p>}
                  </div>
                  <div className="form-group">
                    <label htmlFor="confirmPassword">Confirm Password</label>
                    <input
                      type={showPassword ? "text" : "password"}
                      id="confirmPassword"
                      placeholder="Confirm your password"
                      {...register("confirmPassword", {
                        required: "Confirm password is required",
                        validate: (value) => value === watch("password") || "Passwords do not match",
                      })}
                    />
                    {errors.confirmPassword && <p className="error">{errors.confirmPassword.message}</p>}
                  </div>
                  <button type="submit" className="auth-button register-button">Register</button>
                </form>
              ) : (
                <>
                  <form className="otp-form" onSubmit={verifyOtp}>
                    <div className="form-group otp-boxes">
                      <label htmlFor="otp">Verify OTP</label>
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
                                if (nextInput) nextInput.focus();
                              }
                            }}
                            onKeyDown={(e) => {
                              if (e.key === "Backspace" && !enteredOtp[index] && index > 0) {
                                const prevInput = document.getElementById(`otp-input-${index - 1}`);
                                if (prevInput) prevInput.focus();
                              }
                            }}
                          />
                        ))}
                      </div>
                    </div>
                    <button type="submit" className="auth-button otp-verify-button">Verify OTP</button>
                  </form>
                  {isOtpVerified && (
                    <button className="auth-button final-register-button" onClick={registerUser}>
                      Create Account
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
                <div className="form-group-log">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    placeholder="Enter your email"
                    {...register("email", { required: "Email is required" })}
                  />
                  {errors.email && <p className="error">{errors.email.message}</p>}
                </div>
                <div className="form-group-log">
                  <label htmlFor="password">Password</label>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    placeholder="Enter your password"
                    {...register("password", {
                      required: "Password is required",
                      pattern: {
                        value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{8,16}$/,
                        message: "Enter correct password format",
                      },
                    })}
                  />
                  {errors.password && <p className="error">{errors.password.message}</p>}
                </div>
                <button type="submit" className="auth-button login-button">Login</button>
              </form>
              <p className="toggle-message-log">
                Don’t have an account? <button onClick={toggleForm}>Register</button>
              </p>
            </>
          )}
        </div>

        <div className="loginAnimation">
          <img src={loginAnimation} alt="MonetTree" height="300" width="360" />
          <h2>
            Welcome To <img src={logo6} alt="" height="35" className="welcomelogo" />
            TheCapitalTree
          </h2>
        </div>
      </div>
      <Footer />
      <ToastContainer />
    </div>
  );
};

export default LoginRegister;
