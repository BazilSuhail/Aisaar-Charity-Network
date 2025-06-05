"use client"

import { useEffect, useState } from "react"
import { auth, fs } from "../../Config/Config"
import { useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import {
  FiEdit,
  FiSave,
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiDollarSign,
  FiTrendingUp,
  FiCalendar,
  FiSettings,
  FiLogOut,
  FiX,
  FiCamera,
  FiTarget,
  FiActivity,
} from "react-icons/fi"
import { FaMedal, FaTrophy, FaStar, FaChartLine, FaHandHoldingHeart, FaUsers, FaGlobe, FaHeart } from "react-icons/fa"

const Donor = () => {
  const navigate = useNavigate()
  const [donorData, setDonorData] = useState({})
  const [editMode, setEditMode] = useState(false)
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false)
  const [formData, setFormData] = useState({
    displayName: "",
    email: "",
    phoneNumber: "",
    city: "",
    donations: "",
    idtype: "Donor",
    photoURL: "",
  })

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    const fetchDonorData = async () => {
      try {
        const currentUser = auth.currentUser

        if (currentUser) {
          const donorRef = fs.collection("donors").doc(currentUser.uid)
          const doc = await donorRef.get()

          if (doc.exists) {
            setDonorData(doc.data())
            setFormData({ ...doc.data(), idtype: "Donor" })
          } else {
            console.log("No donor data found")
          }
        }
      } catch (error) {
        console.error("Error fetching donor data:", error.message)
      }
    }
    // Call fetchData when the component mounts or when the authentication state changes
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        fetchDonorData()
      }
    })

    return unsubscribe
  }, [])

  const handleEdit = () => {
    setEditMode(true)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const currentUser = auth.currentUser

      if (currentUser) {
        await fs.collection("donors").doc(currentUser.uid).update(formData)
        setDonorData(formData)
        setEditMode(false)
      }
    } catch (error) {
      console.error("Error updating donor data:", error.message)
    }
  }

  const gotoTransactionHistory = () => {
    navigate("/transactionhistory")
  }

  const openAvatarModal = () => {
    setIsAvatarModalOpen(true)
  }

  const closeAvatarModal = () => {
    setIsAvatarModalOpen(false)
  }

  const selectAvatar = (index) => {
    setFormData((prevData) => ({
      ...prevData,
      photoURL: index,
    }))
    closeAvatarModal()
  }

  // Helper functions
  const getDonorLevel = (amount) => {
    const numAmount = Number.parseInt(amount?.toString().replace(/,/g, "") || "0")
    if (numAmount >= 10000) return { level: "Platinum", icon: FaTrophy, color: "text-green-600" }
    if (numAmount >= 5000) return { level: "Gold", icon: FaMedal, color: "text-green-500" }
    if (numAmount >= 1000) return { level: "Silver", icon: FaStar, color: "text-green-400" }
    return { level: "Bronze", icon: FaHeart, color: "text-green-300" }
  }

  const donorLevel = getDonorLevel(donorData.donations)

  // Sample impact metrics (you can replace with real data)
  const impactMetrics = [
    { icon: FaUsers, label: "Lives Impacted", value: "1,247", color: "text-green-600", bg: "bg-green-50" },
    { icon: FaGlobe, label: "Countries Reached", value: "5", color: "text-green-500", bg: "bg-green-50" },
    { icon: FaHandHoldingHeart, label: "Projects Supported", value: "8", color: "text-green-400", bg: "bg-green-50" },
    { icon: FaChartLine, label: "Impact Score", value: "95%", color: "text-green-700", bg: "bg-green-50" },
  ]

  // Sample recent donations (you can replace with real data)
  const recentDonations = [
    { id: 1, project: "Clean Water Initiative", amount: 500, date: "2024-01-15", status: "Completed" },
    { id: 2, project: "Education for All", amount: 250, date: "2024-01-10", status: "Completed" },
    { id: 3, project: "Emergency Relief Fund", amount: 1000, date: "2024-01-05", status: "Processing" },
  ]

  return (
    <div className="min-h-screen pt-[80px] bg-green-50">
      {/* Header */}
      <div className="border-green-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                <FaHandHoldingHeart className="text-white text-xl" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-green-900">Donor Dashboard</h1>
                <p className="text-green-600">Welcome back, {formData.displayName || "Donor"}</p>
              </div>
            </div>
            
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        {/* Profile Header Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-green-950 via-green-900 to-green-800 rounded-2xl p-8 mb-8 text-white"
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center space-x-6 mb-6 lg:mb-0">
              <div className="relative">
                <img
                  src={`/Assets/${formData.photoURL}.jpg`}
                  alt="Profile Avatar"
                  className="w-24 h-24 lg:w-32 lg:h-32 rounded-full border-4 border-white shadow-lg"
                />
                {editMode && (
                  <button
                    onClick={openAvatarModal}
                    className="absolute -bottom-2 -right-2 bg-white text-green-600 p-2 rounded-full shadow-lg hover:bg-green-50 transition-colors"
                  >
                    <FiCamera className="w-4 h-4" />
                  </button>
                )}
              </div>
              <div>
                <h2 className="text-3xl font-bold mb-2">{formData.displayName || "Donor Name"}</h2>
                <p className="text-green-100 mb-1">Member since {donorData.joinDate || "Recently"}</p>
                <div className="flex items-center space-x-2">
                  <donorLevel.icon className="text-yellow-300" />
                  <span className="text-green-100">{donorLevel.level} Donor</span>
                </div>
              </div>
            </div>

            <div className="bg-white bg-opacity-20 rounded-xl p-6 text-center backdrop-blur-sm">
              <div className="flex items-center justify-center mb-2">
                <div>
                  <div className="flex items-center justify-center">
                    <FiDollarSign className="text-3xl mr-1" />
                    <span className="text-4xl font-bold">
                      {(donorData.donations || 0).toLocaleString()}
                    </span>

                  </div>
                  <p className="text-green-100 mt-[8px]">Total Donated</p>
                </div>
              </div> 
            </div>
          </div>
        </motion.div>

        {/* Impact Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {impactMetrics.map((metric, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-green-100"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${metric.bg}`}>
                  <metric.icon className={`text-xl ${metric.color}`} />
                </div>
                <FiActivity className="text-green-400" />
              </div>
              <h3 className="text-2xl font-bold text-green-900 mb-1">{metric.value}</h3>
              <p className="text-green-600 text-sm">{metric.label}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Information */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-sm border border-green-100"
            >
              <div className="p-6 border-b border-green-100">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-green-900">Profile Information</h3>
                  {!editMode ? (
                    <button
                      onClick={handleEdit}
                      className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <FiEdit className="w-4 h-4" />
                      <span>Edit Profile</span>
                    </button>
                  ) : (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          setEditMode(false)
                          setFormData(donorData)
                        }}
                        className="px-4 py-2 border border-green-300 text-green-700 rounded-lg hover:bg-green-50 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSubmit}
                        className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      >
                        <FiSave className="w-4 h-4" />
                        <span>Save</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-6">
                {!editMode ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-center space-x-4 p-4 bg-green-50 rounded-lg">
                      <div className="p-3 bg-green-100 rounded-lg">
                        <FiUser className="text-green-600 w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm text-green-600">Full Name</p>
                        <p className="font-semibold text-green-900">{donorData.displayName || "Not provided"}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4 p-4 bg-green-50 rounded-lg">
                      <div className="p-3 bg-green-100 rounded-lg">
                        <FiMail className="text-green-600 w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm text-green-600">Email Address</p>
                        <p className="font-semibold text-green-900">{donorData.email || "Not provided"}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4 p-4 bg-green-50 rounded-lg">
                      <div className="p-3 bg-green-100 rounded-lg">
                        <FiPhone className="text-green-600 w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm text-green-600">Phone Number</p>
                        <p className="font-semibold text-green-900">{donorData.phoneNumber || "Not provided"}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4 p-4 bg-green-50 rounded-lg">
                      <div className="p-3 bg-green-100 rounded-lg">
                        <FiMapPin className="text-green-600 w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm text-green-600">Location</p>
                        <p className="font-semibold text-green-900">{donorData.city || "Not provided"}</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-green-700 mb-2">Full Name</label>
                        <input
                          type="text"
                          name="displayName"
                          value={formData.displayName}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-green-700 mb-2">Email Address</label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-green-700 mb-2">Phone Number</label>
                        <input
                          type="tel"
                          name="phoneNumber"
                          value={formData.phoneNumber}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-green-700 mb-2">City</label>
                        <input
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </form>
                )}
              </div>
            </motion.div>
          </div>

          {/* Quick Actions & Recent Activity */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-sm p-6 border border-green-100"
            >
              <h3 className="text-lg font-semibold text-green-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full flex items-center space-x-3 p-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors">
                  <FiDollarSign className="w-5 h-5" />
                  <span>Make a Donation</span>
                </button>
                <button
                  onClick={gotoTransactionHistory}
                  className="w-full flex items-center space-x-3 p-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors"
                >
                  <FiCalendar className="w-5 h-5" />
                  <span>View Transaction History</span>
                </button>
                <button className="w-full flex items-center space-x-3 p-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors">
                  <FiTarget className="w-5 h-5" />
                  <span>Browse Projects</span>
                </button>
              </div>
            </motion.div>

            {/* Recent Donations */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-sm p-6 border border-green-100"
            >
              <h3 className="text-lg font-semibold text-green-900 mb-4">Recent Donations</h3>
              <div className="space-y-4">
                {recentDonations.map((donation) => (
                  <div key={donation.id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div>
                      <p className="font-medium text-green-900 text-sm">{donation.project}</p>
                      <p className="text-green-600 text-xs">{donation.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-green-600">${donation.amount}</p>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${donation.status === "Completed"
                            ? "bg-green-100 text-green-800"
                            : "bg-green-200 text-green-700"
                          }`}
                      >
                        {donation.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <button   onClick={gotoTransactionHistory} className="w-full mt-4 text-green-600 hover:text-green-700 text-sm font-medium">
                View All Donations
              </button>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Avatar Selection Modal */}
      <AnimatePresence>
        {isAvatarModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-6 max-w-md w-full"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-green-900">Choose Avatar</h3>
                <button
                  onClick={closeAvatarModal}
                  className="p-2 text-green-400 hover:text-green-600 transition-colors"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {Array.from({ length: 4 }).map((_, index) => (
                  <button key={index} onClick={() => selectAvatar(index + 1)} className="relative group">
                    <img
                      src={`/Assets/${index + 1}.jpg`}
                      alt={`Avatar ${index + 1}`}
                      className="w-full aspect-square rounded-xl border-2 border-green-200 group-hover:border-green-500 transition-colors"
                    />
                    <div className="absolute inset-0 bg-green-600 bg-opacity-0 group-hover:bg-opacity-10 rounded-xl transition-all" />
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Donor
