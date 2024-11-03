import React, { useState, useEffect } from 'react';
import { fs } from '../../Config/Config';
import "./home.css";
import "../Styles/tables.css";
import Footer from "../Pages/Footer";
import mainlogo from "../Logo.png"; // Import the image
import coverImage from "../Styles/photos/coverimage.jpg"; // Import the image
import { FaQuoteLeft, FaQuoteRight } from "react-icons/fa";
import { useTypewriter, Cursor } from 'react-simple-typewriter';

import "./testimonialCarousel.css";

import { useTransform, useScroll } from 'framer-motion';

import { Link } from "react-router-dom";
import { HiCubeTransparent, HiOutlineHeart, HiOutlineBadgeCheck, HiOutlineCurrencyDollar, HiOutlineUsers, HiOutlineLightBulb } from 'react-icons/hi';


import { motion } from 'framer-motion';

// Sample data for the carousel
const carouselData = [
  { id: 1, title: "Slide 1", description: "Description for slide 1" },
  { id: 2, title: "Slide 2", description: "Description for slide 2" },
  { id: 3, title: "Slide 3", description: "Description for slide 3" },
  { id: 4, title: "Slide 4", description: "Description for slide 4" },
  { id: 5, title: "Slide 5", description: "Description for slide 5" },
  { id: 6, title: "Slide 6", description: "Description for slide 6" },
];

const Carousel = ({ testimonial }) => {
  const [index, setIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(1);

  useEffect(() => {
    // Function to calculate items per view based on screen width
    const updateItemsPerView = () => {
      if (window.innerWidth >= 1024) {
        setItemsPerView(3); // Large screens
      } else if (window.innerWidth >= 640) {
        setItemsPerView(2); // Medium screens
      } else {
        setItemsPerView(1); // Small screens
      }
    };

    // Initial check and add event listener for window resize
    updateItemsPerView();
    window.addEventListener("resize", updateItemsPerView);
    return () => window.removeEventListener("resize", updateItemsPerView);
  }, []);

  // Handle next and previous for wrapping effect
  const handlePrev = () => setIndex((prev) => (prev - 1 + carouselData.length) % carouselData.length);
  const handleNext = () => setIndex((prev) => (prev + 1) % carouselData.length);

  // Calculate the translation percentage based on items per view
  const translateX = -(index * (100 / itemsPerView));

  return (
    <div className="relative w-full max-w-6xl mx-auto overflow-hidden">
      {/* Carousel Content */}
      <motion.div
        className="flex"
        initial={{ x: `${translateX}%` }}
        animate={{ x: `${translateX}%` }}
        transition={{ duration: 0.5 }}
      >
        {testimonial.map((item) => (
          <motion.div
            key={item.id}
            className="flex-shrink-0 w-full sm:w-1/2 lg:w-1/3 px-2"
            style={{ flexBasis: `${100 / itemsPerView}%` }}
          >
            <div className="bg-white h-[285px] shadow-lg rounded-lg p-6 text-center">
              <h3 className="text-xl font-bold mb-2">{item.title}</h3>
              <p className="text-gray-600">{item.feedback}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Navigation Buttons */}
      <button
        onClick={handlePrev}
        className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-green-950 p-2 w-[35px] h-[35px] rounded-full shadow-md"
      >
        &lt;
      </button>
      <button
        onClick={handleNext}
        className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md"
      >
        &gt;
      </button>
    </div>
  );
};


const chooseUsData = [
  {
    heading: "Transparency",
    body: "We believe in transparency. Every donation you make goes directly to the cause, and we ensure detailed reports are available to our donors."
  },
  {
    heading: "Impactful Projects",
    body: "Our focus is on impactful projects that bring positive change to communities. We carefully select and support initiatives that make a difference."
  },
  {
    heading: "Accountability",
    body: "Accountability is key. We maintain rigorous standards to ensure your contributions are used effectively and responsibly."
  },
  {
    heading: "Community Engagement",
    body: "We foster community engagement through our programs, encouraging participation and involvement in social causes."
  },
  {
    heading: "Long-Term Sustainability",
    body: "Sustainability is at the heart of our mission. We aim to create lasting impacts that extend beyond immediate solutions."
  },
  {
    heading: "Ethical Practices",
    body: "We adhere to ethical practices in all our operations, ensuring integrity and trust in everything we do."
  }
];

const Home = () => {

  const [franchises, setFranchises] = useState([]);


  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0.28, 0.36], [0, 1]);
  const scale = useTransform(scrollYProgress, [0.28, 0.36], [0.8, 1]);
  const y = useTransform(scrollYProgress, [0.28, 0.36], [20, 0]);

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
  const renderIcon = (index) => {
    switch (index) {
      case 0:
        return <HiCubeTransparent className='choose-icon' />;
      case 1:
        return <HiOutlineHeart className='choose-icon' />;
      case 2:
        return <HiOutlineBadgeCheck className='choose-icon' />;
      case 3:
        return <HiOutlineCurrencyDollar className='choose-icon' />;
      case 4:
        return <HiOutlineUsers className='choose-icon' />;
      case 5:
        return <HiOutlineLightBulb className='choose-icon' />;
      default:
        return null;
    }
  };
  return (
    <div className="home pt-[80px]">

      <section className="cover">
        <div className="profileText">
          <motion.p
            className="naam"
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 1 }}
          >
            إيثار
          </motion.p>
          <motion.p
            className="tagline"
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            Together We can
          </motion.p>
          <motion.div
            className="typewriter"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
          >
            {toDisplay}
            <Cursor cursorStyle='|' />
          </motion.div>
        </div>
        <motion.img
          className="coverImage"
          src={coverImage}
          alt="Poor Connection!!"
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
        />
      </section>

      <p className="aboutheading"  >Welcome To إيثار</p>
      {/*about section*/}
      <section className="about">
        <div className="abouttext">
          إيثار is a non-profitable Charity Organization which helps those in need through various humanitarian initiatives.
          With a dedicated team of volunteers and supporters, we strive to make a meaningful impact in the
          lives of individuals and communities facing adversity.Our mission is to provide essential aid and empower communities
        </div>
        <img src={mainlogo} alt="Example" className="coverImage" />
      </section>

      <section className="bg-green-950 px-[15px] md:px-[25px] py-[38px]"> 
          <h2 className="text-center mb-[45px] text-[45px] font-[700] text-white">Why Trust Us</h2> 
        <div className="grid md:grid-cols-2 grid-cols-1 lg:grid-cols-3 gap-x-[30px] gap-y-[55px] mb-[55px]">
          {chooseUsData.map((item, index) => (
            <motion.div
              className="flex items-center px-[8px]"
              style={{ scale, y, opacity }}
              key={index}
            >
              <div className='scale-[1.2] mr-[15px]'>{renderIcon(index)}</div>
              <div>
              <h3 className="text-[22px] font-[600] text-green-200">{item.heading}</h3>
              <p className="text-white text-[15px]">{item.body}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/*Franchises */}
      <p className="aboutheading" >Active Franchises</p>
      <section className="back">
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
      </section>


      <Carousel testimonial={testimonials} />
      {/*Testimonial */}

      <p className="otherheading">Top Donor's Testimonials</p>
      <div className="testimonial-carousel-container">
        <div className="testimonial-carousel-wrapper">
          <div className="testimonial-carousel">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                className="testimonial-item"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="left-comma">
                  <FaQuoteLeft />
                </div>
                <div className="testimonial-feedback">
                  <b>{testimonial.feedback}</b>
                </div>
                <div className="right-comma">
                  <FaQuoteRight />
                </div>
                <div className="testimonial-info">
                  <div className="testimonial-name">{testimonial.displayName}</div>
                  <div className="testimonial-email">{testimonial.email}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
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
