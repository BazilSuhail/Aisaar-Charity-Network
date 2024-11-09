import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, fs } from "../../Config/Config"; 
import { useTypewriter, Cursor } from 'react-simple-typewriter';
import { ToastContainer, toast } from 'react-toastify'; 

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [userType, setUserType] = useState("donor");
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      const { user } = await auth.createUserWithEmailAndPassword(email, password);
      let idtypeValue = userType === "donor" ? "Donor" : "Volunteer"; // Determine idtype value based on userType
      const userData = { displayName, email, idtype: idtypeValue }; // Include idtype in userData

      if (userType === "donor") {
        await fs.collection("donors").doc(user.uid).set(userData);
      } else {
        await fs.collection("volunteer").doc(user.uid).set(userData);
      }

      toast.success('Sign Up Successful !!', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark"
      });

      //console.log("User signed up successfully!");
      //navigate("/login");

      setTimeout(() => {
        navigate(`/login`);
      }, 3000);

    } catch (error) {
      console.error("Error signing up:", error.message);
      toast.error("Account Already in Use !!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark"
      });
    }
  };

  const [toDisplay] = useTypewriter({
    words: ['To make differnece' ,'To Spread Smiles'],
    loop: true,
    typeSpeed: 80,
    deleteSpeed: 40
  });

  return (
    <>
      <ToastContainer />
      <div className="login-container">
        <div className="signup">Sign Up</div> 
        <div className="signup-tagline">Register Now !! {toDisplay}<Cursor cursorStyle='|' /></div>
        <div className="text">Already have an account  <Link className="link" to="/login">Sign In</Link> </div>

        <form className="form-data" onSubmit={handleSignUp}>
          <div className="accType">How Would you like to Register</div>
          <select className="selection" value={userType} onChange={(e) => setUserType(e.target.value)}>
            <option className="selection" value="donor">Donor</option>
            <option className="selection" value="volunteer">Volunteer</option>
          </select>

          <input className="display-name" type="text" placeholder="Display Name" value={displayName} onChange={(e) => setDisplayName(e.target.value)} required />
          <input className="email" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input className="password" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required/>
          <button className="login-btn" type="submit">Sign Up</button>
        </form>
      </div>
    </>
  );
};

export default SignUp;
