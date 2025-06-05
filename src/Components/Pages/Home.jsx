import { useState, useEffect } from 'react';
import { fs } from '../../Config/Config';
import coverImage from "../Styles/photos/coverimage.webp";
import aboutImage from "../Styles/photos/AboutImg.png";
import { FaChevronDown, FaHandHoldingHeart, FaHandsHelping, FaQuestionCircle, FaQuoteLeft, FaQuoteRight, FaRegComments, FaRegHandshake, FaStar, FaUsers } from "react-icons/fa";
import { useTypewriter, Cursor } from 'react-simple-typewriter';
import { useTransform, useScroll } from 'framer-motion';
import { motion } from 'framer-motion';

import { Link } from "react-router-dom";
import { HiCubeTransparent, HiOutlineHeart, HiOutlineBadgeCheck, HiOutlineCurrencyDollar, HiOutlineUsers, HiOutlineLightBulb, HiOutlineClipboardCheck, HiOutlineSparkles } from 'react-icons/hi';

import { TbFileArrowRight } from 'react-icons/tb';
import FAQSection from './faq';



// Components
const Carousel = ({ testimonial }) => {
  const [index, setIndex] = useState(0)
  const [itemsPerView, setItemsPerView] = useState(1)

  useEffect(() => {
    const updateItemsPerView = () => {
      if (window.innerWidth >= 1024) {
        setItemsPerView(3)
      } else if (window.innerWidth >= 640) {
        setItemsPerView(2)
      } else {
        setItemsPerView(1)
      }
    }

    updateItemsPerView()
    window.addEventListener("resize", updateItemsPerView)
    return () => window.removeEventListener("resize", updateItemsPerView)
  }, [])

  const maxIndex = Math.max(0, testimonial.length - itemsPerView)

  const handlePrev = () => {
    setIndex((prev) => (prev === 0 ? maxIndex : prev - 1))
  }

  const handleNext = () => {
    setIndex((prev) => (prev >= maxIndex ? 0 : prev + 1))
  }

  const translateX = -(index * (100 / itemsPerView))

  return (
    <div className="relative mt-16 w-full max-w-7xl mx-auto overflow-hidden px-4">
      <motion.div className="flex" animate={{ x: `${translateX}%` }} transition={{ duration: 0.5, ease: "easeInOut" }}>
        {testimonial.map((item) => (
          <motion.div key={item.id} className="flex-shrink-0 px-4" style={{ flexBasis: `${100 / itemsPerView}%` }}>
            <div className="bg-gradient-to-br from-green-950 to-green-900 flex flex-col h-[350px] rounded-xl p-6">
              <FaQuoteLeft size={30} className="text-green-200 mb-4" />
              <p className="text-green-50 text-sm leading-relaxed flex-grow overflow-hidden">
                {item.feedback.length > 180 ? item.feedback.slice(0, 180) + "..." : item.feedback}
              </p>
              <div className="mt-6 pt-4 border-t border-green-700">
                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-green-600 flex items-center justify-center">
                  <FaUsers className="text-white text-lg" />
                </div>
                <div className="text-white text-lg font-semibold text-center">{item.displayName}</div>
                <div className="text-green-200 text-sm text-center">{item.role}</div>
                <div className="text-green-300 text-xs text-center">{item.location}</div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {maxIndex > 0 && (
        <>
          <button
            onClick={handlePrev}
            className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-white border-[2px] border-green-500 text-green-800 p-3 rounded-full shadow-lg hover:bg-green-50 transition duration-300"
          >
            <FaChevronDown className="rotate-90" size={16} />
          </button>
          <button
            onClick={handleNext}
            className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-white border-[2px] border-green-500 text-green-800 p-3 rounded-full shadow-lg hover:bg-green-50 transition duration-300"
          >
            <FaChevronDown className="-rotate-90" size={16} />
          </button>
        </>
      )}

      {maxIndex > 0 && (
        <div className="flex justify-center mt-8 space-x-2">
          {Array.from({ length: maxIndex + 1 }).map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`w-3 h-3 rounded-full transition-all duration-200 ${i === index ? "bg-green-600 scale-110" : "bg-green-300"
                }`}
            />
          ))}
        </div>
      )}
    </div>
  )
}



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
  },
  {
    id: 7, heading: "Innovation",
    body: "We embrace innovation, using creative solutions to address complex challenges and improve the effectiveness of our programs."
  },
  {
    id: 8, heading: "Partnerships",
    body: "We build strong partnerships with local organizations and other stakeholders to amplify our impact and reach."
  },
  {
    id: 9, heading: "Volunteer Opportunities",
    body: "We offer various volunteer opportunities, allowing individuals to actively contribute to our cause and make a hands-on difference."
  }
];



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

const Home = () => {
  const [testimonials, setTestimonials] = useState([]);

  useEffect(() => {

    //window.scrollTo(0, 0);
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
      case 6:
        return <HiOutlineSparkles size={50} />;
      case 7:
        return <FaRegHandshake size={50} />;
      case 8:
        return <HiOutlineClipboardCheck size={50} />;
      default:
        return null;
    }
  };

  // إيثار

  return (
    <main className="w-full overflow-x-hidden pt-[70px]">
      <section className="grid grid-cols-1 lg:grid-cols-2 w-full mb-[25px] bg-white">
        <div className='w-full h-full'>
          <motion.img className="h-full w-full" src={coverImage} alt="Poor Connection!!"
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
          />
        </div>
        <div className="xl:scale-[1] scale-[0.9] flex md:px-[35px] justify-center flex-col">
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
      <h2 className=" text-md font-[500] mt-[-15px] lg:mt-[15px] text-center mr-[15px] xl:mr-[45px] text-green-900 mb-[75px] lg:mb-8">
        Donate services to people in <span className='text-green-600'>times of need</span>
      </h2>

      <section className="lg:px-4 mt-[-25px]">
        <div className="mx-auto px-3 md:px-0 lg:px-6">
          <div className="flex flex-col md:flex-row items-center justify-center gap-8">

            <div className="md:w-1/2 md:p-8 ">
              <h2 className="text-4xl font-bold mb-6 text-green-600">
                About Us
              </h2>
              <p className="text-lg mb-6 font-[500] text-green-700">
                Aisaar is a comprehensive "Charity Management Network" designed to streamline and optimize the operations of charitable organizations. By offering robust administrative control, Aisaar enables charity administrators to efficiently manage campaigns, donor data, beneficiaries, and financial transactions from a centralized platform. The system simplifies tasks such as tracking donations, managing volunteers, and generating reports, ultimately reducing overhead and ensuring better allocation of resources.
              </p>
              <p className="text-lg font-[500] text-green-700">
                Transparency and accountability are at the core of Aisaar’s mission. The platform enhances donor trust by offering real-time insights into fund allocation, detailed donation histories, and clear audit trails.
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

      <section
        className="relative bg-green-950 w-full px-[15px] md:px-[25px] py-[38px]"
        style={{
          backgroundImage: 'url(" https://templates.envytheme.com/leud/rtl/assets/images/gallery/gallery-4.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-green-950 opacity-80 z-0"></div>

        <div className="relative z-10">
          <h2 className="text-center mb-[45px] text-[45px] font-[700] text-white">
            Why Trust Us
          </h2>

          {/* Grid Section */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-[30px] gap-y-[75px] mb-[55px]">
            {chooseUsData.map((item) => (
              <motion.div
                initial={{ opacity: 0, y: 150 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="flex items-center px-[8px]"
                key={item.id}
              >
                <div className="text-green-100 mr-[15px]">
                  {renderIcon(item.id - 1)}
                </div>
                <div>
                  <h3 className="text-[22px] font-[600] text-green-200">
                    {item.heading}
                  </h3>
                  <p className="text-white text-[15px]">{item.body}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>


      <section className="py-16 mt-[55px] px-6 lg:px-[40px]">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <motion.div
            className="bg-white px-6 py-[25px] md:scale-[0.9] scale-[0.85] rounded-lg border-[2px] border-gray-200 shadow-lg"
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0 }}
          >
            <div className='w-[175px] mb-[20px] mx-auto h-[175px] flex justify-center items-center rounded-full bg-green-900'>
              <FaHandHoldingHeart className="text-white rounded-full text-[105px]" />
            </div>
            <h3 className="text-3xl font-bold text-green-950 text-center mb-2">Easy Donation Process</h3>
            <p className="text-gray-400 font-serif text-center">Donate securely through our website. Every contribution goes directly to projects making a difference.</p>
          </motion.div>

          <motion.div
            className="bg-white px-6 py-[25px] md:scale-[0.9] scale-[0.85] rounded-lg border-[2px] border-gray-200 shadow-lg"
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.07 }}
          >
            <div className='w-[175px] mb-[20px] mx-auto h-[175px] flex justify-center items-center rounded-full bg-green-900'>
              <FaHandsHelping className="text-white rounded-full text-[105px]" />
            </div>
            <h3 className="text-3xl font-bold text-green-950 text-center mb-2">Volunteer Opportunities</h3>
            <p className="text-gray-400 font-serif text-center">Join as a volunteer and make an impact. Apply for projects that match your skills and interests.</p>
          </motion.div>

          <motion.div
            className="bg-white px-6 py-[25px] md:scale-[0.9] scale-[0.85] rounded-lg border-[2px] border-gray-200 shadow-lg"
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            <div className='w-[175px] mb-[20px] mx-auto h-[175px] flex justify-center items-center rounded-full bg-green-900'>
              <FaRegComments className="text-white rounded-full text-[105px]" />
            </div>
            <h3 className="text-3xl font-bold text-green-950 text-center mb-2">Support & Guidance</h3>
            <p className="text-gray-400 font-serif text-center">Our team is here to help you with any questions, 24/7. Together, we make a difference.</p>
          </motion.div>
        </div>
      </section>


      <section className="bg-white mt-[65px] py-12 px-4 md:px-8 lg:px-16 mb-40">
        <h1 className='text-2xl md:text-[45px] text-center font-bold mb-[25px] text-green-800'>Latest Causes</h1>
        <p className='text-lg text-green-800 max-w-2xl mx-auto font-medium text-center mb-[35px]'>
          These critical situations require immediate attention. Your support can make the difference between despair and hope for families in crisis.
        </p>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {causesData.map((cause, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-lg p-4 border border-gray-200"
            >
              {/* Placeholder Image */}
              <div className="w-full h-56 bg-gray-300 rounded-t-lg overflow-hidden">
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
                <div className="w-full bg-gray-200 rounded-full h-3 mt-5 mb-3">
                  <div
                    className="bg-green-500 h-3 rounded-full"
                    style={{ width: `${cause.progress}%` }}
                  ></div>
                </div>
                <p className="text-green-500 font-semibold text-lg">
                  {cause.progress}%
                </p>

                {/* Raised and Goal */}
                <div className="flex justify-between text-gray-700 text-sm mt-[25px] font-medium">
                  <p>
                    Raised: <span className="text-green-700 font-[600] text-[20px]">{cause.raised}</span>
                  </p>
                  <p>
                    Goal: <span className="text-green-700 font-[600] text-[20px]">{cause.goal}</span>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>


      <h1 className='text-2xl md:text-[45px] text-center font-bold mb-[25px] text-green-800'>Testimonials</h1>
      <p className='text-lg text-green-800 font-medium text-center mb-[-35px]'>
        Hear from out Top donors, what they have to say about us.
      </p>
      <Carousel testimonial={testimonials} />



      {/* FAQ Section */}
      <section className="py-16 mt-[50px]">
        <div className="mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              <FaQuestionCircle className="inline mr-3 text-green-600" />
              Frequently Asked Questions
            </h2>
            <p className="text-green-700 font-[600] text-lg max-w-4xl mx-auto">
              At Aisaar, we strongly believe in transparency and open communication. That is why we have gathered answers to the most frequently asked questions from our generous donors and dedicated volunteers.
            </p>
          </motion.div>
          <FAQSection />
        </div>
      </section>

    </main>
  );
};

export default Home;
