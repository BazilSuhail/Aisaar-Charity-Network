import { useState } from 'react';
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

import { motion } from 'framer-motion';  

const faqData = [
  {
    question: "How do I know my donation is being used effectively?",
    answer:
      "We provide complete transparency through regular updates, financial reports, and impact stories. Every donor receives detailed information about how their contribution is making a difference. You can track the progress of projects you've supported through our donor portal.",
  },
  {
    question: "Can I volunteer for specific projects?",
    answer:
      "We offer various volunteer opportunities both locally and internationally. You can browse available projects on our volunteer portal and apply for those that match your skills and interests. We provide full training and support for all volunteers.",
  },
  {
    question: "What percentage of donations goes directly to causes?",
    answer:
      "85% of all donations go directly to our programs and beneficiaries. The remaining 15% covers essential operational costs including administration, fundraising, and program monitoring to ensure maximum impact and transparency.",
  },
  {
    question: "Do you work in emergency situations?",
    answer:
      "Yes, we have a dedicated emergency response team that mobilizes quickly during natural disasters, conflicts, and humanitarian crises. We maintain emergency funds and partnerships to provide immediate relief when disasters strike.",
  },
  {
    question: "How can I start a fundraising campaign?",
    answer:
      "You can easily create a personal fundraising campaign through our platform. Choose a cause you're passionate about, set your goal, and share your campaign with friends and family. We provide tools and support to help you succeed.",
  },
  {
    question: "Are donations tax-deductible?",
    answer:
      "Yes, Aisaar is a registered 501(c)(3) nonprofit organization. All donations are tax-deductible to the full extent allowed by law. You'll receive a tax receipt for your records after making a donation.",
  },
]

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(null)

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <div className="max-w-5xl mx-auto">
      {faqData.map((faq, index) => (
        <motion.div
          key={index}
          className={`mb-4 bg-green-50 border-[2px] rounded-t-[15px] ${openIndex === index && 'rounded-b-[15px]'} border-green-200 overflow-hidden`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <button
            onClick={() => toggleFAQ(index)}
            className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-green-50 transition-colors"
          >
            <span className="font-semibold text-green-900">{faq.question}</span>
            {openIndex === index ? (
              <FaChevronUp className="text-green-600" />
            ) : (
              <FaChevronDown className="text-green-600" />
            )}
          </button>
          <motion.div
            initial={false}
            animate={{
              height: openIndex === index ? "auto" : 0,
              opacity: openIndex === index ? 1 : 0,
            }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-4 rounded-b-[15px] text-gray-50 font-[600] text-[14px] pt-[8px] bg-green-900 leading-relaxed">{faq.answer}</div>
          </motion.div>
        </motion.div>
      ))}
    </div>
  )
}


export default FAQSection;
