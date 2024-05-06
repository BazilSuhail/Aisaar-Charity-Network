import React, { useEffect, useState } from "react";
import { auth, fs } from "../Config/Config";

import "./Styles/donor.css";
import "./Styles/tables.css";
import "./Styles/form.css";

const AppliedProj = () => {
  const [loggedInVolunteer, setLoggedInVolunteer] = useState(null);
  const [proposedProjectData, setProposedProjectData] = useState({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    targetAmount: "0",
    status: "Active", // Set default status to "Active"
    volunteerID: "",
    franchiseID: "", // Add franchiseID field
    collectedAmount: "0", // Initialize collectedAmount to "0"
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
  }, []); // Pass an empty dependency array to run only once on mount

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
        status: "Active", // Set default status to "Active"
        volunteerID: loggedInVolunteer,
        franchiseID: "", // Reset franchiseID
        collectedAmount: "0",
      });
      alert("Project proposed successfully!");
      fetchAppliedProjects(loggedInVolunteer);
    } catch (error) {
      console.error("Error proposing project:", error.message);
    }
  };

  return (
    <div>
      <div className="back">
        <div className="headings">Applied Projects </div>
        <div className="table-container">
          <table className="table-body">
            <thead className="head">
              <tr>
                <th>Title</th>
                <th>Description</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Target Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody className="body">
              {appliedProjects.map((project) => (
                <tr key={project.id}>
                  <td>{project.title}</td>
                  <td>{project.description}</td>
                  <td>{project.startDate}</td>
                  <td>{project.endDate}</td>
                  <td>{project.targetAmount}</td>
                  <td>{project.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <br />
      <div className="placeForm">
        <button
          className="tooglebutton"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? "Cancel Application" : "Apply Project"}
        </button>
        {showForm && (
          <div className="form">
            <form className="formData" onSubmit={handleSubmit}>
              <div className="attribute">Name: </div>
              <input
                type="text"
                name="title"
                value={proposedProjectData.title}
                onChange={handleChange}
              />

              <div className="attribute">Description:</div>
              <input
                type="text"
                name="description"
                value={proposedProjectData.description}
                onChange={handleChange}
              />

              <div className="attribute">Start Date: </div>
              <input
                type="date"
                name="startDate"
                value={proposedProjectData.startDate}
                onChange={handleChange}
              />

              <div className="attribute">End Date: </div>
              <input
                type="date"
                name="endDate"
                value={proposedProjectData.endDate}
                onChange={handleChange}
              />

              <div className="attribute">Target Amount : </div>
              <input
                type="text"
                name="targetAmount"
                value={proposedProjectData.targetAmount}
                onChange={handleChange}
              />

              <div className="attribute">
                Select Franchise to which to Propose :{" "}
              </div>
              <select
                className="form-selection-fields"
                name="franchiseID"
                value={proposedProjectData.franchiseID}
                onChange={handleChange}
                required
              >
                <option value="">Select Organization</option>
                {franchises.map((branch) => (
                  <option
                    className="selection"
                    key={branch.id}
                    value={branch.id}
                  >
                    {branch.name}
                  </option>
                ))}
              </select>

              <div className="attribute"> Status: </div>

              <select className="form-selection-fields" name="status" value={proposedProjectData.status} onChange={handleChange}    >
                <option className="selection" value="Active">Active</option>
                <option className="selection" value="In Progress"> In Progress</option>
              </select>
<br />
              <button className="save" type="submit">    Save  </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default AppliedProj;
