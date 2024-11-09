import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, fs } from "../../Config/Config";
import { useTypewriter, Cursor } from 'react-simple-typewriter';
import { ToastContainer, toast } from 'react-toastify';

import { motion } from 'framer-motion';
import { FaEnvelope, FaLock, FaUserCircle } from 'react-icons/fa';

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [userType, setUserType] = useState("donor");
  const navigate = useNavigate();
  const [focus, setFocus] = useState({ name: false, email: false, password: false });

  const handleFocus = (field) => setFocus((prev) => ({ ...prev, [field]: true }));
  const handleBlur = (field, value) => setFocus((prev) => ({ ...prev, [field]: !!value }));


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
    words: ['To make differnece', 'To Spread Smiles'],
    loop: true,
    typeSpeed: 80,
    deleteSpeed: 40
  });

  return (
    <main className="w-full overflow-hidden">
      <ToastContainer />
      <div className="flex flex-col xl:scale-[1] items-center pt-[75px] justify-center min-h-screen bg-gray-50">
        <motion.div
          className=" w-full max-w-md p-8 space-y-8 bg-white border-[2px] border-gray-100 rounded-lg"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-[34px] mb-[-20px] font-bold text-green-700 text-center">Sign Up</h2>
          <h4 className="text-center mt-[-20px] text-green-900 font-semibold">
            Register Now !! {toDisplay}<Cursor cursorStyle="|" />
          </h4>

          <form onSubmit={handleSignUp} className="space-y-6">
            <div className="text-[15px]  my-[-12px] font-semibold text-green-600">How would you like to register?</div>

            <div className="flex justify-center space-x-4">
              <label
                className={`flex items-center w-[120px] p-2 border-2 rounded-lg cursor-pointer ${userType === 'donor' ? 'border-green-600 bg-green-100' : 'border-gray-300'
                  }`}
                onClick={() => setUserType('donor')}
              >
                <FaUserCircle className="text-green-600 mr-2" />
                <span>Donor</span>
              </label>
              <label
                className={`flex items-center w-[120px] p-2 border-2 rounded-lg cursor-pointer ${userType === 'volunteer' ? 'border-green-600 bg-green-100' : 'border-gray-300'
                  }`}
                onClick={() => setUserType('volunteer')}
              >
                <FaUserCircle className="text-green-600 mr-2" />
                <span>Volunteer</span>
              </label>
            </div>

            {/* Display Name Input */}
            <div className="relative ">
              <FaUserCircle size={24} className="absolute top-4 left-3 text-green-600" />
              <label
                htmlFor="display-name"
                className={`absolute left-12 text-gray-400 transition-all duration-300 ${focus.displayName || displayName ? '-top-3 text-sm text-green-600' : 'top-4 text-md'
                  }`}
              >
                Display Name
              </label>
              <input
                type="text"
                id="display-name"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                onFocus={() => handleFocus('displayName')}
                onBlur={() => handleBlur('displayName', displayName)}
                required
                className="w-full pl-12 pt-3 pb-4 border-b-[3px] border-green-800 outline-none focus:border-green-600"
              />
            </div>

            {/* Email Input */}
            <div className="relative">
              <FaEnvelope size={24} className="absolute top-4 left-3 text-green-600" />
              <label
                htmlFor="email"
                className={`absolute left-12 text-gray-400 transition-all duration-300 ${focus.email || email ? '-top-3 text-sm text-green-600' : 'top-4 text-md'
                  }`}
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => handleFocus('email')}
                onBlur={() => handleBlur('email', email)}
                required
                className="w-full pl-12 pt-3 pb-4 border-b-[3px] border-green-800 outline-none focus:border-green-600"
              />
            </div>

            {/* Password Input */}
            <div className="relative">
              <FaLock size={24} className="absolute top-4 left-3 text-green-600" />
              <label
                htmlFor="password"
                className={`absolute left-12 text-gray-400 transition-all duration-300 ${focus.password || password ? '-top-3 text-sm text-green-600' : 'top-4 text-md'
                  }`}
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => handleFocus('password')}
                onBlur={() => handleBlur('password', password)}
                required
                className="w-full pl-12 pt-3 pb-4 border-b-[3px] border-green-800 outline-none focus:border-green-600"
              />
            </div>

            <motion.button
              type="submit"
              className="w-full py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-500 focus:outline-none"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.95 }}
            >
              Sign Up
            </motion.button>
          </form>
          <h4 className="text-center text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-green-800 font-[600] underline hover:text-green-500">
              Sign In
            </Link>
          </h4>
        </motion.div>
      </div>
    </main>

  );
};

export default SignUp;
