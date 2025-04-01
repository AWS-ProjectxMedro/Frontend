import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import Dashboard from "./Dashboard";
import "../assets/styles/Login.scss";
import Header from "../Component/Header";
import logo1 from "../assets/image/logo1.png";
import Footer from "../Component/Footer";
import Seo from '../Component/Seo';

const LoginRegister = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const [showOtpField, setShowOtpField] = useState(false);
  const [enteredOtp, setEnteredOtp] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    setError,
    formState: { errors },
  } = useForm();



  const toggleForm = () => {
    setIsRegister(!isRegister);
    setShowOtpField(false);
  };

  const sendOtp = async (data) => {
    try {
      const response = await fetch("http://localhost:3307/api/users/verify-phone", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: data.phone }),
      });

      const result = await response.json();
      if (response.ok) {
        alert(`OTP Sent! Check your phone.`);
        setPhoneNumber(data.phone);
        setShowOtpField(true);
        setOtpSent(true);
      } else {
        alert(`Error: ${result.message}`);
      }
    } catch (error) {
      console.log(error);
      alert("Error sending OTP. Try again.");
    }
  };

  const registerUser = async (data) => {
    // Combine phone number with other registration data
    const registrationData = {
      ...data,
      phone: data.phone, // Use the phone number from the form
    };

    try {
      const response = await fetch("http://localhost:3307/api/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(registrationData),
      });

      const result = await response.json();
      if (response.ok) {
        alert("Registration Successful!");
        // Optionally, redirect or update state after successful registration
        setIsRegister(false); // Switch to login form, for example
      } else {
        alert(`Registration Error: ${result.message}`);
      }
    } catch (error) {
      console.error("Error during registration:", error);
      alert("Error during registration. Please try again.");
    }
  };


  const verifyOtp = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${"http://localhost:3307/api/users/verify-phone"}/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: phoneNumber, otp: enteredOtp }),
      });

      const result = await response.json();
      if (response.ok) {
        alert("OTP Verified! Registration Successful.");
        setIsAuthenticated(true);
        navigate("/dashboard");
      } else {
        alert(`Invalid OTP: ${result.message}`);
      }
    } catch (error) {
      alert("Error verifying OTP. Try again.");
    }
  };

  const onLogin = (data) => {
    setIsAuthenticated(true);
    navigate("/dashboard");
  };

  if (isAuthenticated) {
    return <Dashboard setIsAuthenticated={setIsAuthenticated} />;
  }

  return (
    <div className="auth-container">
      <Seo title="Login Page" description="this is login page" page="Login" keywords="wealth, financial freedom, risk management, strategies" />
      <Header />
      <div className="auth-card">
        <br />
        <br />

        <div className="logo-section1">
          <div className="logo1">
            <img src={logo1} alt="The Capital Tree Logo" className="logo1-img" title="The Capital Tree Logo" height="50px" width="50px" loading="eager" />
          </div>
          <h1 className="brand-name">TheCapitalTree</h1>
        </div>

        <>  {/*  <React.Fragment> wrapping the entire conditional */}
          {isRegister ? (
            <> {/* React.Fragment inside the true block of conditional rendering */}

              <h2 className="auth-title">Register</h2>
              <p className="auth-subtitle">Create an account to get started</p>

              {!showOtpField ? (
                 <div className="form-with-register-button">
                <form className="auth-form" onSubmit={handleSubmit(sendOtp)}>
                  <div className="form-group">
                    <label htmlFor="name">Name</label>
                    <input type="text" id="name" placeholder="Enter your full name" {...register("name", { required: "Name is required" })} />
                    {errors.name && <p className="error">{errors.name.message}</p>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input type="email" id="email" placeholder="Enter your email" {...register("email", { required: "Email is required" })} />
                    {errors.email && <p className="error">{errors.email.message}</p>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="phone">Phone Number</label>
                    <input type="tel" id="phone" placeholder="Enter your phone number" {...register("phone", { required: "Phone number is required", pattern: { value: /^[0-9]{10}$/, message: "Enter a valid 10-digit phone number" } })} />
                    {errors.phone && <p className="error">{errors.phone.message}</p>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input type="password" id="password"
                      placeholder="Create a strong password" {...register("password", {
                        required: "Password is required",
                        pattern: {
                          value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{8,16}$/,
                          message:
                            "Password must contain 1 uppercase, 1 lowercase, 1 special character, and be 8-16 characters long.",
                        },
                      })} />
                    {errors.password && <p className="error">{errors.password.message}</p>}
                  </div>

                  <button type="submit" className="auth-button">Enter OTP</button>
                  <br />
                  <br />

                </form>
                 <button type="button" className="auth-button" onClick={handleSubmit(registerUser)}>Register</button>
                 </div>
              ) : (
                <form className="otp-form" onSubmit={verifyOtp}>
                  <div className="form-group">
                    <label htmlFor="otp">Enter OTP</label>
                    <input type="text" id="otp" placeholder="Enter 4-digit OTP" maxLength="4" value={enteredOtp} onChange={(e) => setEnteredOtp(e.target.value)} required />
                  </div>
                  <button type="submit" className="auth-button">Verify OTP</button>
                </form>
              )}

              <p className="toggle-message">Already have an account? <button onClick={toggleForm}>Log in</button></p>
            </>
          ) : (
            <>  {/* React.Fragment inside the false block of conditional rendering */}
              <h2 className="auth-title-log">Log In</h2>
              <p className="auth-subtitle-log">Join for exclusive access</p>
              <form className="auth-form-log" onSubmit={handleSubmit(onLogin)}>
                <div className="form-group-log">
                  <label htmlFor="email">Email</label>
                  <input type="email" id="email" placeholder="Enter your email" {...register("email", { required: "Email is required" })} />
                  {errors.email && <p className="error">{errors.email.message}</p>}
                </div>

                <div className="form-group-log">
                  <label htmlFor="password">Password</label>
                  <input
                    type="password"
                    id="password"
                    placeholder="Create a strong password"
                    {...register("password", {
                      required: "Password is required",
                      pattern: {
                        value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{8,16}$/,
                        message: "Enter Correct Password"
                      }
                    })}
                  />

                  {errors.password && <p className="error">{errors.password.message}</p>}
                </div>

                <button type="submit" className="auth-button-log">Log in</button>
              </form>

              <p className="toggle-message-log">Don’t have an account? <button onClick={toggleForm}>Register</button></p>
            </>
          )}
        </>
      </div>
      <Footer />
    </div>
  );
};

export default LoginRegister;