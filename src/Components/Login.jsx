import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, fs } from "../Config/Config";
import { useTypewriter, Cursor } from 'react-simple-typewriter';

import "./Styles/loginsignup.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState("donor");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const collectionRef = userType === "donor" ? fs.collection("donors") : fs.collection("volunteer");
      const snapshot = await collectionRef.where("email", "==", email).get();

      if (snapshot.empty) {
        alert("Email not found in database. Please sign up.");
        return;
      }

      await auth.signInWithEmailAndPassword(email, password);
      console.log("User logged in successfully!");
      alert("User logged in successfully!");
      navigate(`/${userType}`);
    } catch (error) {
      alert("Incorrect Credentials !!!");
      console.error("Error logging in:", error.message);
    }
  };

  const [toDisplay] = useTypewriter({
    words: ['To Support our Cause', 'To Make someone Smile'],
    loop: true,
    typeSpeed: 100,
    deleteSpeed: 30
  });

  return (
    <div className="login-container">

      <div className="signup">Login</div>
      <div className="signup-tagline">Login In !! {toDisplay}<Cursor cursorStyle='|' /></div>
      <div className="text">  Don't Have an account? <Link className="link" to="/signup">Sign Up</Link>{" "}  </div>

      <form className="form-data" onSubmit={handleLogin}>
        <div className="accType">How Would you like to Continue</div>

        <select className="selection" value={userType} onChange={(e) => setUserType(e.target.value)}>
          <option className="selection" value="donor">Donor</option>
          <option className="selection" value="volunteer">Volunteer</option>
        </select>

        <input className="email" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input className="password" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button className="login-btn" type="submit">Log In</button>
        
      </form>
    </div>
  );
};

export default Login;
