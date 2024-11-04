import React, { useState, useEffect } from 'react';
import { fs } from '../../Config/Config';
import coverImage from "../Styles/photos/coverimage.jpg"; // Import the image
import { FaQuoteRight } from "react-icons/fa";
import { useTypewriter, Cursor } from 'react-simple-typewriter';


import { useTransform, useScroll } from 'framer-motion';

import { Link } from "react-router-dom";
import { HiCubeTransparent, HiOutlineHeart, HiOutlineBadgeCheck, HiOutlineCurrencyDollar, HiOutlineUsers, HiOutlineLightBulb } from 'react-icons/hi';


import { motion } from 'framer-motion';
import { AiOutlineLeft, AiOutlineRight } from 'react-icons/ai';
import FAQPage from './faq';

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
    <div className="relative w-full max-w-6xl lg:scale-[1.08] scale-[0.89] md:scale-[0.95] xl:scale-[1.2] mx-auto overflow-hidden">
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
            className="flex-shrink-0 w-full sm:w-1/2 lg:w-1/3 px-4"
            style={{ flexBasis: `${100 / itemsPerView}%` }}
          >
            <div className="bg-green-950 flex flex-col items-center h-[355px] rounded-lg p-6">
              <FaQuoteRight size={35} className='text-green-200 mx-auto' />
              <h3 className="text-[14px] text-center font-serif mt-[15px] text-green-50">{item.feedback}</h3>
              <div className='mt-auto mb-[8px]'>
                <div className='w-[50px] h-[50px] mx-auto mb-[6px] rounded-full bg-green-700'></div>
                <div className="text-white text-[18px] text-center">{item.displayName}</div>
                <div className="text-green-200 text-[12px] font-[600]">{item.email}</div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Navigation Buttons */}
      <button
        onClick={handlePrev}
        className="absolute  top-1/2 left-6 transform -translate-y-1/2 bg-white text-green-800 p-2 w-[40px] h-[40px] rounded-full shadow-md flex items-center justify-center hover:bg-green-700 hover:text-white transition duration-300"
      >
        <AiOutlineLeft size={20} />
      </button>
      <button
        onClick={handleNext}
        className="absolute  top-1/2 right-6 transform -translate-y-1/2 bg-white text-green-800 p-2 w-[40px] h-[40px] rounded-full shadow-md flex items-center justify-center hover:bg-green-700 hover:text-white transition duration-300"
      >
        <AiOutlineRight size={20} />
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
    words: ['Shelter', 'Food', 'Happiness', 'Support'],
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
  // إيثار

  return (
    <div className="w-full. overflow-x-hidden pt-[80px]">

      <section className="grid w-full overflow-x-hidden h-[90vh] lg:grid-cols-2 grid-cols-1">
        <div className="flex items-center justify-center flex-col">
          <div>
            <motion.div
              className="font-[800] text-[75px] text-green-800"
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 1 }}
            >
              Together We
              <div className='text-green-700 mt-[-15px]'>Can Provide</div>

            </motion.div>
            <motion.div
              className="font-[800] text-[65px] text-green-950"
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
            >
              {toDisplay}
              <Cursor cursorStyle='|' />
            </motion.div>

          </div>
        </div>
        <motion.img className="coverImage" src={coverImage} alt="Poor Connection!!"
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
        />
      </section>



      <section className="bg-green-950 w-full px-[15px] md:px-[25px] py-[38px]">
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
      <div className='grid grid-cols-2'>
        <div></div>
        <FAQPage />
      </div>
      {/*Testimonial 

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
      */}

      {/*Continue*/}

      <p className="aboutheading" >Let's Get Involved</p>
      <div className="continue">
        <p className='getinvolve'>There are many ways to support our cause. Choose how you'd like to make a difference today:</p>
        <Link to="/signup" className="navButton">Donate Now</Link>
        <Link to="/signup" className="navButton">Volunteer Project</Link>
      </div>
    </div>
  );
};

export default Home;
