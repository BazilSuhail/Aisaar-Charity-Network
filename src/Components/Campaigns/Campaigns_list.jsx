import React, { useEffect, useState } from "react";
import { fs, auth, FieldValue } from "../../Config/Config";

import CampaignComp from "./CampaignComp.jsx";
import Loader from "../Loader";

const Listcampaigns = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [userInDonorsCollection, setUserInDonorsCollection] = useState(false);
  const [loadProjects, setLoadProjects] = useState(true);
  const [updatecampaigns, setUpdatecampaigns] = useState(false);

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
    <div className="project bg-gray-100 min-h-screen pt-[70px]">

      {loadProjects ? (
        <Loader typeOfloader={"a"} />
      ) : (
        <>
          <section
            className="relative bg-gray-100 py-24 px-6 md:px-12 lg:px-24"
            style={{
              backgroundImage: 'url("https://templates.envytheme.com/leud/rtl/assets/images/causes/causes-3.jpg")', // Replace with the desired background image URL
              backgroundSize: 'cover',
            }}
          >
            <div className="absolute inset-0 bg-green-950 opacity-80 z-0"></div>

            <div className="relative z-10 max-w-6xl mx-auto text-center">
              <h2 className="text-4xl font-bold text-green-200 mb-4">
                Join Our Campaigns for Change
              </h2>
              <p className="text-lg text-gray-200 mb-10">
                Our franchises are actively running campaigns to bring resources and opportunities to communities in need. By supporting a campaign, you’re empowering local leaders to make a meaningful impact and transform lives.
              </p>
            </div>

            <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              <div className="bg-[#0d380eb7] shadow-md shadow-green-950 bg-opacity-90 rounded-lg overflow-hidden">
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-green-300 mb-2">Clean Water for All</h3>
                  <p className="text-green-100 mb-4">
                    Help provide safe, clean water to underprivileged communities. Every dollar counts in making clean water accessible.
                  </p>
                </div>
              </div>

              <div className="bg-[#0d380eb7] bg-opacity-90 rounded-lg shadow-lg overflow-hidden">
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-green-300 mb-2">Education for Every Child</h3>
                  <p className="text-green-100 mb-4">
                    Join our mission to provide education resources to children in need, opening doors to a brighter future.
                  </p>
                </div>
              </div>

              <div className="bg-[#0d380eb7] bg-opacity-90 rounded-lg shadow-lg overflow-hidden">
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-green-300 mb-2">Medical Aid for Families</h3>
                  <p className="text-green-100 mb-4">
                    Support our efforts to bring medical assistance and resources to families who need it the most.
                  </p>
                </div>
              </div>
            </div>
          </section>
          <div className="grid lg:grid-cols-3 pt-[35px] gap-[15px] grid-cols-1">
            {campaigns.map((campaign) => (
              <CampaignComp
                key={campaign.id}
                campaign={campaign}
                handleDonate={handleDonate}
                userInDonorsCollection={userInDonorsCollection}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Listcampaigns;
