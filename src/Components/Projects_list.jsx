import React, { useEffect, useState } from "react";
import { fs, auth, FieldValue } from "../Config/Config";
import Projectcomp from "./projectComp";

import "./Styles/projList.css"

const Listedprojects = () => {
  const [projects, setProjects] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [userInDonorsCollection, setUserInDonorsCollection] = useState(false);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const projectsRef = fs.collection("projects");
        const snapshot = await projectsRef.get();
        const projectsData = snapshot.docs.map((doc) => ({
          id: doc.id, ...doc.data(),
        }));
        setProjects(projectsData);
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
  }, []);

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
  
      // Update project's collected amount
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
  
        // Update user's donation record
        await donorRef.update({
          donations: updatedDonations,
        });
      } else {
        // Create user's donation record
        await donorRef.set({
          donations: amount,
        });
      }
  
      const transactionDocRef = fs.collection("transactions").doc(currentUser.uid);
      const transactionDoc = await transactionDocRef.get();
  
      if (transactionDoc.exists) {
        // Update user's transaction record
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
        // Create user's transaction record
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
    } catch (error) {
      console.error("Error donating:", error);
    }
  };
  


  return (
    <div>
      <h2>Listed Projects</h2>
      <div className="renderObjects">
        {projects.map((project) => (
          <Projectcomp
            key={project.id}
            project={project}
            currentUser={currentUser}
            handleDonate={handleDonate}
            userInDonorsCollection={userInDonorsCollection}
          />
        ))}
      </div>
    </div>
  );
};

export default Listedprojects;
