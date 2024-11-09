import React, { useEffect, useState } from "react";
import { auth, fs } from "../../Config/Config";

const AppliedProj = () => {
  const [loggedInVolunteer, setLoggedInVolunteer] = useState(null);
  const [proposedProjectData, setProposedProjectData] = useState({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    targetAmount: "0",
    status: "Active",
    volunteerID: "",
    franchiseID: "",
    collectedAmount: "0",
  });

  const [appliedProjects, setAppliedProjects] = useState([]);
  const [franchises, setFranchises] = useState([]);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const fetchLoggedInVolunteer = async () => {
      try {
        const currentUser = auth.currentUser;
        if (currentUser) {
          setLoggedInVolunteer(currentUser.uid);
          fetchAppliedProjects(currentUser.uid);
          fetchFranchises();
        }
      } catch (error) {
        console.error("Error fetching logged-in volunteer:", error.message);
      }
    };
    fetchLoggedInVolunteer();
  }, []);

  const fetchAppliedProjects = async (volunteerID) => {
    try {
      const appliedProjectsRef = fs
        .collection("proposedProjects")
        .where("volunteerID", "==", volunteerID);
      const snapshot = await appliedProjectsRef.get();
      const appliedProjectsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setAppliedProjects(appliedProjectsData);
    } catch (error) {
      console.error("Error fetching applied projects:", error.message);
    }
  };

  const fetchFranchises = async () => {
    try {
      const franchisesRef = fs.collection("franchise");
      const snapshot = await franchisesRef.get();
      const franchiseData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setFranchises(franchiseData);
    } catch (error) {
      console.error("Error fetching franchises:", error.message);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProposedProjectData({ ...proposedProjectData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await fs.collection("proposedProjects").add({
        ...proposedProjectData,
        volunteerID: loggedInVolunteer,
      });
      setProposedProjectData({
        title: "",
        description: "",
        startDate: "",
        endDate: "",
        targetAmount: "0",
        status: "Active",
        volunteerID: loggedInVolunteer,
        franchiseID: "",
        collectedAmount: "0",
      });
      alert("Project proposed successfully!");
      fetchAppliedProjects(loggedInVolunteer);
    } catch (error) {
      console.error("Error proposing project:", error.message);
    }
  };

  return (
    <div className="container bg-gray-100 pt-[95px] min-h-screen xl:px-[185px] lg:px-[65px]  mx-auto p-4">
      <div className="text-center text-2xl font-bold mb-6">Applied Projects</div>
      <div className="overflow-x-auto rounded-xl">
        <table className="min-w-full bg-white rounded-md shadow-md">
          <thead className="bg-green-900 text-white">
            <tr>
              <th className="py-2 whitespace-nowrap px-4">Title</th>
              <th className="py-2 whitespace-nowrap px-4">Description</th>
              <th className="py-2 whitespace-nowrap px-4">Start Date</th>
              <th className="py-2 whitespace-nowrap px-4">End Date</th>
              <th className="py-2 whitespace-nowrap px-4">Target Amount</th>
              <th className="py-2 whitespace-nowrap px-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {appliedProjects.map((project) => (
              <tr key={project.id} className="border-b">
                <td className="py-2 text-green-900 font-[600] px-4">{project.title}</td>
                <td className="py-2 px-4">{project.description}</td>
                <td className="py-2 whitespace-nowrap px-4">{project.startDate}</td>
                <td className="py-2 whitespace-nowrap px-4">{project.endDate}</td>
                <td className="py-2 whitespace-nowrap px-4">{project.targetAmount}</td>
                <td className="py-2 whitespace-nowrap text-[14px] px-4"><p className="bg-green-900 rounded-xl px-[5px] py-[3px] text-white text-center">{project.status}</p></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button
        className="mt-6 px-6 py-2 bg-green-800 text-white rounded-md hover:bg-green-600 transition"
        onClick={() => setShowForm(!showForm)}
      >
        {showForm ? "Cancel Application" : "Apply for Project"}
      </button>

      {showForm && (
        <div className="mt-8 p-6 bg-white rounded-md border">
          <form onSubmit={handleSubmit} className="grid gap-4">
            <div>
              <label className="block text-gray-700 font-semibold">Name:</label>
              <input
                type="text"
                name="title"
                value={proposedProjectData.title}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-green-500"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold">Description:</label>
              <input
                type="text"
                name="description"
                value={proposedProjectData.description}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-green-500"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold">Start Date:</label>
              <input
                type="date"
                name="startDate"
                value={proposedProjectData.startDate}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-green-500"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold">End Date:</label>
              <input
                type="date"
                name="endDate"
                value={proposedProjectData.endDate}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-green-500"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold">Target Amount:</label>
              <input
                type="text"
                name="targetAmount"
                value={proposedProjectData.targetAmount}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-green-500"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold">Select Franchise:</label>
              <select
                name="franchiseID"
                value={proposedProjectData.franchiseID}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-green-500"
              >
                <option value="">Select Organization</option>
                {franchises.map((branch) => (
                  <option key={branch.id} value={branch.id}>
                    {branch.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-gray-700 font-semibold">Status:</label>
              <select
                name="status"
                value={proposedProjectData.status}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-green-500"
              >
                <option value="Active">Active</option>
                <option value="In Progress">In Progress</option>
              </select>
            </div>
            <button
              type="submit"
              className="px-6 py-2 bg-green-900 text-white rounded-md hover:bg-green-600 transition"
            >
              Save
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default AppliedProj;
