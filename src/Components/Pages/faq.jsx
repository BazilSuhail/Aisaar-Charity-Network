import React, { useState } from 'react';
import { FaQuestionCircle, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const faqs = [
    {
        question: "How can I donate to support your initiatives?",
        answer: "You can donate through our website by selecting the 'Donate' button and choosing a preferred donation amount. We accept various payment methods, and all contributions go directly toward funding our projects and helping those in need."
    },
    {
        question: "Can I volunteer for your projects?",
        answer: "Absolutely! We welcome volunteers for our various projects. You can register as a volunteer on our website, browse available projects, and apply. Once approved, you will be notified and can begin contributing your time and skills."
    },
    {
        question: "What kind of projects do you support?",
        answer: "We support a wide range of projects focusing on education, healthcare, poverty alleviation, and environmental sustainability. Each project is designed to make a positive impact and is driven by our mission to create lasting change in underserved communities."
    },
    {
        question: "How can I register as a volunteer?",
        answer: "To register as a volunteer, simply create an account on our website and complete the volunteer registration form. Once registered, you’ll have access to our project listings and can apply to participate in any projects of interest."
    },
    {
        question: "Are there any requirements to volunteer?",
        answer: "We require volunteers to be at least 18 years old. Some projects may have additional requirements based on the type of work involved. Detailed requirements are listed on each project’s page, so please review them before applying."
    },
    {
        question: "Can I donate to a specific project?",
        answer: "Yes, you can choose to direct your donation to a specific project if you wish. During the donation process, select the project you would like to support from the available list, and your contribution will be allocated accordingly."
    }
];


const FAQPage = () => {
    const [openIndex, setOpenIndex] = useState(null);
 

    const handleToggle = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className='py-8 px-4 md:px-8'>
            <div className='p-6'>
                <h1 className='text-2xl md:text-3xl font-bold mb-6 text-green-700'>
                    <FaQuestionCircle className='inline mr-2' />
                    Frequently Asked Questions
                </h1>

            
                <div className='h-[3px] w-[89%] mb-[28px] bg-green-800 '></div>
                
                <p className='text-lg text-green-800 font-medium mb-6'>
                    Welcome to the FAQ section of Texleath Industries. Here you'll find answers to common questions about our products, services, and policies. If you have any other inquiries, feel free to reach out to our customer support team.
                </p>
                <div>
                    {faqs.map((faq, index) => (
                        <div key={index} className='mb-4'>
                            <button
                                className='w-full text-left text-lg font-semibold text-green-800 py-2 px-4 bg-green-100 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 flex items-center justify-between'
                                onClick={() => handleToggle(index)}
                                type='button'
                            >
                                <span>{faq.question}</span>
                                <motion.div
                                    initial={{ scale: 1.2 }}
                                    animate={{ scale: openIndex === index ? 0.8 : 1.2 }}
                                    transition={{ duration: 0.5 }}
                                    className='text-green-800'
                                >
                                    {openIndex === index ? <FaChevronUp /> : <FaChevronDown />}
                                </motion.div>
                            </button>
                            <AnimatePresence>
                                {openIndex === index && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className='mt-2 px-4'
                                    >
                                        <p className='text-green-700'>{faq.answer}</p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default FAQPage;
