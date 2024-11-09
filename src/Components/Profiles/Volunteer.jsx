import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, fs } from "../../Config/Config";
import { FiEdit } from "react-icons/fi";
import { motion } from "framer-motion";
const Volunteer = () => {
  const navigate = useNavigate();
  const [volunteerData, setVolunteerData] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [projects, setProjects] = useState([]);
  const [appliedProjects, setAppliedProjects] = useState([]);
  const [isProjectsModalOpen, setIsProjectsModalOpen] = useState(false);
  const [isAppliedProjectsModalOpen, setIsAppliedProjectsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    displayName: "",
    email: "",
    address: "",
    phoneNumber: "",
    dob: "",
    cnic: "",
    idtype: "Volunteer",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const currentUser = auth.currentUser;
        if (currentUser) {
          // Fetch volunteer data
          const volunteerRef = fs.collection("volunteer").doc(currentUser.uid);
          const volunteerDoc = await volunteerRef.get();
          if (volunteerDoc.exists) {
            const volunteerData = volunteerDoc.data();
            setVolunteerData(volunteerData);
            setFormData({ ...volunteerData, idtype: "Volunteer" });
          } else {
            console.log("No volunteer data found");
          }

          // Fetch projects data
          const projectsRef = fs
            .collection("projects")
            .where("volunteerID", "==", currentUser.uid);
          const projectsSnapshot = await projectsRef.get();
          const projectsData = projectsSnapshot.docs.map((doc) => doc.data());
          setProjects(projectsData);

          // Fetch applied projects data
          const appliedProjectsRef = fs
            .collection("proposedProjects")
            .where("volunteerID", "==", currentUser.uid);
          const appliedProjectsSnapshot = await appliedProjectsRef.get();
          const appliedProjectsData = appliedProjectsSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setAppliedProjects(appliedProjectsData);
        }
      } catch (error) {
        console.error("Error fetching data:", error.message);
      }
    };

    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        fetchData();
      }
    });

    return unsubscribe;
  }, []);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleEdit = () => {
    setEditMode(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const currentUser = auth.currentUser;
      if (currentUser) {
        await fs.collection("volunteer").doc(currentUser.uid).update(formData);
        setVolunteerData(formData);
        console.log(volunteerData);
        setEditMode(false);
      }
    } catch (error) {
      console.error("Error updating volunteer data:", error.message);
    }
  };

  const handle_proposal = () => {
    navigate('/AppliedProject');
  };



  const openProjectsModal = () => setIsProjectsModalOpen(true);
  const closeProjectsModal = () => setIsProjectsModalOpen(false);
  const openAppliedProjectsModal = () => setIsAppliedProjectsModalOpen(true);
  const closeAppliedProjectsModal = () => setIsAppliedProjectsModalOpen(false);
  return (
    <div className="mt-[60px] min-h-screen bg-white flex flex-col p-6">
      {/* Header Section */}
      <div className="mb-[15px] flex lg:items-center flex-col lg:flex-row lg:justify-between bg-green-900 border-2 border-green-300 p-6 rounded-xl shadow-md">
        <div className="flex items-end space-x-4">
          <img
            src={`/Assets/${formData.photoURL}.jpg`}
            alt="Profile Avatar"
            className="w-20 h-20 lg:w-32 lg:h-32 rounded-full border border-gray-300 shadow-md"
          />
          <div className="flex lg:flex-row flex-col lg:items-end text-[25px] lg:text-[35px] font-extrabold text-green-200">
            Hello, <p className="lg:ml-[15px] text-[30px] lg:text-[45px] text-white">{formData.displayName}</p>
          </div>
        </div>
      </div>

      {/* Display Profile Data */}
      {!editMode ? (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Profile Information Cards */}
            <div className="flex items-center space-x-4 bg-gray-100 p-6 rounded-lg shadow-sm">
              <h2 className="text-lg font-semibold text-gray-800">Full Name</h2>
              <p className="text-gray-600">{volunteerData.displayName}</p>
            </div>
            <div className="flex items-center space-x-4 bg-gray-100 p-6 rounded-lg shadow-sm">
              <h2 className="text-lg font-semibold text-gray-800">Email</h2>
              <p className="text-gray-600">{volunteerData.email}</p>
            </div>
            <div className="flex items-center space-x-4 bg-gray-100 p-6 rounded-lg shadow-sm">
              <h2 className="text-lg font-semibold text-gray-800">CNIC</h2>
              <p className="text-gray-600">{!volunteerData.cnic ? volunteerData.cnic : 'Update your CNIC'}</p>
            </div>
            <div className="flex items-center space-x-4 bg-gray-100 p-6 rounded-lg shadow-sm">
              <h2 className="text-lg font-semibold text-gray-800">Address Name</h2>
              <p className="text-gray-600">{!volunteerData.address ? volunteerData.address : 'Enter Address'}</p>
            </div>
            <div className="flex items-center space-x-4 bg-gray-100 p-6 rounded-lg shadow-sm">
              <h2 className="text-lg font-semibold text-gray-800">Phone Number</h2>
              <p className="text-gray-600">{!volunteerData.phoneNumber ? volunteerData.phoneNumber : 'Enter Phone Number'}</p>
            </div>
            <div className="flex items-center space-x-4 bg-gray-100 p-6 rounded-lg shadow-sm">
              <h2 className="text-lg font-semibold text-gray-800">Date of Birth Number</h2>
              <p className="text-gray-600">{!volunteerData.dob ? volunteerData.dob : 'Enter DOB'}</p>
            </div>
            {/* Add more fields similar to above */}
          </div>

          {/* Action Buttons */}
          <div className="flex mt-[40px] items-center space-x-4">
            <button onClick={handleEdit} className="bg-green-700 text-white px-4 py-2 rounded-md shadow-md hover:bg-green-600 flex items-center space-x-2">
              <FiEdit className="w-5 h-5" />
              <span>Edit Profile</span>
            </button>
            <button onClick={openProjectsModal} className="bg-green-700 text-white px-4 py-2 rounded-md shadow-md hover:bg-green-600">
              View Projects
            </button>
            <button onClick={openAppliedProjectsModal} className="bg-green-900 text-white px-4 py-2 rounded-md shadow-md hover:bg-green-600">
              View Applied Projects
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Form Fields for Editing Profile */}
          <input type="text" name="displayName" value={formData.displayName} onChange={handleChange} placeholder="Enter Name" className="w-full p-2 border border-gray-300 rounded-md" required />
          <input type="text" name="cnic" value={formData.cnic} onChange={handleChange} placeholder="Enter CNIC" className="w-full p-2 border border-gray-300 rounded-md" required />
          <input type="text" name="dob" value={formData.dob} onChange={handleChange} placeholder="Enter Date of Birth" className="w-full p-2 border border-gray-300 rounded-md" required />
          <input type="text" name="address" value={formData.address} onChange={handleChange} placeholder="Enter Address" className="w-full p-2 border border-gray-300 rounded-md" required />
          <input type="text" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} placeholder="Enter Phone Number" className="w-full p-2 border border-gray-300 rounded-md" required />
          {/* Add more fields similar to above */}
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-600 flex items-center space-x-2">
            <span>Update Profile</span>
          </button>
        </form>
      )}

      {/* Projects Modal */}
      {isProjectsModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <motion.div className="bg-white p-6 rounded-lg shadow-lg" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <h2 className="text-xl font-bold mb-4">Projects</h2>
            <table className="table-auto w-full text-left border">
              <thead>
                <tr>
                  <th className="border px-4 py-2">Title</th>
                  <th className="border px-4 py-2">Target Amount</th>
                  <th className="border px-4 py-2">Collected Amount</th>
                  <th className="border px-4 py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((project, index) => (
                  <tr key={index}>
                    <td className="border px-4 py-2">{project.title}</td>
                    <td className="border px-4 py-2">{project.targetAmount}</td>
                    <td className="border px-4 py-2">{project.collectedAmount}</td>
                    <td className="border px-4 py-2">{project.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button onClick={closeProjectsModal} className="mt-4 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600">
              Close
            </button>
          </motion.div>
        </div>
      )}

      {/* Applied Projects Modal */}
      {isAppliedProjectsModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <motion.div className="bg-white p-6 rounded-lg shadow-lg" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <h2 className="text-xl font-bold mb-4">Applied Projects</h2>
            <table className="table-auto w-full text-left border">
              <thead>
                <tr>
                  <th className="border px-4 py-2">Project Name</th>
                  <th className="border px-4 py-2">Volunteer ID</th>
                </tr>
              </thead>
              <tbody>
                {appliedProjects.map((project, index) => (
                  <tr key={index}>
                    <td className="border px-4 py-2">{project.name}</td>
                    <td className="border px-4 py-2">{project.volunteerID}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button onClick={closeAppliedProjectsModal} className="mt-4 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600">
              Close
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Volunteer;