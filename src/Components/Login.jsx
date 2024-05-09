import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, fs } from "../Config/Config";
import { useTypewriter, Cursor } from 'react-simple-typewriter';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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
        toast.error('Account not found', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark"
        });
        return;
      }

      await auth.signInWithEmailAndPassword(email, password);
      toast.success('Login Successful !!', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark"
      });

      setTimeout(() => {
        navigate(`/${userType}`);
      }, 3000);

    } catch (error) {
      //alert("Incorrect Credentials !!!");
      toast.error('Incorrect Credentials !!!', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark"
      });
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
    <>
      <ToastContainer />
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
          <button className="login-btn">Log In</button>
        </form>
      </div>
    </>
  );
};

export default Login;
