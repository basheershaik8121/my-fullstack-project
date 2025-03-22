import React, { useContext, useState } from "react";
import "./LoginPopup.css";
import { assets } from "../../assets/assets";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";

const LoginPopup = ({ setShowLogin }) => {
  const { url,setToken } = useContext(StoreContext);

  const [currState, setCurrState] = useState("Login");
  const [data, setData] = useState({ name: "", email: "", password: "" });
  const [message, setMessage] = useState(""); // New state to show messages
  const [loading, setLoading] = useState(false); // Loading state

  // Handle input change
  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setData((prevData) => ({ ...prevData, [name]: value }));
  };

  // Handle Login/Signup
  const onLogin = async (event) => {
    event.preventDefault();
    setMessage(""); // Clear previous messages
    setLoading(true); // Show loading

    let newUrl = url;
    if (currState === "Login") {
      newUrl += "/api/user/login";
    } else {
      newUrl += "/api/user/register";
    }

    try {
      const response = await axios.post(newUrl, data, {
        headers: { "Content-Type": "application/json" },
      });
      setLoading(false);

      if (response.data.success) {
        setToken(response.data.token);
        localStorage.setItem("token",response.data.token);
        setMessage("Login successful! Redirecting...");
        setTimeout(() => {
          setShowLogin(false);
        }, 2000); // Close modal after success
      } else {
        setMessage(response.data.message || "Login failed. Try again.");
      }
    } catch (error) {
      setLoading(false);
      setMessage("An error occurred. Please try again.");
    }
  };

  return (
    <div className="login-popup">
      <form onSubmit={onLogin} className="login-popup-container">
        <div className="login-popup-title">
          <h2>{currState}</h2>
          <img onClick={() => setShowLogin(false)} src={assets.cross_icon} alt="Close" />
        </div>
        
        <div className="login-popup-inputs">
          {currState === "Sign Up" && (
            <input
              name="name"
              onChange={onChangeHandler}
              value={data.name}
              type="text"
              placeholder="Your name"
              required
            />
          )}
          <input
            name="email"
            onChange={onChangeHandler}
            value={data.email}
            type="email"
            placeholder="Your email"
            required
          />
          <input
            name="password"
            onChange={onChangeHandler}
            value={data.password}
            type="password"
            placeholder="Password"
            required
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Processing..." : currState === "Sign Up" ? "Create account" : "Login"}
        </button>

        {message && <p className="message">{message}</p>} {/* Show messages */}

        <div className="login-popup-condition">
          <input type="checkbox" required />
          <p>By continuing, I agree to the terms of use & privacy policy.</p>
        </div>

        <p>
          {currState === "Login" ? "Create a new account?" : "Already have an account?"} {" "}
          <span onClick={() => setCurrState(currState === "Login" ? "Sign Up" : "Login")}>
            {currState === "Login" ? "Click here" : "Login here"}
          </span>
        </p>
      </form>
    </div>
  );
};

export default LoginPopup;
