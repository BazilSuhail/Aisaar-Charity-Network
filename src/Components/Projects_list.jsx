import React, { useEffect, useState } from "react";
import { fs, auth, FieldValue } from "../Config/Config";

import Projectcomp from "./projectComp";
import Footer from "./Footer";
import "./Styles/projList.css"
import Loader from "./Loader";

const Listedprojects = () => {
  const [projects, setProjects] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  const [loadProjects, setLoadProjects] = useState(true);

  const [userInDonorsCollection, setUserInDonorsCollection] = useState(false);

  const [updateProjects, setUpdateProjects] = useState(false); // State to trigger re-fetching projects

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
      }
      catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    fetchProjects();

    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
      checkUserInDonorsCollection(user);
    });

    return () => unsubscribe();
  }, [updateProjects]);

  const checkUserInDonorsCollection = async (user) => {
    if (!user) {
      setUserInDonorsCollection(false);
      return;
    }
    try {
      const donorId = user.uid;
      const donorRef = fs.collection("donors").doc(donorId);
      const donorSnapshot = await donorRef.get();
      setUserInDonorsCollection(donorSnapshot.exists);
    }
    catch (error) {
      console.error("Error checking user in donors collection:", error);
    }
  };

  const handleDonate = async (projectId, donationAmount, projectName) => {
    try {
      if (!currentUser) {
        throw new Error("User not logged in");
      }

      if (!userInDonorsCollection) {
        throw new Error("User not in donors collection");
      }

      const amount = parseInt(donationAmount);
      if (isNaN(amount) || amount <= 0) {
        throw new Error("Invalid donation amount");
      }

      const projectToUpdate = projects.find(
        (project) => project.id === projectId
      );

      if (!projectToUpdate) {
        throw new Error("Project not found");
      }

      const updatedCollectedAmount = amount + parseInt(projectToUpdate.collectedAmount);


      await fs.collection("projects").doc(projectId).update({
        collectedAmount: updatedCollectedAmount.toString(),
      });

      const donorId = currentUser.uid;
      const donorRef = fs.collection("donors").doc(donorId);
      const donorSnapshot = await donorRef.get();

      if (donorSnapshot.exists) {
        const donorData = donorSnapshot.data();
        const currentDonations = donorData.donations || 0;
        const updatedDonations = parseInt(currentDonations) + parseInt(amount);

        await donorRef.update({
          donations: updatedDonations,
        });
      }
      else {
        await donorRef.set({
          donations: amount,
        });
      }

      const transactionDocRef = fs.collection("transactions").doc(currentUser.uid);
      const transactionDoc = await transactionDocRef.get();

      if (transactionDoc.exists) {
        await transactionDocRef.update({

          history: FieldValue.arrayUnion({
            projectName: projectName,
            idType: "Project",
            projectId: projectId,
            amount: amount,
            timestamp: new Date().toISOString(),
          }),
        });
      }
      else {

        await transactionDocRef.set({
          history: [
            {
              projectName: projectName,
              idType: "Project",
              projectId: projectId,
              amount: amount,
              timestamp: new Date().toISOString(),
            },
          ],
        });
      }

      //Logic to add Completed Projects
      if (updatedCollectedAmount >= parseInt(projectToUpdate.targetAmount)) {
        const completedProjectData = { ...projectToUpdate };
        delete completedProjectData.collectedAmount;
        await fs.collection("completedProjects").doc(projectId).set(completedProjectData);
        await fs.collection("projects").doc(projectId).delete();
      }

      //Logic for premium member
      if (amount > 1000000) {
        await fs.collection("topDonors").doc(currentUser.uid).set({
          donorId: currentUser.uid
        }, { merge: true }); // Use merge to update the document if it already exists
      }
      setUpdateProjects(prevState => !prevState);
    }
    catch (error) {
      console.error("Error donating:", error);
    }
  };



  return (
    <div className="project">

      <div className="proj-heading">Ongoing Projects</div>


      {loadProjects ? (
        <Loader typeOfloader={"a"} />
      ) :
        (
          <>
            {/** Aik Aik projects component */}

            <div className="renderObjects">
              {projects.map((project) => (
                <Projectcomp
                  key={project.id}
                  project={project}
                  handleDonate={handleDonate}
                  userInDonorsCollection={userInDonorsCollection}
                />
              ))}
            </div>

            <Footer />
          </>
        )}


    </div>
  );
};

export default Listedprojects;
