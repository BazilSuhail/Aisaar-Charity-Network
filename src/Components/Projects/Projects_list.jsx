import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fs, auth } from "../../Config/Config";
import Footer from "../Pages/Footer"; 
import Loader from "../Loader";
import "./projectsList.css";

const Listedprojects = () => {
  const [projects, setProjects] = useState([]);
  const [loadProjects, setLoadProjects] = useState(true);
  const history = useNavigate();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const projectsRef = fs.collection("projects");
        const snapshot = await projectsRef.get();
        const projectsData = snapshot.docs.map((doc) => ({
          id: doc.id, ...doc.data(),
        }));
        setProjects(projectsData);
        setLoadProjects(false);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    fetchProjects();

    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        console.log("User logged in: ", user);
      } else {
        console.log("No user logged in.");
      }
    });

    return () => unsubscribe();
  }, []);

  const handleSeeDetails = (projectId) => {
    history(`/listedprojects/${projectId}`);
  };

  return (
    <div className="project">
      <div className="proj-heading">Ongoing Projects</div>
      {loadProjects ? (
        <Loader typeOfloader={"a"} />
      ) : (
        <>
          <div className="renderObjects">
            {projects.map((project) => (
              <div key={project.id} className='project-card'>
                <div className='project-header'>
                  <h2 className='project-title'>{project.title}</h2>
                  <VolunteerName volunteerID={project.volunteerID} />
                </div>
                <p className='project-description'>
                  {project.description.split(" ").slice(0, 50).join(" ")}{project.description.split(" ").length > 50 ? "..." : ""}
                </p>
                <p className="project-required"> <span className='project-target'> Required Amount:</span> <span className="project-amount">${project.targetAmount}</span></p>
                <button className='see-details-button' onClick={() => handleSeeDetails(project.id)}>See Details</button>
              </div>
            ))}
          </div>
          <Footer />
        </>
      )}
    </div>
  );
};

const VolunteerName = ({ volunteerID }) => {
  const [volunteerName, setVolunteerName] = useState("");

  useEffect(() => {
    const fetchVolunteerName = async () => {
      if (volunteerID) {
        const volunteerRef = fs.collection("volunteer").doc(volunteerID);
        const volunteerDoc = await volunteerRef.get();
        if (volunteerDoc.exists) {
          setVolunteerName(volunteerDoc.data().displayName);
        }
      }
    };

    fetchVolunteerName();
  }, [volunteerID]);

  return <p className='project-volunteer'>Volunteer: {volunteerName}</p>;
};

export default Listedprojects;
