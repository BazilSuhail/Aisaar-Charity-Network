import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { IoClose, IoLogOutOutline, IoMenu } from "react-icons/io5";
import { motion, AnimatePresence } from 'framer-motion'; 
import { fs, auth } from "../../Config/Config";
import { IoMdPerson } from "react-icons/io";

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
      {/* Full navbar for larger screens */}
      <div className="w-full z-50 md:flex hidden items-center h-[70px]">
        <NavLink to="/">
          <img src={`${process.env.PUBLIC_URL}/favicon.ico`} alt="Logo" className="w-[42px] ml-[18px] mr-[10px] h-[38px] mx-auto" />
        </NavLink>

        <div className="w-[2.5px] rounded-xl h-[28px] mr-[8px] text bg-gray-700 "></div>

        <NavLink to="/" className="ml-[-8px]"><AnimatedButton text={"Home"} /></NavLink>
        <NavLink to="/gallery" className="ml-[-30px]"><AnimatedButton text={"Gallery"} /></NavLink>
        <NavLink to="/listedprojects" className="ml-[-20px]"><AnimatedButton text={"Projects"} /></NavLink>
        <NavLink to="/listcampaigns" className="ml-[-10px]"><AnimatedButton text={"Campaigns"} /></NavLink>

        {/*
        <NavLink to="/" className="ml-[-15px]">Home</NavLink>
        <NavLink to="/gallery" className="ml-[-15px]">Gallery</NavLink>
        <NavLink to="/listedprojects" className="ml-[18px]  font-medium text-[17px]">Projects</NavLink>
        <NavLink to="/listcampaigns" className="ml-[18px]  font-medium text-[17px]">Campaigns</NavLink>
        */}

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


        {!userType ? <NavLink to="/login" className="ml-auto mr-[15px] bg-green-950 px-[18px] text-white py-[6px] rounded-lg">Get Started</NavLink> :
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
                <img src={`${process.env.PUBLIC_URL}/favicon.ico`} alt="Logo" className="w-[42px] ml-[18px] mr-[10px] h-[38px] mx-auto" />
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
                className="fixed inset-0 backdrop-blur-md bg-opacity-70 bg-black flex flex-col items-center justify-center space-y-[12px] underline font-[700] text-[#d9f5c5] text-[35px] h-screen z-40"
                onClick={handleMenuToggle}
              >

                <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1, transition: { duration: 0.5, delay: 0.3 } }} exit={{ y: 50, opacity: 0, transition: { duration: 0.2 } }} onClick={handleMenuToggle}>
                  <NavLink to="/" className="">Home</NavLink>
                </motion.div>
                <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1, transition: { duration: 0.5, delay: 0.5 } }} exit={{ y: 50, opacity: 0, transition: { duration: 0.2 } }} onClick={handleMenuToggle}>
                  <NavLink to="/gallery" className="">Gallery</NavLink>
                </motion.div>
                <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1, transition: { duration: 0.5, delay: 0.7 } }} exit={{ y: 50, opacity: 0, transition: { duration: 0.2 } }} onClick={handleMenuToggle}>
                  <NavLink to="/listedprojects" className="">Projects</NavLink>
                </motion.div>
                <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1, transition: { duration: 0.5, delay: 0.9 } }} exit={{ y: 50, opacity: 0, transition: { duration: 0.2 } }} onClick={handleMenuToggle}>
                  <NavLink to="/listcampaigns" className="">Campaigns</NavLink>
                </motion.div>


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



/*
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  const toggleNavbar = () => {
    setIsOpen(!isOpen);
  };

  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const { userType, displayName } = GetcurrUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    auth.signOut();
    navigate("/");
  };

  const getFirstName = (displayName) => {
    return displayName.split(' ')[0];
  };

  const renderLinks = (userType, displayName) => {
    const firstName = getFirstName(displayName);

    if (userType === "Volunteer") {
      return (
        <div className="auth-container" >
          <NavLink to="/volunteer" className="profile-container-volunteer">
            <IoMdPerson />
          </NavLink>
          <div className="profile">{firstName}</div>
        </div>
      );
    } else if (userType === "Donor") {
      return (
        <div className="auth-container" >
          <NavLink to="/donor" className="profile-container-donor">
            <IoMdPerson />
          </NavLink>
          <div className="profile">{firstName}</div>
        </div>
      );
    }
  };

  const renderAuthLinks = () => {
    if (!userType) {
      return (
        <NavLink to="/login" className="sign-links">Get Started</NavLink>
      );
    } else {
      return (
        <>
          {renderLinks(userType, displayName)}
          <div>
            <button onClick={handleLogout} className="logout-button">
              <IoLogOutOutline />
              <div className="logout-mobile">Logout</div>
            </button>
          </div>
        </>
      );
    }
  };

  const renderFeedback = (userType) => {
    if (userType === "Volunteer") {
      return (
        <NavLink to="/complains" className="nav-links"  >Complains</NavLink>
      );
    } else if (userType === "Donor") {
      return (
        <NavLink to="/testimonial" className="nav-links"  >Testimonials</NavLink>
      );
    }
  };

  return (
    <div className={`navbar ${isOpen ? 'open' : ''}`}>
      <div className="logo-container">
        <div className="logo">إيثار</div>
        {isOpen ? (
          <RxCross1 className="menu-icon" onClick={toggleNavbar} />
        ) : (
          <FaBars className="menu-icon" onClick={toggleNavbar} />
        )}
      </div>

      <div className="links">
        <NavLink to="/" className="nav-links"  >Home</NavLink>
        <NavLink to="/gallery" className="nav-links"  >Gallery</NavLink>
        <NavLink to="/listedprojects" className="nav-links"  >Projects</NavLink>
        <NavLink to="/listcampaigns" className="nav-links"  >Campaigns</NavLink>
        {renderFeedback(userType)}
      </div>
      <div className="auth-links">
        {renderAuthLinks()}
      </div>
 
      <motion.div
        className="vertical-menu"
        ref={menuRef}
        initial={{ x: '-100vw' }}
        animate={{ x: isOpen ? '0' : '-100vw' }}
        transition={{ duration: 0.5 }}
      >
        <div className="vertical-logo"> 
          <div className="logo" onClick={toggleNavbar}>إيثار</div>
        </div>
        <div className="vertical-line"></div>
        <div className="menu-vertical">
          <NavLink to="/" className="nav-links" onClick={toggleNavbar}>Home</NavLink>
          <NavLink to="/gallery" className="nav-links" onClick={toggleNavbar}>Gallery</NavLink>
          <NavLink to="/listedprojects" className="nav-links" onClick={toggleNavbar}>Projects</NavLink>
          <NavLink to="/listcampaigns" className="nav-links" onClick={toggleNavbar}>Campaigns</NavLink>
          {renderFeedback(userType)}
        </div>
        <div className="vertical-line2"></div>
        {renderAuthLinks()}
      </motion.div>
    </div>
  );
};

export default Navbar;
*/