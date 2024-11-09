import React, { useEffect, useState } from "react";
//import { useNavigate } from "react-router-dom";
import { fs } from "../../Config/Config";
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

  return <p className='ml-auto text-[14px] my-[8px] bg-green-900 rounded-[20px] w-[110px] text-center py-[3px] text-white'>{volunteerName.split(" ")[0]}</p>;
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
    <div className="project bg-gray-100 min-h-screen pt-[75px]">
      <div className="proj-heading">Ongoing Projects</div>
      {loadProjects ? (
        <Loader typeOfloader={"a"} />
      ) : (
        <>
          <div className="grid lg:grid-cols-3 gap-[15px] grid-cols-1">
            {projects.map((project) => (
              <div key={project.id} className="mx-[25px] p-6 bg-white border rounded-sm">
                <img
                  src="https://templates.envytheme.com/leud/rtl/assets/images/causes/causes-1.jpg"
                  alt="Charity"
                  className="w-full h-90 object-cover rounded-t-lg mb-4"
                />

                <h2 className="text-2xl font-bold text-center mb-2">{project.title}</h2>
                <p className="text-gray-500 text-center mb-4">{project.description}</p>

                <div className="flex items-center justify-between mb-1">
                  <span className="text-gray-800 font-semibold">{Math.round(Math.min((project.collectedAmount / project.targetAmount) * 100, 100))}%</span>
                  <span className="text-sm text-gray-400">{100 - (Math.round(Math.min((project.collectedAmount / project.targetAmount) * 100, 100)))}%</span>
                </div>

                <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                  <div
                    className="bg-green-500 h-2 rounded-full"
                    style={{ width: `${Math.min((project.collectedAmount / project.targetAmount) * 100, 100)}%` }}
                  ></div>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-gray-400">Raised: ${project.collectedAmount.toLocaleString()}</span>
                  <span className="text-sm text-green-800 font-[600]">Goal: ${project.targetAmount.toLocaleString()}</span>
                </div>

                <VolunteerName volunteerID={project.volunteerID} />
                <button onClick={() => openModal(project.id)} className="w-[180px] text-green-900 py-[3px] border-[2px] border-green-800 hover:text-white  px-4 rounded-[6px] font-semibold hover:bg-green-900">
                  Donate Now
                </button>
              </div>
            ))}

            {/* {projects.map((project) => (
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
      */}
          </div>
          {modalVisible && selectedProjectId && (
            <ProjectDetails onClose={closeModal} id={selectedProjectId} />
          )}
        </>
      )}
    </div>
  );
};


export default Listedprojects;
