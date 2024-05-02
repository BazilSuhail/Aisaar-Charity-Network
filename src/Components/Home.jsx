import React, { useState, useEffect } from 'react';
import { fs } from '../Config/Config';
import "./Styles/home.css";
import "./Styles/tables.css";
import Footer from "./Footer";
import mainlogo from "./Logo.png"; // Import the image
import { useTypewriter, Cursor } from 'react-simple-typewriter';

import { Link } from "react-router-dom";

const Home = () => {

  const [franchises, setFranchises] = useState([]);
  useEffect(() => {

    const fetchFranchises = async () => {
      try {
        const organizationsRef = fs.collection('franchise');
        const snapshot = await organizationsRef.get();
        const orgData = snapshot.docs.map(doc => doc.data());
        setFranchises(orgData);
      } catch (error) {
        console.error('Error fetching franchises:', error.message);
      }
    };

    fetchFranchises();
  }, []);

  const [toDisplay] = useTypewriter({
    words: ['Save Lives', 'Provide Shelter', 'Give Food', 'Create Happiness'],
    loop: true,
    typeSpeed: 120,
    deleteSpeed: 50
  });

  return (
    <div className="home">

      <div className="cover">
        <div className="profileText">
          <p className="naam">إيثار</p>
          <p className="tagline">Together We can</p>

          <div className="typewriter">
            {toDisplay}<Cursor cursorStyle='|' />
          </div>

        </div>
        <img className="coverImage"  src="https://source.unsplash.com/1080x720/?poor" alt="=================> Poor Connection!!" />
      </div>
      <p className="aboutheading"  >Welcome To إيثار</p>

      {/*about section*/}
      <div className="about">
        <div className="abouttext">
          إيثار is a non-profitable Charity Organization which helps those in need through various humanitarian initiatives.
          With a dedicated team of volunteers and supporters, we strive to make a meaningful impact in the
          lives of individuals and communities facing adversity.Our mission is to provide essential aid and empower communities
        </div>
        <img src={mainlogo} alt="Example" className="coverImage" />
      </div>


      {/*Impact*/}
      <p className="statheading" >Stats And Numbers</p>
      <div className="numbers">
        <div className="card">
          <div className="title">Total Projects Funded</div>
          <div className="total">50+</div>
        </div>
        <div className="card">
          <div className="title">Total Donations Received</div>
          <div className="total">$500,000+</div>
        </div>
        <div className="card">
          <div className="title">People Helped</div>
          <div className="total">5000+</div>
        </div>

      </div>
      {/*Active franchises*/}
      <p className="aboutheading" >Active Franchises</p>
      <div className="back">
        <div className="table-container">
          <table className="table-body">
            <thead className="head">
              <tr>
                <th>Name</th>
                <th>Address</th>
                <th>City</th>
              </tr>
            </thead>
            <tbody>
              {franchises.map((franchise, index) => (
                <tr key={index}>
                  <td>{franchise.name}</td>
                  <td>{franchise.location}</td>
                  <td>{franchise.city}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/*Continue*/}

      <p className="statheading" >Let's Get Involved</p>
      <div className="continue">
        <p className='getinvolve'>There are many ways to support our cause. Choose how you'd like to make a difference today:</p>
        <Link to="/signup" className="navButton">Donate Now</Link>
        <Link to="/signup" className="navButton">Volunteer Project</Link>
      </div>
      
      <Footer />
      
    </div>
  );
};

export default Home;
