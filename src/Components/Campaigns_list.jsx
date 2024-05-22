import React, { useEffect, useState } from "react";
import { fs, auth } from "../Config/Config";
import { FieldValue } from "../Config/Config";

import Footer from "./Footer";
import CampaignComp from "./CampaignComp.jsx";
import "./Styles/campaignList.css";
import Loader from "./Loader";

const Listcampaigns = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [userInDonorsCollection, setUserInDonorsCollection] = useState(false);
  const [loadProjects, setLoadProjects] = useState(true);
  const [updatecampaigns, setUpdatecampaigns] = useState(false); // State to trigger re-fetching projects

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const campaignsRef = fs.collection("campaigns");
        const snapshot = await campaignsRef.get();
        const campaignsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCampaigns(campaignsData);
        setLoadProjects(false);
      } catch (error) {
        console.error("Error fetching campaigns:", error);
      }
    };
    fetchCampaigns();

    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
      checkUserInDonorsCollection(user);
    });

    return () => unsubscribe();
  }, [updatecampaigns]);

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
    } catch (error) {
      console.error("Error checking user in donors collection:", error);
    }
  };

  const handleDonate = async (campaignId, donationAmount, name) => {
    try {
      if (!currentUser) throw new Error("User not logged in");
      if (!userInDonorsCollection)
        throw new Error("User not in donors collection");

      const amount = parseInt(donationAmount);
      if (isNaN(amount) || amount <= 0)
        throw new Error("Invalid donation amount");

      const campaignToUpdate = campaigns.find(
        (campaign) => campaign.id === campaignId
      );
      const updatedCurrentAmountRaised =
        amount + parseInt(campaignToUpdate.currentAmountRaised);

      if (updatedCurrentAmountRaised >= parseInt(campaignToUpdate.targetAmount)) {
        // Move campaign to completedcampaigns collection
        const { currentAmountRaised, status, ...campaignData } = campaignToUpdate;
        await fs.collection("completedcampaigns").doc(campaignId).set(campaignData);

        // Delete campaign from campaigns collection
        await fs.collection("campaigns").doc(campaignId).delete();
      } else {
        await fs.collection("campaigns").doc(campaignId).update({
          currentAmountRaised: updatedCurrentAmountRaised,
        });
      }

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
      } else {
        await donorRef.set({
          donations: amount,
        });
      }

      const transactionDocRef = fs.collection("transactions").doc(currentUser.uid);
      const transactionDoc = await transactionDocRef.get();

      if (transactionDoc.exists) {
        await transactionDocRef.update({
          history: FieldValue.arrayUnion({
            projectName: name,
            projectId: campaignId,
            idType: "Campaign",
            amount: amount,
            timestamp: new Date().toISOString(),
          }),
        });
      } else {
        await transactionDocRef.set({
          history: [
            {
              projectName: name,
              projectId: campaignId,
              idType: "Campaign",
              amount: amount,
              timestamp: new Date().toISOString(),
            },
          ],
        });
      }

      setUpdatecampaigns(prevState => !prevState);
    } catch (error) {
      console.error("Error donating:", error);
    }
  };

  return (
    <div className="campaign">
      <div className="camp-heading">Registered Campaigns</div>
      {loadProjects ? (
        <Loader typeOfloader={"a"} />
      ) : (
        <>
          <div className="render-campaigns">
            {campaigns.map((campaign) => (
              <CampaignComp
                key={campaign.id}
                campaign={campaign}
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

export default Listcampaigns;
