import React, { useState, useEffect } from 'react';
import { fs } from '../../Config/Config';

const CampaignComp = ({ campaign, handleDonate, userInDonorsCollection }) => {
    const [localDonationAmount, setLocalDonationAmount] = useState(0);
    const [donationComplete, setDonationComplete] = useState(false);
    const [franchiseTitle, setFranchiseTitle] = useState("");
    const [donationDisabled, setDonationDisabled] = useState(false); // State to manage the disable state of the donate button

    useEffect(() => {
        const fetchFranchiseTitle = async () => {
            if (campaign.franchiseID) {
                const franchiseRef = fs.collection("franchise").doc(campaign.franchiseID);
                const franchiseDoc = await franchiseRef.get();
                if (franchiseDoc.exists) {
                    setFranchiseTitle(franchiseDoc.data().name);
                }
            }
        };

        fetchFranchiseTitle();
    }, [campaign.franchiseID]);

    useEffect(() => {
        if (campaign) {
            const remainingAmount = parseInt(campaign.targetAmount) - parseInt(campaign.currentAmountRaised);
            setDonationDisabled(localDonationAmount > remainingAmount);
        }
    }, [localDonationAmount, campaign]);

    const handleDonateClick = () => {
        handleDonate(campaign.id, localDonationAmount, campaign.name);
        setDonationComplete(true);
        setTimeout(() => {
            setLocalDonationAmount(0);
            setDonationComplete(false);
        }, 2000);
    };

    return (
        <div className="mx-[25px] p-6 bg-white border rounded-sm shadow-md">
            <h2 className="text-2xl font-bold text-center mb-2">{campaign.name}</h2>
            <p className="text-center text-sm text-gray-500 mb-2">
                Regulating Franchise: <span className="font-semibold">{franchiseTitle}</span>
            </p>

            <div className="flex justify-between mb-4">
                <div className="text-sm text-gray-600">
                    <p className="font-semibold">Contact:</p>
                    <p>0354656846568</p>
                </div>
                <div className="text-sm text-gray-600">
                    <p className="font-semibold">Location:</p>
                    <p>Gulberg 34, Berlin</p>
                </div>
            </div>

            <div className="mb-4">
                <h3 className="text-lg font-semibold mb-1">Description</h3>
                <p className="text-sm text-gray-500">{campaign.description}</p>
            </div>

            <div className="flex justify-between mb-4 text-sm text-gray-600">
                <div>
                    <p className="font-semibold">Start Date</p>
                    <p>{campaign.startDate}</p>
                </div>
                <div>
                    <p className="font-semibold">End Date</p>
                    <p>{campaign.endDate}</p>
                </div>
            </div>

            <div className="flex justify-between items-center mb-4">
                <span className="text-sm text-gray-600">Collected: ${campaign.currentAmountRaised}</span>
                <span className="text-sm font-semibold text-green-800">Goal: ${campaign.targetAmount}</span>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                <div
                    className="bg-green-500 h-2 rounded-full"
                    style={{ width: `${Math.min((campaign.currentAmountRaised / campaign.targetAmount) * 100, 100)}%` }}
                ></div>
            </div>

            <div className="text-sm text-gray-600 mb-4">
                Status: <span className={`font-semibold text-white px-[10px] py-[3px] rounded-lg  ${campaign.status === 'Active' ? 'bg-green-700' : 'bg-yellow-500'}`}>{campaign.status}</span>
            </div>

            {userInDonorsCollection && !donationComplete && (
                <div className="flex items-center space-x-2">
                    <input
                        className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                        type="number"
                        placeholder="Enter amount"
                        onChange={(e) => setLocalDonationAmount(e.target.value)}
                    />
                    <button
                        onClick={handleDonateClick}
                        disabled={donationDisabled}
                        className="w-full px-4 py-2 bg-green-500 text-white font-semibold rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
                    >
                        Donate
                    </button>
                </div>
            )}

            {donationComplete && <div className="text-center font-semibold text-green-600 mt-4">DONATING !!</div>}
        </div>
    );
};

export default CampaignComp;
