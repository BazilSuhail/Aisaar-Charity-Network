import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FaBars } from 'react-icons/fa';
import { IoMdPerson } from "react-icons/io";
import { IoLogOutOutline } from "react-icons/io5";
import { RxCross1 } from "react-icons/rx";
import "./Styles/navbar.css";
import { fs, auth } from "../Config/Config";

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
  const [isOpen, setIsOpen] = useState(false);  
  const toggleNavbar = () => { setIsOpen(!isOpen); };

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
        <>
          <NavLink to="/volunteer" className="profile-container-volunteer">
            <IoMdPerson /> 
          </NavLink>
          <div className="profile">{firstName}</div>
        </>
      );
    } else if (userType === "Donor") {
      return (
        <>
          <NavLink to="/donor" className="profile-container-donor">
            <IoMdPerson />
          </NavLink>
          <div className="profile">{firstName}</div>
        </>
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
        <NavLink to="/" className="nav-links">Home</NavLink>
        <NavLink to="/gallery" className="nav-links">Gallery</NavLink>
        <NavLink to="/listedprojects" className="nav-links">Projects</NavLink>
        {/*<NavLink to="/dummy" className="nav-links">dummy</NavLink>*/}
        <NavLink to="/listcampaigns" className="nav-links">Campaigns</NavLink> 
      </div>
      <div className="auth-links">
        {renderAuthLinks()}
      </div>
    </div>
  );
};

export default Navbar;
