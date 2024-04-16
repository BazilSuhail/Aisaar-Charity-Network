import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, fs } from "../Config/Config";
import "./Styles/loginsignup.css";

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

      console.log("User signed up successfully!");
      alert("User signed up successfully!")
      navigate("/login");
    } catch (error) {
      console.error("Error signing up:", error.message);
      alert(error.message);
    }
  };


  return (
    <div className="form-container">

      <div className="signup">Sign Up</div>


      <p className="text">Already have an account? <Link className="link" to="/login">Sign In</Link> </p>


      <form className="form-data" onSubmit={handleSignUp}>
        <div className="accType">How Would you like to Register</div>
        <select className="selection" value={userType} onChange={(e) => setUserType(e.target.value)}>
          <option className="selection" value="donor">Donor</option>
          <option className="selection" value="volunteer">Volunteer</option>
        </select>

        <input type="text" placeholder="Display Name" value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button type="submit">Sign Up</button>

      </form>


    </div>
  );
};

export default SignUp;
