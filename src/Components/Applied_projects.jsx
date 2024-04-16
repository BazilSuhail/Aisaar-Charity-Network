import React, { useEffect, useState } from "react";
import { auth, fs } from "../Config/Config";

import "./Styles/donor.css"

import "./Styles/tables.css"
import "./Styles/form.css"
const AppliedProj = () => {
  const [loggedInVolunteer, setLoggedInVolunteer] = useState(null);
  const [proposedProjectData, setProposedProjectData] = useState({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    targetAmount: "0", // Initialize as string
    collectedAmount: "0", // Initialize as string
    status: "",
    volunteerID: "",
  });
  const [appliedProjects, setAppliedProjects] = useState([]);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const fetchLoggedInVolunteer = async () => {
      try {
        const currentUser = auth.currentUser;
        if (currentUser) {
          setLoggedInVolunteer(currentUser.uid);
          fetchAppliedProjects(currentUser.uid);
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    const parsedValue = name === "collectedAmount" || name === "targetAmount" ? value : value;
    setProposedProjectData({ ...proposedProjectData, [name]: parsedValue });
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
        collectedAmount: "0",
        status: "",
        volunteerID: loggedInVolunteer,
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
        <button className="tooglebutton" onClick={() => setShowForm(!showForm)}>{showForm ? "Cancel Application" : "Apply Project"}</button>

        {showForm && ( 

          <div className='form'>
            <form className="formData" onSubmit={handleSubmit}>
              <div className='attribute'>Name: </div>
              <input type="text" name="title" value={proposedProjectData.title} onChange={handleChange} />

              <div className='attribute'>Description:</div>
              <input type="text" name="description" value={proposedProjectData.description} onChange={handleChange} />

              <div className='attribute'>Start Date: </div>
              <input type="date" name="startDate" value={proposedProjectData.startDate} onChange={handleChange} />

              <div className='attribute'>End Date: </div>
              <input type="date" name="endDate" value={proposedProjectData.endDate} onChange={handleChange} />

              <div className='attribute'>Target Amount : </div>
              <input type="text" name="targetAmount" value={proposedProjectData.targetAmount} onChange={handleChange} />

              <div className="attribute"> Status: </div>
              <select className="accType" name="status" value={proposedProjectData.status} onChange={handleChange}>
                <option className="selection" value="Active">Active</option>
                <option className="selection" value="In Progress">In Progress</option>
              </select>
              <br />

              <button className='save' type="submit">Save</button>
            </form>
          </div>

        )}
      </div>
    </div>
  );
};

export default AppliedProj;
