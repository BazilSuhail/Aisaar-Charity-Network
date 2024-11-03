import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { IoClose, IoLogOutOutline, IoMenu, IoSearchOutline } from "react-icons/io5";
import { motion, AnimatePresence } from 'framer-motion';
//import "./navbar.css";
import { fs, auth } from "../../Config/Config";
import { VscMultipleWindows } from "react-icons/vsc";
import { IoMdPerson } from "react-icons/io";

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
    <nav className='fixed w-full bg-white bordb] shadow-lg z-50'>
      {/* Full navbar for larger screens */}
      <div className="w-full z-50 md:flex hidden items-center h-[70px]">
        <NavLink to="/">
          <img src={`${process.env.PUBLIC_URL}/favicon.ico`} alt="Logo" className="w-[42px] ml-[18px] mr-[10px] h-[38px] mx-auto" />
        </NavLink>

        <div className="w-[2.5px] rounded-xl h-[28px] mr-[8px] text bg-gray-700 "></div>

        <NavLink to="/" className="ml-[18px] font-medium text-[17px]">Home</NavLink>
        <NavLink to="/gallery" className="ml-[18px] font-medium text-[17px]">Gallery</NavLink>
        <NavLink to="/listedprojects" className="ml-[18px]  font-medium text-[17px]">Projects</NavLink>
        <NavLink to="/listcampaigns" className="ml-[18px]  font-medium text-[17px]">Campaigns</NavLink>

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
          <NavLink to={userType === 'donor' ? '/donor' : '/volunteer'} className=" ml-auto scale-[0.85]">
            <div className='flex items-center bg-gray-100 px-[20px] mr-[8px] rounded-xl py-[12px]'>
              <div className="h-[45px] w-[45px] flex items-center justify-center text-white bg-green-900 rounded-full"><IoMdPerson size={26} /></div>
              <div className='ml-[8px]'>
                <p className='text-green-400 font-[600] text-[13px]'>{userType === "Volunteer" ? 'Volunteer Profile' : 'Donor Profile'}</p>
                <div className="text-[18px] text-green-900 font-[700]">{firstname}</div>
              </div>
            </div>
          </NavLink>
        }
        {!userType ? <></> : <button onClick={handleLogout} className='h-[55px] flex bg-white mr-[10px] rounded-lg text-red-600 justify-center items-center w-[43px] '><IoLogOutOutline size={23} /></button>}


      </div>

      {/* Hamburger menu for mobile screens */}
      <div className="relative md:hidden">
        <div className="flex items-center h-[70px] justify-between px-4 py-3 relative">
          <div className="flex z-50 items-center">
            <motion.div className="mr-[4px] flex items-center justify-center overflow-hidden"
              style={{ width: '33px', height: '33px' }}
              initial={{ scale: 1 }}
              animate={{ scale: isMenuOpen ? 0 : 1 }}
              transition={{ duration: 0.3 }}
            >
            </motion.div>
            <motion.div
              initial={{ x: 40 }}
              animate={{ x: isMenuOpen ? -40 : 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="h-16 flex items-center justify-center">
                <NavLink to="/" className="text-gray-200 text-[23px] font-bold text-center w-full tracking-tight scale-x-[0.9] scale-y-110">
                  ENTITYSAFE
                </NavLink>
              </div>
            </motion.div>
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

          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                initial={{ y: -100, height: 0 }}
                animate={{ y: 0, height: "100vh", transition: { duration: 0.5 } }}
                exit={{ y: -100, height: 0, transition: { duration: 0.5, delay: 0.5 } }}
                className="fixed inset-0 bg-navbar-color flex flex-col h-screen px-4 py-3 z-40"
                onClick={handleMenuToggle}
              >
                <div className='my-[25px]'></div>
                <motion.div
                  initial={{ x: -100, opacity: 0 }}
                  animate={{ x: 0, opacity: 1, transition: { duration: 0.5, delay: 0.5 } }}
                  exit={{ x: -100, opacity: 0, transition: { duration: 0.2 } }}
                  className="flex flex-col mt-10"
                  onClick={handleMenuToggle}
                >
                  <NavLink to="/pages/AppList" className="font-medium w-[85%] rounded-lg bg-gray-700 mx-auto py-[5px] pl-[15px] text-[18px] text-slate-300 mb-[15px] cursor-pointer">Discover</NavLink>
                  <NavLink to="/pages/AppDetails" className="font-medium w-[85%] rounded-lg bg-gray-700 mx-auto py-[5px] pl-[15px] text-[18px] text-slate-300 mb-[15px] cursor-pointer">Apps</NavLink>
                </motion.div>

                <motion.div
                  initial={{ x: -100, opacity: 0 }}
                  animate={{ x: 0, opacity: 1, transition: { duration: 0.5, delay: 0.5 } }}
                  exit={{ x: -100, opacity: 0, transition: { duration: 0.2 } }}
                  className="flex mx-auto w-[85%] items-center bg-search-color my-[15px] rounded-3xl border border-gray-500 p-[10px]"
                >
                  <IoSearchOutline size={25} className="text-white mr-2" />
                </motion.div>
                <motion.div
                  initial={{ x: -100, opacity: 0 }}
                  animate={{ x: 0, opacity: 1, transition: { duration: 0.5, delay: 0.5 } }}
                  exit={{ x: -100, opacity: 0, transition: { duration: 0.2 } }}
                  className="flex justify-between mx-auto w-[85%] mt-auto mb-[40px]"
                  onClick={handleMenuToggle}
                >
                  <NavLink href="https://bazilsuhail.netlify.app" target='_blank'>
                    <div className='flex '>
                      <div className="text-[20px] ml-[4px] font-[600]">Bazil Suhail</div>
                    </div>
                    <div className="text-[14px] text-gray-500">bazil1854@gmail.com</div>
                  </NavLink>
                  <NavLink to="/AdminControl" className='h-[45px] bg-hightlight-progress rounded-full flex justify-center items-center w-[45px] '><VscMultipleWindows size={25} /></NavLink>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
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