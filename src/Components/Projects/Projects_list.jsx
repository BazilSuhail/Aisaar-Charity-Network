import React, { useEffect, useState } from "react";
//import { useNavigate } from "react-router-dom";
import { fs } from "../../Config/Config";
import Footer from "../Pages/Footer";
import { FaHandHoldingHeart } from "react-icons/fa";
import { MdAttachMoney } from "react-icons/md";
import { HiOutlineEye } from "react-icons/hi";
import Loader from "../Loader";
import ProjectDetails from "./ProjectDetails";


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

  return <p className='ml-[58px] mt-[-8px] '><span className="px-[10px] text-white bg-green-800 py-[3px] rounded-md">Volunteer</span><span className="ml-[8px] text-green-900 font-[600] underline text-[19px]">{volunteerName}</span></p>;
};

const Listedprojects = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loadProjects, setLoadProjects] = useState(true);
  //const history = useNavigate();

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
  }, []);

  /*const handleSeeDetails = (projectId) => {
    history(`/listedprojects/${projectId}`);
  };*/

  const openModal = (id) => {
    console.log("id is " + id);
    setSelectedProjectId(id);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedProjectId(null);
  };

  return (
    <div className="project">
      <div className="proj-heading">Ongoing Projects</div>
      {loadProjects ? (
        <Loader typeOfloader={"a"} />
      ) : (
        <>
          <div className="grid lg:grid-cols-2 grid-cols-1">
            {projects.map((project) => (
              <div key={project.id} className="lg:scale-[0.95] shadow-lg rounded-lg border-l-4 bg-[#f8fff3] border-green-600 p-6 m-4 transition-transform duration-700 transform hover:scale-[0.98]  hover:shadow-xl">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-semibold text-green-700 flex items-center">
                    <div className="w-[48px] h-[48px] flex justify-center items-center rounded-full text-white bg-green-800">
                      <FaHandHoldingHeart size={29}/>
                    </div>
                   <span className="ml-[8px]"> {project.title}</span>
                  </h2>
                </div>

                <VolunteerName volunteerID={project.volunteerID} />

                <div className="text-gray-700 mb-4"> 
                  {project.description.split(" ").slice(0, 50).join(" ")}
                  {project.description.split(" ").length > 50 ? "..." : ""}
                </div>

                <p className="text-gray-600 mb-4 flex items-center">
                  <MdAttachMoney className="mr-2 text-green-500" />
                  <span className="font-semibold">Required Amount:</span> ${project.targetAmount}
                </p>

                <button
                  onClick={() => openModal(project.id)}
                  className="flex items-center justify-center bg-green-600 text-white text-sm font-semibold py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring focus:ring-green-300 transition"
                >
                  <HiOutlineEye className="mr-2" />
                  See Details
                </button>
              </div>
            ))}
          </div>
          <Footer />

          {/* Render ProjectDetails modal outside of the map function */}
          {modalVisible && selectedProjectId && (
            <ProjectDetails onClose={closeModal} id={selectedProjectId} />
          )}
        </>
      )}
    </div>
  );
};


export default Listedprojects;
