import React, { useEffect, useState } from "react";
import { fs, auth } from "../Config/Config";
import { FieldValue } from "../Config/Config";

import Footer from "./Footer";
import CampaignComp from "./CampaignComp.jsx";
import "./Styles/campaignList.css";

const Listcampaigns = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [userInDonorsCollection, setUserInDonorsCollection] = useState(false);

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

      setUpdatecampaigns(prevState => !prevState);
    }
    catch (error) {
      console.error("Error donating:", error);
    }
  };

  return (
    <div className="campaign">
      <div className="camp-heading">Registered Campaigns</div>

      <div className="render-campaigns"></div>

      <div className='c-render'>

        <div className="camp-details">
          <div className='c-title'>Kheton ka khana</div>
          <div className='c-franchise'>Regulating Franchise : <div className="franchise-name">Aisaar 5001</div></div>

          <div className="franchise-props">
            <div className='cont-loc'>Contact</div>
            <div className='cont-loc'>Location</div>
          </div>

          <div className="franchise-props-values">
            <div className='cont-loc-values'>0354656846568</div>
            <div className='cont-loc-values'>Gulberg 34,berlin</div>
          </div>
        </div>

        <div className="camp-description">
          <div className='c-desc-cont'>
            <div className="c-head-desc">   Description  </div>
            <div className="c-actual-desc"> asdasdasds das d as dasd a sdasd </div>
          </div>

          <div className="c-dates">
            <div className="c-start">Start Date</div>
            <div className="c-start-date">12-2-2022</div>

          </div>
          <div className="c-dates">
            <div className="c-end">End Date</div>
            <div className="c-end-date">12-2-2022</div>
          </div>
        </div>

        <div className="camp-donation">
          <div className='c-target-cont'>Target Amount: <div className="c-target-amt">$123333</div></div>
          <div className='c-collected-cont'>Collected Amount: <div className="c-collected-amt">$12656543333</div></div>

          <div className='c-status-cont'>Status:<div className="c-status-actual">In progress</div></div>

          <div className='c-don-cont'>
            <input className='c-donations' type="number" placeholder="Enter amount" />
            <button className='c-handle-donations'>
              Donate
            </button>
          </div>
        </div>




      </div>
      <div className='c-render'>

        <div className="camp-details">
          <div className='c-title'>Kheton ka khana</div>
          <div className='c-franchise'>Regulating Franchise : <div className="franchise-name">Aisaar 5001</div></div>

          <div className="franchise-props">
            <div className='cont-loc'>Contact</div>
            <div className='cont-loc'>Location</div>
          </div>

          <div className="franchise-props-values">
            <div className='cont-loc-values'>0354656846568</div>
            <div className='cont-loc-values'>Gulberg 34,berlin</div>
          </div>
        </div>

        <div className="camp-description">
          <div className='c-desc-cont'>
            <div className="c-head-desc">   Description  </div>
            <div className="c-actual-desc"> asdasdasds das d as dasd a sdasd </div>
          </div>

          <div className="c-dates">
            <div className="c-start">Start Date</div>
            <div className="c-start-date">12-2-2022</div>

          </div>
          <div className="c-dates">
            <div className="c-end">End Date</div>
            <div className="c-end-date">12-2-2022</div>
          </div>
        </div>

        <div className="camp-donation">
          <div className='c-target-cont'>Target Amount: <div className="c-target-amt">$123333</div></div>
          <div className='c-collected-cont'>Collected Amount: <div className="c-collected-amt">$12656543333</div></div>

          <div className='c-status-cont'>Status:<div className="c-status-actual">In progress</div></div>

          <div className='c-don-cont'>
            <input className='c-donations' type="number" placeholder="Enter amount" />
            <button className='c-handle-donations'>
              Donate
            </button>
          </div>
        </div>




      </div><div className='c-render'>

        <div className="camp-details">
          <div className='c-title'>Kheton ka khana</div>
          <div className='c-franchise'>Regulating Franchise : <div className="franchise-name">Aisaar 5001</div></div>

          <div className="franchise-props">
            <div className='cont-loc'>Contact</div>
            <div className='cont-loc'>Location</div>
          </div>

          <div className="franchise-props-values">
            <div className='cont-loc-values'>0354656846568</div>
            <div className='cont-loc-values'>Gulberg 34,berlin</div>
          </div>
        </div>

        <div className="camp-description">
          <div className='c-desc-cont'>
            <div className="c-head-desc">   Description  </div>
            <div className="c-actual-desc"> asdasdasds das d as dasd a sdasd </div>
          </div>

          <div className="c-dates">
            <div className="c-start">Start Date</div>
            <div className="c-start-date">12-2-2022</div>

          </div>
          <div className="c-dates">
            <div className="c-end">End Date</div>
            <div className="c-end-date">12-2-2022</div>
          </div>
        </div>

        <div className="camp-donation">
          <div className='c-target-cont'>Target Amount: <div className="c-target-amt">$123333</div></div>
          <div className='c-collected-cont'>Collected Amount: <div className="c-collected-amt">$12656543333</div></div>

          <div className='c-status-cont'>Status:<div className="c-status-actual">In progress</div></div>

          <div className='c-don-cont'>
            <input className='c-donations' type="number" placeholder="Enter amount" />
            <button className='c-handle-donations'>
              Donate
            </button>
          </div>
        </div>




      </div><div className='c-render'>

        <div className="camp-details">
          <div className='c-title'>Kheton ka khana</div>
          <div className='c-franchise'>Regulating Franchise : <div className="franchise-name">Aisaar 5001</div></div>

          <div className="franchise-props">
            <div className='cont-loc'>Contact</div>
            <div className='cont-loc'>Location</div>
          </div>

          <div className="franchise-props-values">
            <div className='cont-loc-values'>0354656846568</div>
            <div className='cont-loc-values'>Gulberg 34,berlin</div>
          </div>
        </div>

        <div className="camp-description">
          <div className='c-desc-cont'>
            <div className="c-head-desc">   Description  </div>
            <div className="c-actual-desc"> asdasdasds das d as dasd a sdasd </div>
          </div>

          <div className="c-dates">
            <div className="c-start">Start Date</div>
            <div className="c-start-date">12-2-2022</div>

          </div>
          <div className="c-dates">
            <div className="c-end">End Date</div>
            <div className="c-end-date">12-2-2022</div>
          </div>
        </div>

        <div className="camp-donation">
          <div className='c-target-cont'>Target Amount: <div className="c-target-amt">$123333</div></div>
          <div className='c-collected-cont'>Collected Amount: <div className="c-collected-amt">$12656543333</div></div>

          <div className='c-status-cont'>Status:<div className="c-status-actual">In progress</div></div>

          <div className='c-don-cont'>
            <input className='c-donations' type="number" placeholder="Enter amount" />
            <button className='c-handle-donations'>
              Donate
            </button>
          </div>
        </div>




      </div>
      {
        /*
        
          <div className="renderObjects">
            {campaigns.map((campaign) => (
              <CampaignComp
                key={campaign.id}
                campaign={campaign}
                handleDonate={handleDonate}
                userInDonorsCollection={userInDonorsCollection}
              />
            ))}
          </div>*/
      }
      <Footer />
    </div>
  );
};

export default Listcampaigns;
