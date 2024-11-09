import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, fs } from "../../Config/Config";
import { useTypewriter, Cursor } from 'react-simple-typewriter';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { motion } from 'framer-motion';
import { FaEnvelope, FaLock, FaUserCircle } from 'react-icons/fa';


const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState("donor");
  const navigate = useNavigate();
  const [focus, setFocus] = useState({ email: false, password: false });

  const handleFocus = (field) => setFocus((prev) => ({ ...prev, [field]: true }));
  const handleBlur = (field, value) => setFocus((prev) => ({ ...prev, [field]: !!value }));


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
    <main className="w-full overflow-hidden">
  <ToastContainer />
  <div className="flex flex-col xl:scale-[1.1] items-center pt-[75px] justify-center min-h-screen bg-gray-50">
    <motion.div
      className="xl:scale-[1.2] w-full max-w-md p-8 space-y-8 bg-white border-[2px] border-gray-100 rounded-lg"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <h2 className="text-[34px] font-bold mb-[-20px] text-green-700 text-center">Login</h2>
      <h4 className="text-center  text-green-900 font-semibold">{toDisplay}<Cursor cursorStyle='|' /></h4>

      <form onSubmit={handleLogin} className="space-y-6 ">
        <div className="text-[15px] my-[-12px] font-semibold text-green-600">How would you like to continue?</div>

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

        {/* Email Input */}
        <div className="relative mt-[25px]">
          <FaEnvelope size={24} className="absolute top-4 left-3 text-green-600" />
          <label
            htmlFor="email"
            className={`absolute left-12 text-gray-400 transition-all duration-300 ${focus.email || email ? '-top-5 text-sm text-green-600' : 'top-4 text-md'
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
            className="w-full pl-12 pt-3 pb-4 border-b-4 border-green-600 outline-none focus:border-green-700"
          />
        </div>

        {/* Password Input */}
        <div className="relative mb-6">
          <FaLock size={24} className="absolute top-4 left-3 text-green-600" />
          <label htmlFor="password"
            className={`absolute left-12 text-gray-400 transition-all duration-300 ${focus.password || password ? '-top-5 text-sm text-green-600' : 'top-4 text-md'
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
            className="w-full pl-12 pt-3 pb-4 border-b-4 border-green-600 outline-none focus:border-green-700"
          />
        </div>

        <motion.button
          type="submit"
          className="w-full py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-500 focus:outline-none"
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.95 }}
        >
          Log In
        </motion.button>
      </form>
      <p className="text-center text-gray-600">
        Don’t have an account?{' '}
        <Link to="/signup" className="text-green-800 font-[600] underline hover:text-green-500">
          Sign Up
        </Link>
      </p>
    </motion.div>
  </div>
</main>

  );
};

export default Login;
