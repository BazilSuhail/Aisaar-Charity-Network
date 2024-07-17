import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, fs } from "../../Config/Config";
import Footer from "../Pages/Footer"; 
import "./donor.css";
import "../Styles/tables.css";
import "../Styles/form.css";

const Volunteer = () => {
  const navigate = useNavigate();
  const [volunteerData, setVolunteerData] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [projects, setProjects] = useState([]);
  const [appliedProjects, setAppliedProjects] = useState([]);

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

    // Call fetchData when the component mounts or when the authentication state changes
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        fetchData();
      }
    });

    return unsubscribe; // Cleanup function to unsubscribe from the auth state listener
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
  return (
    <div className='donor'>
      <div className="headings">Volunteer Information </div>

      {editMode ? (
        <div className='form'>
          <form className="formData" onSubmit={handleSubmit}>

            <div className='attribute'>Name: </div>
            <input type="text" name="displayName" value={formData.displayName} onChange={handleChange} />
            <div className='attribute'>Email:</div>
            <input type="email" name="email" value={formData.email} onChange={handleChange} />
            <div className='attribute'>Phone Number: </div>
            <input type="text" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} />
            <div className='attribute'>Address: </div>
            <input type="text" name="address" value={formData.address} onChange={handleChange} />
            <div className='attribute'>Date of Birth: </div>
            <input type="date" name="dob" value={formData.dob} onChange={handleChange} />
            <div className='attribute'>CNIC: </div>
            <input type="text" name="cnic" value={formData.cnic} onChange={handleChange} />

            <button className='save' type="submit">Save</button>
          </form>
        </div>
      ) :
        (
          <>
            <div className='props'>
              <div className='attributes'>Name: </div>
              <div className='values'>{volunteerData.displayName}</div>
              <div className='attributes'>Email:</div>
              <div className='values'>{volunteerData.email}</div>

              <div className='attributes'>Phone Number: </div>
              <div className='values'>{!volunteerData.phoneNumber
                ? (<div className='values-placeholder'>Enter your bio</div>)
                : (<div>{volunteerData.phoneNumber}</div>)}
              </div>

              <div className='attributes'>Address: </div>
              <div className='values'>{!volunteerData.address
                ? (<div className='values-placeholder'>Enter your bio</div>)
                : (<div>{volunteerData.address}</div>)}
              </div>

              <div className='attributes'>Date of Birth: </div>
              <div className='values'>{!volunteerData.dob
                ? (<div className='values-placeholder'>Enter your bio</div>)
                : (<div>{volunteerData.dob}</div>)}
              </div>

              <div className='attributes'>CNIC:</div>
              <div className='values'>{!volunteerData.cnic
                ? (<div className='values-placeholder'>Enter your bio</div>)
                : (<div>{volunteerData.cnic}</div>)}
              </div>


              <button className='edit-btn' onClick={handleEdit}>Edit Info</button>
              <button className='proposal' onClick={handle_proposal}>Propose a Project</button>

            </div>

          </>
        )}

      {projects.length > 0 && (
        <div>

          <div className="back">
            <div className="headings">Project </div>
            <div className="table-container">
              <table className="table-body">
                <thead className="head">
                  <tr>
                    <th>Title</th>
                    <th>Target Amount</th>
                    <th>Collected Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody className="body">
                  {projects.map((project, index) => (
                    <tr key={index}>
                      <td>{project.title}</td>
                      <td>{project.targetAmount}</td>
                      <td>{project.collectedAmount}</td>
                      <td>{project.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {appliedProjects.length > 0 && (
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
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Volunteer;