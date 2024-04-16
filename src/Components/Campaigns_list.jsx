import React, { useEffect, useState } from "react";
import { fs, auth } from "../Config/Config";
import { FieldValue } from "../Config/Config";

import "./Styles/tables.css";

const Listcampaigns = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [donationAmount, setDonationAmount] = useState(0);
  const [currentUser, setCurrentUser] = useState(null);
  const [userInDonorsCollection, setUserInDonorsCollection] = useState(false);

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
    } catch (error) {
      console.error("Error checking user in donors collection:", error);
    }
  };

  const handleDonate = async (campaignId, name) => {
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

      await fs.collection("campaigns").doc(campaignId).update({
        currentAmountRaised: updatedCurrentAmountRaised,
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
    } catch (error) {
      console.error("Error donating:", error);
    }
  };

  return (
    <div>
      <h2>Listed Campaigns</h2>
      <div className="back">
        <div className="table-container">
          <table className="table-body">
            <thead className="head">
              <tr>
                <th>Name</th>
                <th>Description</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Target Amount</th>
                <th>Current Amount Raised</th>
                <th>Status</th>
                <th>Organization ID</th>
                <th>Donate</th>
              </tr>
            </thead>
            <tbody>
              {campaigns.map((campaign) => (
                <tr key={campaign.id}>
                  <td>{campaign.name}</td>
                  <td>{campaign.description}</td>
                  <td>{campaign.startDate}</td>
                  <td>{campaign.endDate}</td>
                  <td>{campaign.targetAmount}</td>
                  <td>{campaign.currentAmountRaised}</td>
                  <td>{campaign.status}</td>
                  <td>{campaign.organizationID}</td>
                  <td>
                    <input
                      type="number"
                      placeholder="Enter amount"
                      value={donationAmount}
                      onChange={(e) => setDonationAmount(e.target.value)}
                      disabled={!userInDonorsCollection}
                    />
                    <button
                      onClick={() => handleDonate(campaign.id, campaign.name)}
                      disabled={!userInDonorsCollection}
                    >
                      Donate
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Listcampaigns;
