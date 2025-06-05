"use client"

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { auth, fs } from "../../Config/Config"
import { motion, AnimatePresence } from "framer-motion"
import {
  FiEdit,
  FiSave,
  FiUser,
  FiMail,
  FiPhone,
  FiSettings,
  FiLogOut,
  FiX,
  FiCamera,
  FiActivity,
  FiCalendar,
  FiFileText,
  FiCreditCard,
  FiHome,
  FiBriefcase,
  FiPlus,
  FiEye,
  FiCheckCircle,
  FiClock,
  FiAlertCircle,
} from "react-icons/fi"
import {
  FaHandsHelping,
  FaUsers,
  FaProjectDiagram,
  FaClipboardList,
  FaTasks,
  FaAward,
  FaStar,
  FaChartLine,
} from "react-icons/fa"

const Volunteer = () => {
  const navigate = useNavigate()
  const [volunteerData, setVolunteerData] = useState({})
  const [editMode, setEditMode] = useState(false)
  const [projects, setProjects] = useState([])
  const [appliedProjects, setAppliedProjects] = useState([])
  const [isProjectsModalOpen, setIsProjectsModalOpen] = useState(false)
  const [isAppliedProjectsModalOpen, setIsAppliedProjectsModalOpen] = useState(false)
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false)
  const [selectedAvatar, setSelectedAvatar] = useState(null)

  const [formData, setFormData] = useState({
    displayName: "",
    email: "",
    address: "",
    phoneNumber: "",
    dob: "",
    cnic: "",
    idtype: "Volunteer",
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const currentUser = auth.currentUser
        if (currentUser) {
          const volunteerRef = fs.collection("volunteer").doc(currentUser.uid)
          const volunteerDoc = await volunteerRef.get()
          if (volunteerDoc.exists) {
            const volunteerData = volunteerDoc.data()
            setVolunteerData(volunteerData)
            setFormData({ ...volunteerData, idtype: "Volunteer" })
          } else {
            console.log("No volunteer data found")
          }

          const projectsRef = fs.collection("projects").where("volunteerID", "==", currentUser.uid)
          const projectsSnapshot = await projectsRef.get()
          const projectsData = projectsSnapshot.docs.map((doc) => doc.data())
          setProjects(projectsData)

          const appliedProjectsRef = fs.collection("proposedProjects").where("volunteerID", "==", currentUser.uid)
          const appliedProjectsSnapshot = await appliedProjectsRef.get()
          const appliedProjectsData = appliedProjectsSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
          setAppliedProjects(appliedProjectsData)
        }
      } catch (error) {
        console.error("Error fetching data:", error.message)
      }
    }

    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        fetchData()
      }
    })

    return unsubscribe
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    console.log(formData)
    setFormData({ ...formData, [name]: value, photoURL: selectedAvatar })
  }

  const handleEdit = () => {
    setEditMode(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const currentUser = auth.currentUser
      if (currentUser) {
        await fs.collection("volunteer").doc(currentUser.uid).update(formData)
        setVolunteerData(formData)
        console.log(volunteerData)
        setEditMode(false)
      }
    } catch (error) {
      console.error("Error updating volunteer data:", error.message)
    }
  }

  const handle_proposal = () => {
    navigate("/AppliedProject")
  }

  const openAvatarModal = () => {
    setIsAvatarModalOpen(true)
  }

  const closeAvatarModal = () => {
    setIsAvatarModalOpen(false)
  }

  const selectAvatar = (index) => {
    setSelectedAvatar(index)
    closeAvatarModal()
  }

  const openProjectsModal = () => setIsProjectsModalOpen(true)
  const closeProjectsModal = () => setIsProjectsModalOpen(false)
  const openAppliedProjectsModal = () => setIsAppliedProjectsModalOpen(true)
  const closeAppliedProjectsModal = () => setIsAppliedProjectsModalOpen(false)

  // Helper functions
  const getVolunteerLevel = () => {
    const projectCount = projects.length
    if (projectCount >= 10) return { level: "Expert", icon: FaAward, color: "text-green-600" }
    if (projectCount >= 5) return { level: "Advanced", icon: FaStar, color: "text-green-500" }
    if (projectCount >= 1) return { level: "Active", icon: FaTasks, color: "text-green-400" }
    return { level: "Beginner", icon: FaHandsHelping, color: "text-green-300" }
  }

  const volunteerLevel = getVolunteerLevel()

  // Sample impact metrics
  const impactMetrics = [
    {
      icon: FaProjectDiagram,
      label: "Active Projects",
      value: projects.length.toString(),
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      icon: FaClipboardList,
      label: "Applied Projects",
      value: appliedProjects.length.toString(),
      color: "text-green-500",
      bg: "bg-green-50",
    },
    { icon: FaUsers, label: "People Helped", value: "247", color: "text-green-400", bg: "bg-green-50" },
    { icon: FaChartLine, label: "Impact Score", value: "92%", color: "text-green-700", bg: "bg-green-50" },
  ]

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "active":
      case "in progress":
        return "bg-green-200 text-green-700"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return <FiCheckCircle className="w-4 h-4" />
      case "active":
      case "in progress":
        return <FiClock className="w-4 h-4" />
      case "pending":
        return <FiAlertCircle className="w-4 h-4" />
      default:
        return <FiClock className="w-4 h-4" />
    }
  }

  return (
    <div className="min-h-screen pt-[80px] bg-green-50">
      {/* Header */}
      <div className="bg-white border-green-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                <FaHandsHelping className="text-white text-xl" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-green-900">Volunteer Dashboard</h1>
                <p className="text-green-600">Welcome back, {formData.displayName || "Volunteer"}</p>
              </div>
            </div> 
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
                <h2 className="text-3xl font-bold mb-2">{formData.displayName || "Volunteer Name"}</h2>
                <p className="text-green-100 mb-1">Member since {volunteerData.joinDate || "Recently"}</p>
                <div className="flex items-center space-x-2">
                  <volunteerLevel.icon className="text-yellow-300" />
                  <span className="text-green-100">{volunteerLevel.level} Volunteer</span>
                </div>
              </div>
            </div>

            <div className="bg-white bg-opacity-20 rounded-xl px-6 lg:px-14 py-6 text-center backdrop-blur-sm">
              <div className="flex items-center justify-center mb-2">
                <div>
                  <div className="flex items-center justify-center mb-[10px]">
  <FaProjectDiagram className="text-green-100 mt-[4px] text-2xl mr-2" />
                  <div className="text-4xl font-bold">{projects.length}</div>
              
                  </div>
                  <p className="text-green-100">Active Projects</p>
                </div>
              </div>
              <div className="flex items-center justify-center mt-2 text-sm">
                <FiActivity className="mr-1" />
                <span>+{appliedProjects.length} Applied</span>
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
                          setFormData(volunteerData)
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
                        <p className="font-semibold text-green-900">{volunteerData.displayName || "Not provided"}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4 p-4 bg-green-50 rounded-lg">
                      <div className="p-3 bg-green-100 rounded-lg">
                        <FiMail className="text-green-600 w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm text-green-600">Email Address</p>
                        <p className="font-semibold text-green-900">{volunteerData.email || "Not provided"}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4 p-4 bg-green-50 rounded-lg">
                      <div className="p-3 bg-green-100 rounded-lg">
                        <FiCreditCard className="text-green-600 w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm text-green-600">CNIC</p>
                        <p className="font-semibold text-green-900">{volunteerData.cnic || "Not provided"}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4 p-4 bg-green-50 rounded-lg">
                      <div className="p-3 bg-green-100 rounded-lg">
                        <FiHome className="text-green-600 w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm text-green-600">Address</p>
                        <p className="font-semibold text-green-900">{volunteerData.address || "Not provided"}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4 p-4 bg-green-50 rounded-lg">
                      <div className="p-3 bg-green-100 rounded-lg">
                        <FiPhone className="text-green-600 w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm text-green-600">Phone Number</p>
                        <p className="font-semibold text-green-900">{volunteerData.phoneNumber || "Not provided"}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4 p-4 bg-green-50 rounded-lg">
                      <div className="p-3 bg-green-100 rounded-lg">
                        <FiCalendar className="text-green-600 w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm text-green-600">Date of Birth</p>
                        <p className="font-semibold text-green-900">{volunteerData.dob || "Not provided"}</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="flex items-end mb-4">
                      <button
                        type="button"
                        onClick={openAvatarModal}
                        className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
                      >
                        Change Avatar
                      </button>
                    </div>
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
                        <label className="block text-sm font-medium text-green-700 mb-2">CNIC</label>
                        <input
                          type="number"
                          name="cnic"
                          value={formData.cnic}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-green-700 mb-2">Date of Birth</label>
                        <input
                          type="text"
                          name="dob"
                          value={formData.dob}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-green-700 mb-2">Address</label>
                        <input
                          type="text"
                          name="address"
                          value={formData.address}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          required
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-green-700 mb-2">Phone Number</label>
                        <input
                          type="number"
                          name="phoneNumber"
                          value={formData.phoneNumber}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          required
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
                <button
                  onClick={handle_proposal}
                  className="w-full flex items-center space-x-3 p-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors"
                >
                  <FiPlus className="w-5 h-5" />
                  <span>Apply for Project</span>
                </button>
                <button
                  onClick={openProjectsModal}
                  className="w-full flex items-center space-x-3 p-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors"
                >
                  <FiEye className="w-5 h-5" />
                  <span>View Projects</span>
                </button>
                <button
                  onClick={openAppliedProjectsModal}
                  className="w-full flex items-center space-x-3 p-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors"
                >
                  <FiFileText className="w-5 h-5" />
                  <span>Applied Projects</span>
                </button>
              </div>
            </motion.div>

            {/* Recent Projects */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-sm p-6 border border-green-100"
            >
              <h3 className="text-lg font-semibold text-green-900 mb-4">Recent Projects</h3>
              <div className="space-y-4">
                {projects.slice(0, 3).map((project, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div>
                      <p className="font-medium text-green-900 text-sm">{project.title || "Project Title"}</p>
                      <p className="text-green-600 text-xs">Target: ${project.targetAmount || "0"}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-green-600">${project.collectedAmount || "0"}</p>
                      <span
                        className={`text-xs px-2 py-1 rounded-full flex items-center space-x-1 ${getStatusColor(project.status)}`}
                      >
                        {getStatusIcon(project.status)}
                        <span>{project.status || "Pending"}</span>
                      </span>
                    </div>
                  </div>
                ))}
                {projects.length === 0 && (
                  <div className="text-center py-4 text-green-600">
                    <FiBriefcase className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No projects yet</p>
                  </div>
                )}
              </div>
              <button onClick={openProjectsModal} className="w-full mt-4 text-green-600 hover:text-green-700 text-sm font-medium">
                View All Projects
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

      {/* Projects Modal */}
      <AnimatePresence>
        {isProjectsModalOpen && (
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
              className="bg-white rounded-2xl p-6 max-w-4xl w-full max-h-[80vh] overflow-hidden"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-green-900">My Projects</h3>
                <button
                  onClick={closeProjectsModal}
                  className="p-2 text-green-400 hover:text-green-600 transition-colors"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>
              <div className="overflow-auto max-h-[60vh]">
                {projects.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-green-100">
                          <th className="px-4 py-3 text-green-900 font-semibold">Title</th>
                          <th className="px-4 py-3 text-green-900 font-semibold">Target Amount</th>
                          <th className="px-4 py-3 text-green-900 font-semibold">Collected Amount</th>
                          <th className="px-4 py-3 text-green-900 font-semibold">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {projects.map((project, index) => (
                          <tr key={index} className="border-b border-green-50 hover:bg-green-25">
                            <td className="px-4 py-3 text-green-800">{project.title}</td>
                            <td className="px-4 py-3 text-green-600">${project.targetAmount}</td>
                            <td className="px-4 py-3 text-green-600">${project.collectedAmount}</td>
                            <td className="px-4 py-3">
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1 w-fit ${getStatusColor(project.status)}`}
                              >
                                {getStatusIcon(project.status)}
                                <span>{project.status}</span>
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <FaProjectDiagram className="w-16 h-16 mx-auto text-green-300 mb-4" />
                    <h4 className="text-lg font-semibold text-green-900 mb-2">No Projects Yet</h4>
                    <p className="text-green-600">Start by applying for a project to make an impact!</p>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Applied Projects Modal */}
      <AnimatePresence>
        {isAppliedProjectsModalOpen && (
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
              className="bg-white rounded-2xl p-6 max-w-4xl w-full max-h-[80vh] overflow-hidden"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-green-900">Applied Projects</h3>
                <button
                  onClick={closeAppliedProjectsModal}
                  className="p-2 text-green-400 hover:text-green-600 transition-colors"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>
              <div className="overflow-auto max-h-[60vh]">
                {appliedProjects.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-green-100">
                          <th className="px-4 py-3 text-green-900 font-semibold">Project Name</th>
                          <th className="px-4 py-3 text-green-900 font-semibold">Volunteer ID</th>
                          <th className="px-4 py-3 text-green-900 font-semibold">Application Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {appliedProjects.map((project, index) => (
                          <tr key={index} className="border-b border-green-50 hover:bg-green-25">
                            <td className="px-4 py-3 text-green-800">{project.title}</td>
                            <td className="px-4 py-3 text-green-600 font-mono text-sm">{project.volunteerID}</td>
                            <td className="px-4 py-3 text-green-600">{project.applicationDate || "Recent"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <FaClipboardList className="w-16 h-16 mx-auto text-green-300 mb-4" />
                    <h4 className="text-lg font-semibold text-green-900 mb-2">No Applications Yet</h4>
                    <p className="text-green-600">Apply for projects to start making a difference!</p>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Volunteer
