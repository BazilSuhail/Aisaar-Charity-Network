import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FaBars } from 'react-icons/fa';
import { RxCross1 } from "react-icons/rx";
import "./Styles/navbar.css";
import { fs, auth } from "../Config/Config";

const GetcurrUser = () => {
  const [useridtype, setUseridtype] = useState(null);

  useEffect(() => {
    auth.onAuthStateChanged(user => {
      if (user) {
        fs.collection('volunteer').doc(user.uid).get().then(snapshot => {
          if (snapshot.exists) {
            setUseridtype("Volunteer");
          } else {
            fs.collection('donors').doc(user.uid).get().then(snapshot => {
              if (snapshot.exists) {
                setUseridtype("Donor");
              } else {
                setUseridtype(null);
              }
            })
          }
        }).catch(error => {
          console.error("Error getting user document:", error);
          setUseridtype(null);
        });
      } else {
        setUseridtype(null);
      }
    });
  }, []);

  return useridtype;
}

const Navbar = () => {

  const [isOpen, setIsOpen] = useState(false); // State to manage navbar visibility
  const toggleNavbar = () => { setIsOpen(!isOpen); };

  const loggedUser = GetcurrUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    auth.signOut();
    navigate("/");
  };


  const renderLinks = (loggedUser) => {
    if (loggedUser === "Volunteer") {
      return (
        <> {/*<NavLink to="/AppliedProject" className="nav-links">Applied Projects</NavLink>*/}
          
          <NavLink to="/volunteer" className="nav-links">Volunteer Profile</NavLink>
        </>
      );
    } else if (loggedUser === "Donor") {
      return (
        <>
          {/*<NavLink to="/transactionhistory" className="nav-links">Transaction History</NavLink>*/}
          <NavLink to="/donor" className="nav-links">Donor Profile</NavLink>
        </>
      );
    }
  };

  const renderAuthLinks = () => {
    if (!loggedUser) {
      return (
        <> <NavLink to="/login" className="sign-links">Get Started</NavLink> </>
      );
    }
    else {
      return (
        <button onClick={handleLogout} className="logout-button">Logout</button>
      );
    }
  };

  //<div className="logo">إيثار</div>

  return (
    <div className={`navwrapper navbar ${isOpen ? 'open' : ''}`}>

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
        <NavLink to="/listcampaigns" className="nav-links">Campaigns</NavLink>
        {renderLinks(loggedUser)}
      </div>
      <div className="auth-links">
        {renderAuthLinks()}
      </div>
    </div>
  );
};

export default Navbar;
