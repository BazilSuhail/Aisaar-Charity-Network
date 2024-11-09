import React, { useState, useEffect } from 'react';
import { fs } from '../../Config/Config';
import coverImage from "../Styles/photos/coverimage.png"; // Import the image
import aboutImage from "../Styles/photos/AboutImg.png"; // Import the image
import { FaHandHoldingHeart, FaHandsHelping, FaQuestionCircle, FaQuoteRight, FaRegComments } from "react-icons/fa";
import { useTypewriter, Cursor } from 'react-simple-typewriter';
import { useTransform, useScroll } from 'framer-motion';

import { Link } from "react-router-dom";
import { HiCubeTransparent, HiOutlineHeart, HiOutlineBadgeCheck, HiOutlineCurrencyDollar, HiOutlineUsers, HiOutlineLightBulb } from 'react-icons/hi';

import { motion } from 'framer-motion';
import { AiOutlineLeft, AiOutlineRight } from 'react-icons/ai';
import FAQPage from './faq';
import { TbFileArrowRight } from 'react-icons/tb';


const Carousel = ({ testimonial }) => {
  const [index, setIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(1);

  useEffect(() => {
    const updateItemsPerView = () => {
      if (window.innerWidth >= 1024) {
        setItemsPerView(3);
      } else if (window.innerWidth >= 640) {
        setItemsPerView(2);
      } else {
        setItemsPerView(1);
      }
    };

    updateItemsPerView();
    window.addEventListener("resize", updateItemsPerView);
    return () => window.removeEventListener("resize", updateItemsPerView);
  }, []);

  const handlePrev = () => setIndex((prev) => (prev - 1 + testimonial.length) % testimonial.length);
  const handleNext = () => setIndex((prev) => (prev + 1) % testimonial.length);
  const translateX = -(index * (100 / itemsPerView));

  return (
    <div className="relative mt-[115px] w-full max-w-6xl lg:scale-[1.08] scale-[0.89] md:scale-[0.95] xl:scale-[1.2] mx-auto overflow-hidden">
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
              <h3 className="text-[14px] text-center h-[150px] overflow-hidden font-serif mt-[15px] text-green-50"> {item.feedback.length > 200 ? item.feedback.slice(0, 200) + '...' : item.feedback}</h3>
              <div className='mt-auto mb-[8px]'>
                <div className='w-[50px] h-[50px] mx-auto mb-[6px] rounded-full bg-green-700'></div>
                <div className="text-white text-[18px] text-center">{item.displayName}</div>
                <div className="text-green-200 text-[12px] font-[600]">{item.email}</div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
      <button onClick={handlePrev}
        className="absolute  top-1/2 left-6 transform -translate-y-1/2 bg-green-200 text-green-800 p-2 w-[34px] h-[34px] rounded-full shadow-md flex items-center justify-center hover:bg-green-700 hover:text-white transition duration-300"
      >
        <AiOutlineLeft size={15} />
      </button>
      <button onClick={handleNext}
        className="absolute  top-1/2 right-6 transform -translate-y-1/2 bg-green-200 text-green-800 p-2 w-[34px] h-[34px] rounded-full shadow-md flex items-center justify-center hover:bg-green-700 hover:text-white transition duration-300"
      >
        <AiOutlineRight size={15} />
      </button>
    </div>
  );
};

const chooseUsData = [
  {
    id: 1, heading: "Transparency",
    body: "We believe in transparency. Every donation you make goes directly to the cause, and we ensure detailed reports are available to our donors."
  },
  {
    id: 2, heading: "Impactful Projects",
    body: "Our focus is on impactful projects that bring positive change to communities. We carefully select and support initiatives that make a difference."
  },
  {
    id: 3, heading: "Accountability",
    body: "Accountability is key. We maintain rigorous standards to ensure your contributions are used effectively and responsibly."
  },
  {
    id: 4, heading: "Community Engagement",
    body: "We foster community engagement through our programs, encouraging participation and involvement in social causes."
  },
  {
    id: 5, heading: "Long-Term Sustainability",
    body: "Sustainability is at the heart of our mission. We aim to create lasting impacts that extend beyond immediate solutions."
  },
  {
    id: 6, heading: "Ethical Practices",
    body: "We adhere to ethical practices in all our operations, ensuring integrity and trust in everything we do."
  }
];

const Home = () => {


  const { scrollYProgress } = useScroll();

  const opacity = useTransform(scrollYProgress, [0.15, 0.24], [0, 1]);
  const scale = useTransform(scrollYProgress, [0.15, 0.24], [0.8, 1]);
  const y = useTransform(scrollYProgress, [0.15, 0.24], [20, 0]);

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
        return <HiCubeTransparent size={50} />;
      case 1:
        return <HiOutlineHeart size={50} />;
      case 2:
        return <HiOutlineBadgeCheck size={50} />;
      case 3:
        return <HiOutlineCurrencyDollar size={50} />;
      case 4:
        return <HiOutlineUsers size={50} />;
      case 5:
        return <HiOutlineLightBulb size={50} />;
      default:
        return null;
    }
  };

  const causesData = [
    {
      title: "Ensure Education For Every Poor Children",
      raised: "$20,000",
      goal: "$35,000",
      img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR5c5qVqxZpdDgg7kv9oXX5urao-gtU6MN8iA&s",
      progress: 70,
    },
    {
      title: "Providing Healthy Food For The Children",
      raised: "$20,000",
      goal: "$35,000",
      img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTrjcQy2wRFz4PgcJ-LnWAALHtswSED-eOjTWnx4wGzQeiEiB52WUpxNpH7rI3xC3P8NTU&usqp=CAU",
      progress: 25,
    },
    {
      title: "Supply Drinking Water For The People",
      raised: "$20,000",
      goal: "$35,000",
      img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSTyvIlO9iB-Bt2kp7i8iAusQXv8qfXIjleAXGH2ncehPAnEFIF_u1WINCq-gnUvIxuBKc&usqp=CAU",
      progress: 50,
    },
  ];
  // إيثار

  return (
    <main className="w-full overflow-x-hidden pt-[70px]">
      <section className="grid grid-cols-1 lg:grid-cols-2 w-full mb-[25px] bg-white">
        <div className='w-full h-full'>
          <motion.img className="h-full w-full" src={coverImage} alt="Poor Connection!!"
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
          />
        </div>
        <div className="xl:scale-[1] scale-[0.9] flex px-[35px] justify-center flex-col">
          <motion.h1 className="text-4xl md:text-5xl lg:text-[65px] xl:text-[70px] font-bold text-green-900 mb-4"
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 1 }}>
            Togather We Can <br /> Provide <span className='text-green-600'>{toDisplay}<Cursor cursorStyle='|' /></span>
          </motion.h1>
          <motion.p className="text-green-700  mt-[30px] text-[18px]  mb-2"
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}>
            We at Aisaar are dedicated to empowering communities and creating lasting change. Through transparent, impactful projects in education, healthcare, and sustainability, we work to build a brighter future for those in need. Together, we can make a difference.
          </motion.p>
          <Link to="/listedprojects" className="mt-[25px] scale-[0.9] md:scale-[1] relative w-[160px]  flex items-center justify-start bg-transparent text-black rounded-lg group">
            <div className="absolute h-[38px] w-[38px] rounded-full bg-green-900 transition-all duration-300 ease-in-out group-hover:w-full"></div>
            <span className="relative z-10 ml-[6px] flex items-center"><TbFileArrowRight className='text-green-50 mb-[2px] ml-[1px] group-hover:text-green-400' size={24} /><span className='ml-[12px] group-hover:text-green-100 text-[17px] text-green-800 font-[600]'>Donate Now</span></span>
          </Link>
        </div>
      </section>

      <h2 className=" text-xl font-[500] text-end mr-[15px] xl:mr-[45px] text-green-900 mb-8">
        Donate services to people in <br />
        <span className='text-green-600 ml-[8px]'>times of need</span>
      </h2>
      <section className='lg:px-[55px] w-full xl:px-[200px] sm:scale-[1] scale-[0.8]'>
        <div className="slider" style={{ '--width': '210px', '--height': '132px', '--quantity': 8 }}>
          <div className="list">
            <div className="stack" style={{ '--position': 1 }}><div className='w-[220px] flex flex-col px-[24px] rounded-xl items-center py-[17px]'><img src="https://templates.envytheme.com/leud/rtl/assets/images/partners/partner-1.png" alt="Partner1" /></div></div>
            <div className="stack" style={{ '--position': 2 }}><div className='w-[220px] flex flex-col px-[24px] rounded-xl items-center py-[17px]'><img src="https://templates.envytheme.com/leud/rtl/assets/images/partners/partner-2.png" alt="Partner1" /></div></div>
            <div className="stack" style={{ '--position': 3 }}><div className='w-[220px] flex flex-col px-[24px] rounded-xl items-center py-[17px]'><img src="https://templates.envytheme.com/leud/rtl/assets/images/partners/partner-3.png" alt="Partner1" /></div></div>
            <div className="stack" style={{ '--position': 4 }}><div className='w-[220px] flex flex-col px-[24px] rounded-xl items-center py-[17px]'><img src="https://templates.envytheme.com/leud/rtl/assets/images/partners/partner-4.png" alt="Partner1" /></div></div>
            <div className="stack" style={{ '--position': 5 }}><div className='w-[220px] flex flex-col px-[24px] rounded-xl items-center py-[17px]'><img src="https://templates.envytheme.com/leud/rtl/assets/images/partners/partner-5.png" alt="Partner1" /></div></div>
            <div className="stack" style={{ '--position': 6 }}><div className='w-[220px] flex flex-col px-[24px] rounded-xl items-center py-[17px]'><img src="https://templates.envytheme.com/leud/rtl/assets/images/partners/partner-6.png" alt="Partner1" /></div></div>
            <div className="stack" style={{ '--position': 7 }}><div className='w-[220px] flex flex-col px-[24px] rounded-xl items-center py-[17px]'><img src="https://templates.envytheme.com/leud/rtl/assets/images/partners/partner-7.png" alt="Partner1" /></div></div>
            <div className="stack" style={{ '--position': 8 }}><div className='w-[220px] flex flex-col px-[24px] rounded-xl items-center py-[17px]'><img src="https://templates.envytheme.com/leud/rtl/assets/images/partners/partner-8.png" alt="Partner1" /></div></div>
          </div>
        </div>
      </section>

      <section className="lg:px-4">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-center gap-8">

            <div className="md:w-1/2 md:p-8 ">
              <h2 className="text-4xl font-bold mb-6 text-green-600">
                About Us
              </h2>
              <p className="text-lg mb-6 font-[500] text-green-700">
                Texleath Industries is a leading name in the world of premium clothing. Our dedication to quality and innovation sets us apart. From high-end clothing sales to state-of-the-art manufacturing processes, and a seamless export service, we are committed to excellence at every step.
              </p>
              <p className="text-lg font-[500] text-green-700">
                Founded on the principles of quality and customer satisfaction, we pride ourselves on delivering products that exceed expectations. Our team of experts ensures that every garment meets the highest standards of craftsmanship and style.
              </p>
            </div>
            <div className="md:w-1/2">
              <img
                src={aboutImage}
                alt="Connection Error ..."
                className="w-full h-full scale-[0.7]"
              />
            </div>
          </div>
        </div>
      </section >

      <section className="bg-green-950 w-full px-[15px] md:px-[25px] py-[38px]">
        <h2 className="text-center mb-[45px] text-[45px] font-[700] text-white">Why Trust Us</h2>
        <div className="grid md:grid-cols-2 grid-cols-1 lg:grid-cols-3 gap-x-[30px] gap-y-[55px] mb-[55px]">
          {chooseUsData.map((item) => (
            <motion.div
              className="flex items-center px-[8px]"
              style={{ scale, y, opacity }}
              key={item.id}
            >
              <div className='text-green-100 mr-[15px]'>{renderIcon(item.id - 1)}</div>
              <div>
                <h3 className="text-[22px] font-[600] text-green-200">{item.heading}</h3>
                <p className="text-white text-[15px]">{item.body}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="bg-white mt-[65px] py-12 px-4 md:px-8 lg:px-16">
        <h2 className="text-3xl font-bold text-center text-green-900 mb-8">
          Explore Our Latest Causes <br /> That We Work For
        </h2>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {causesData.map((cause, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-lg p-4 border border-gray-200"
            >
              {/* Placeholder Image */}
              <div className="w-full h-48 bg-gray-300 rounded-t-lg overflow-hidden">
                <img
                  src={cause.img}
                  alt="Cause placeholder"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Cause Content */}
              <div className="p-4">
                <h3 className="text-xl font-semibold text-green-900 mb-2">
                  {cause.title}
                </h3>

                {/* Progress Bar */}
                <div className="w-full bg-gray-200 rounded-full h-3 mb-3">
                  <div
                    className="bg-green-500 h-3 rounded-full"
                    style={{ width: `${cause.progress}%` }}
                  ></div>
                </div>
                <p className="text-green-500 font-semibold text-sm mb-2">
                  {cause.progress}%
                </p>

                {/* Raised and Goal */}
                <div className="flex justify-between text-gray-700 text-sm font-medium">
                  <p>
                    Raised: <span className="text-black">{cause.raised}</span>
                  </p>
                  <p>
                    Goal: <span className="text-black">{cause.goal}</span>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="py-16 mt-[55px] px-6 lg:px-[100px]">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white px-6 pb-[15px] md:scale-[0.9] scale-[0.85] rounded-lg shadow-lg">
            <div className='w-[175px] mt-[-70px] mb-[20px] mx-auto h-[175px] flex justify-center items-center rounded-full bg-green-900'>
              <FaHandHoldingHeart className="text-white rounded-full text-[105px]" />
            </div>
            <h3 className="text-3xl font-bold text-green-950 text-center mb-2">Easy Donation Process</h3>
            <p className="text-gray-400 font-serif text-center">Donate securely through our website. Every contribution goes directly to projects making a difference.</p>
          </div>

          <div className="bg-white px-6 pb-[15px] md:scale-[0.9] scale-[0.85] rounded-lg shadow-lg">
            <div className='w-[175px] md:mt-[-70px] mb-[20px] mx-auto h-[175px] flex justify-center items-center rounded-full bg-green-900'>
              <FaHandsHelping className="text-white rounded-full text-[105px]" />
            </div>
            <h3 className="text-3xl font-bold text-green-950 text-center mb-2">Volunteer Opportunities</h3>
            <p className="text-gray-400 font-serif text-center">Join as a volunteer and make an impact. Apply for projects that match your skills and interests.</p>
          </div>

          <div className="bg-white px-6 pb-[15px] md:scale-[0.9] scale-[0.85] rounded-lg shadow-lg">
            <div className='w-[175px] md:mt-[-70px] mb-[20px] mx-auto h-[175px] flex justify-center items-center rounded-full bg-green-900'>
              <FaRegComments className="text-white rounded-full text-[105px]" />
            </div>
            <h3 className="text-3xl font-bold text-green-950 text-center mb-2">Support & Guidance</h3>
            <p className="text-gray-400 font-serif text-center">Our team is here to help you with any questions, 24/7. Together, we make a difference.</p>
          </div>
        </div>
      </section>

      <h1 className='text-2xl md:text-[45px] text-center font-bold mb-[25px] text-green-800'>Testimonials</h1>
      <p className='text-lg text-green-800 font-medium text-center mb-[-35px]'>
        Hear from out Top donors, what they have to say about us.
      </p>
      <Carousel testimonial={testimonials} />



      <section>
        <div className='xl:px-[78px] md:px-[25px] px-[15px] mt-[85px]'>
          <h1 className='text-2xl md:text-3xl font-bold mb-6 text-green-700'>
            <FaQuestionCircle className='inline mr-2' />
            Frequently Asked Questions
          </h1>
          <div className='h-[3px] w-[89%] mb-[28px] bg-green-800 '></div>
          <p className='text-lg text-green-800 font-medium mb-6'>
            Welcome to the FAQ section of Texleath Industries. Here you'll find answers to common questions about our products, services, and policies. If you have any other inquiries, feel free to reach out to our customer support team.
          </p>
        </div>
        <div className='grid mt-[85px] xl:px-[85px] lg:grid-cols-2'>
          <div className="flex items-center  justify-center overflow-hidden">
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT9S0cJrYw26C5lag_cvgFY7sVKCJFspo6uJCUaH6BWaqEvQHCSv_g5cHY19_YOFoJykTg&usqp=CAU"
              alt="Placeholder"
              className="w-[450px] mt-[-45px] h-[360px] rounded-lg"
            />
          </div>
          <FAQPage />
        </div>
      </section>

      <section className="border-[3px] border-green-950 xl:mx-[80px] mt-[35px] rounded-[6px] text-white py-16 px-6 md:px-10 lg:px-20 flex items-center justify-between">
        <div className="text-center md:text-left">
          <h1 className="text-xl text-green-900 md:text-4xl font-bold mb-4">Let's Change The World<b /> With Humanity</h1>
        </div>
        <div className="mt-4 md:mt-0">
          <Link to="/signup" className="inline-block bg-white text-green-700 font-semibold py-2 px-6 rounded-lg hover:bg-gray-100">
            Become A Volunteer
          </Link>
        </div>
      </section>

    </main>
  );
};

export default Home;
