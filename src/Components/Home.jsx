import React, { useState, useEffect } from 'react';
import { fs } from '../Config/Config';
import "./Styles/home.css";
import "./Styles/tables.css";
import Footer from "./Footer";
import mainlogo from "./Logo.png"; // Import the image
import coverImage from "../Components/Styles/photos/coverimage.jpg"; // Import the image
import { FaQuoteLeft, FaQuoteRight } from "react-icons/fa";
import { useTypewriter, Cursor } from 'react-simple-typewriter';

import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

import "./Styles/testimonialCarousel.css";

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


  const [testimonials, setTestimonials] = useState([]);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const donorsSnapshot = await fs.collection("donors").get();
        const testimonialData = await Promise.all(donorsSnapshot.docs.map(async (doc) => {
          const donorData = doc.data();
          const testimonialDoc = await fs.collection("testimonials").doc(doc.id).get();
          if (testimonialDoc.exists && testimonialDoc.data().testimonialData.length > 0) {
            const data = testimonialDoc.data().testimonialData;
            const randomTestimonial = data[Math.floor(Math.random() * data.length)];
            return {
              displayName: donorData.displayName,
              email: donorData.email,
              feedback: randomTestimonial.feedback,
            };
          }
          return null;
        }));

        setTestimonials(testimonialData.filter(testimonial => testimonial !== null));
      } catch (error) {
        console.error("Error fetching testimonials:", error);
      }
    };

    fetchTestimonials();
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
        {/*
        <img className="coverImage" src="https://source.unsplash.com/1080x720/?poor" alt="=================> Poor Connection!!" />*/}
        <img className="coverImage" src={coverImage} alt= "Poor Connection!!" />
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

      {/*Franchises */}
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
      {/*Testimonial */}

      <p className="statheading">Top Donor's Testimonials</p>

      <div className="testimonial-carousel-container">
        <Carousel showArrows={true} showThumbs={false} infiniteLoop={true} autoPlay={true} interval={10000}>
          {testimonials.map((testimonial, index) => (
            <div key={index} className="testimonial-item">
              <FaQuoteLeft className='left-comma' />
              <div className="testimonial-feedback"><b>{testimonial.feedback}</b></div>
              <FaQuoteRight className='right-comma' />
              <div className="testimonial-info">
                <div className="testimonial-name">{testimonial.displayName}</div>
                <div className="testimonial-email">{testimonial.email}</div>
              </div>
            </div>
          ))}
        </Carousel>
      </div>

      {/*Continue*/}

      <p className="aboutheading" >Let's Get Involved</p>
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
