import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../Config/Config";

import "./Styles/loginsignup.css";
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState("donor");
  const navigate = useNavigate();

  const handleLogin = async (e) => {

    e.preventDefault();
    try {
      await auth.signInWithEmailAndPassword(email, password);
      console.log("User logged in successfully!");
      alert("User logged in successfully!");
      navigate(`/${userType}`);
    }
    catch (error) {
      alert("Incorrect Creddentials !!!");
      alert(error.message);
      console.error("Error logging in:", error.message);
    }
  };

  return (
    <div className="form-container">

    <div className="signup">Login</div>


    <p className="text">Don't Have an account? <Link className="link" to="/signup">Sign Up</Link> </p>


    <form className="form-data" onSubmit={handleLogin}>
      <div className="accType">How Would you like to Continue</div>
      <select className="selection" value={userType} onChange={(e) => setUserType(e.target.value)}>
        <option className="selection" value="donor">Donor</option>
        <option className="selection" value="volunteer">Volunteer</option>
      </select>

      <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button type="submit">Log In</button>

    </form>


  </div>

  );
};

export default Login;
