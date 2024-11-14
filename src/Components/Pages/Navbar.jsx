import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { IoClose, IoLogOutOutline, IoMenu } from "react-icons/io5";
import { motion, AnimatePresence } from 'framer-motion';
import { fs, auth } from "../../Config/Config";
import { IoMdPerson } from "react-icons/io";
import logo from "./logo.svg";

const AnimatedButton = ({ text }) => {
  return (
    <button className="button-container">
      <span className="span-mother2">
        {text.split("").map((char, index) => (
          <span key={index} style={{ transitionDelay: `${0.1 + index * 0.03}s` }}>
            {char}
          </span>
        ))}
      </span>
      <span className="span-mother">
        {text.split("").map((char, index) => (
          <span key={index} style={{ transitionDelay: `${0.1 + index * 0.03}s` }}>
            {char}
          </span>
        ))}
      </span>

    </button>
  );
};


const GetcurrUser = () => {
  const [userDetails, setUserDetails] = useState({ userType: null, displayName: '' });

  useEffect(() => {
    auth.onAuthStateChanged(user => {
      if (user) {
        fs.collection('volunteer').doc(user.uid).get().then(snapshot => {
          if (snapshot.exists) {
            setUserDetails({ userType: "Volunteer", displayName: snapshot.data().displayName });
          } else {
            fs.collection('donors').doc(user.uid).get().then(snapshot => {
              if (snapshot.exists) {
                setUserDetails({ userType: "Donor", displayName: snapshot.data().displayName });
              } else {
                setUserDetails({ userType: null, displayName: '' });
              }
            })
          }
        }).catch(error => {
          console.error("Error getting user document:", error);
          setUserDetails({ userType: null, displayName: '' });
        });
      } else {
        setUserDetails({ userType: null, displayName: '' });
      }
    });
  }, []);

  return userDetails;
}


const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };


  const { userType, displayName } = GetcurrUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    auth.signOut();
    navigate("/");
  };

  const getFirstName = (displayName) => {
    return displayName.split(' ')[0];
  };


  const firstname = getFirstName(displayName);

  return (
    <nav className='fixed w-full top-0 bg-green-950 text-white shadow-lg z-50'> 
      <div className="w-full z-50 md:flex hidden items-center h-[70px]">
        <NavLink to="/">
          <img src={logo} alt="Logo" className="w-[42px] ml-[18px] mr-[10px] h-[38px] mx-auto" />
        </NavLink>

        <div className="w-[2.5px] rounded-xl h-[28px] mr-[8px] text bg-gray-700 "></div>

        <NavLink to="/" className="ml-[-8px]"><AnimatedButton text={"Home"} /></NavLink>
        <NavLink to="/gallery" className="ml-[-30px]"><AnimatedButton text={"Gallery"} /></NavLink>
        <NavLink to="/listedprojects" className="ml-[-20px]"><AnimatedButton text={"Projects"} /></NavLink>
        <NavLink to="/listcampaigns" className="ml-[-10px]"><AnimatedButton text={"Campaigns"} /></NavLink> 

        {!userType ? <></> :
          <>
            {userType === 'Donor'
              ?
              <NavLink to="/testimonial" className="ml-[18px]  font-medium text-[17px]">Testimonial</NavLink>
              :
              <NavLink to="/complains" className="ml-[18px]  font-medium text-[17px]">Complains</NavLink>
            }
          </>
        }

        {!userType ? <NavLink to="/login" className="ml-auto mr-[15px] border border-white rounded-2xl text-white px-[10px] hover:bg-green-800 py-[3px]">Get Started</NavLink> :
          <NavLink to={userType === 'Donor' ? '/donor' : '/volunteer'} className=" ml-auto scale-[0.85]">
            <div className='flex items-center  rounded-xl py-[8px]'>
              <div className="h-[45px] w-[45px] flex items-center justify-center text-white bg-green-800 rounded-full"><IoMdPerson size={26} /></div>
              <div className='ml-[12px]'>
                <p className='text-green-200 font-[600] text-[13px]'>{userType === "Volunteer" ? 'Volunteer Profile' : 'Donor Profile'}</p>
                <div className="text-[18px] text-green-50 font-[700]">{firstname}</div>
              </div>
            </div>
          </NavLink>
        }
        {!userType ? <></> : <button onClick={handleLogout} className='py-[7px] flex bg-gray-50 mx-[10px] rounded-lg text-red-600 justify-center items-center w-[43px] '><IoLogOutOutline size={23} /></button>}
      </div>

      {/* Hamburger menu for mobile screens */}
      <div className="relative md:hidden">
        <div>
          <div className="flex items-center bg-green-950 h-[70px] z-50 justify-between px-4 py-3 relative">
            <div className="h-16 flex items-center justify-center">
              <NavLink to="/">
                <img src={logo} alt="Logo" className="w-[42px] ml-[18px] mr-[10px] h-[38px] mx-auto" />
              </NavLink>
            </div>
            <div className="md:hidden z-50">
              <motion.div
                key={isMenuOpen ? 'close' : 'menu'}
                initial={{ opacity: 0, rotate: isMenuOpen ? 180 : -180 }}
                animate={{ opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, rotate: isMenuOpen ? -180 : 180 }}
                transition={{ duration: 0.3 }}
                className="cursor-pointer text-gray-300"
                onClick={handleMenuToggle}
              >
                {isMenuOpen ? (
                  <IoClose size={35} />
                ) : (
                  <IoMenu size={35} />
                )}
              </motion.div>
            </div>
          </div>

          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: "100vh" }}
                animate={{ opacity: 1, height: "100vh", transition: { duration: 0.5 } }}
                exit={{ opacity: 0, height: "100vh", transition: { duration: 0.5, delay: 0.5 } }}
                className="fixed inset-0 backdrop-blur-md flex flex-col justify-center items-center bg-opacity-70 bg-black space-y-[12px] h-screen z-40"
                onClick={handleMenuToggle}
              >
                <div className="space-y-2">
                <motion.div className="mb-[45px]" initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1, transition: { duration: 0.5, delay: 0.2 } }} exit={{ y: 50, opacity: 0, transition: { duration: 0.2 } }} onClick={handleMenuToggle}>
                  {!userType ? <NavLink to="/login" className="bg-green-950 flex-start px-[18px] text-white py-[6px] rounded-lg">Get Started</NavLink> :
                    <NavLink to={userType === 'Donor' ? '/donor' : '/volunteer'} >
                      <div className='flex items-center bg-[#04400674] pl-[15px] rounded-xl w-[200px] py-[8px]'>
                        <div className="h-[45px] w-[45px] flex items-center justify-center text-white bg-green-800 rounded-full"><IoMdPerson size={26} /></div>
                        <div className='ml-[12px]'>
                          <p className='text-green-200 font-[600] text-[13px]'>{userType === "Volunteer" ? 'Volunteer Profile' : 'Donor Profile'}</p>
                          <div className="text-[18px] text-green-50 font-[700]">{firstname}</div>
                        </div>
                      </div>
                    </NavLink>
                  }
                </motion.div>
                  <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1, transition: { duration: 0.5, delay: 0.3 } }} exit={{ y: 50, opacity: 0, transition: { duration: 0.2 } }} onClick={handleMenuToggle}>
                    <NavLink to="/" className="text-[44px] text-white text-center font-[400]">Home</NavLink>
                  </motion.div>
                  <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1, transition: { duration: 0.5, delay: 0.5 } }} exit={{ y: 50, opacity: 0, transition: { duration: 0.2 } }} onClick={handleMenuToggle}>
                    <NavLink to="/gallery" className="text-[44px] text-white text-center font-[400]">Gallery</NavLink>
                  </motion.div>
                  <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1, transition: { duration: 0.5, delay: 0.7 } }} exit={{ y: 50, opacity: 0, transition: { duration: 0.2 } }} onClick={handleMenuToggle}>
                    <NavLink to="/listedprojects" className="text-[44px] text-white text-center font-[400]">Projects</NavLink>
                  </motion.div>
                  <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1, transition: { duration: 0.5, delay: 0.9 } }} exit={{ y: 50, opacity: 0, transition: { duration: 0.2 } }} onClick={handleMenuToggle}>
                    <NavLink to="/listcampaigns" className="text-[44px] text-white text-center font-[400]">Campaigns</NavLink>
                  </motion.div>
                  <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1, transition: { duration: 0.5, delay: 1.1 } }} exit={{ y: 50, opacity: 0, transition: { duration: 0.2 } }} onClick={handleMenuToggle}>
                    {userType === 'Donor'
                      ?
                      <NavLink to="/testimonial" className="text-[44px] text-white text-center font-[400]">Testimonial</NavLink>
                      :
                      <NavLink to="/complains" className="text-[44px] text-white text-center font-[400]">Complains</NavLink>
                    } 
                  </motion.div>
                </div>


              </motion.div>
            )
            }
          </AnimatePresence >
        </div >
      </div >
    </nav >
  );
};

export default Navbar;
 