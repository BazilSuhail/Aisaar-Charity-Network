import React, { useState, useEffect } from 'react';
import { fs } from '../Config/Config';
import "./Styles/projList.css";

const Projectcomp = ({ project, handleDonate, userInDonorsCollection }) => {
    const [localDonationAmount, setLocalDonationAmount] = useState(0);
    const [donationComplete, setDonationComplete] = useState(false);
    const [volunteerName, setVolunteerName] = useState("");
    const [volunteerContact, setVolunteercontact] = useState("");
    const [franchiseTitle, setFranchiseTitle] = useState("");

    useEffect(() => {
        const fetchVolunteerName = async () => {
            if (project.volunteerID) {
                const volunteerRef = fs.collection("volunteer").doc(project.volunteerID);
                const volunteerDoc = await volunteerRef.get();
                if (volunteerDoc.exists) {
                    setVolunteerName(volunteerDoc.data().displayName);

                    setVolunteercontact(volunteerDoc.data().phoneNumber);
                }
            }
        };
        const fetchFranchiseTitle = async () => {
            if (project.franchiseID) {
                const franchiseRef = fs.collection("franchise").doc(project.franchiseID);
                const franchiseDoc = await franchiseRef.get();
                if (franchiseDoc.exists) {
                    setFranchiseTitle(franchiseDoc.data().name);
                }
            }
        };

        fetchVolunteerName();
        fetchFranchiseTitle();
    }, [project.volunteerID, project.franchiseID]);

    const handleDonateClick = () => {
        handleDonate(project.id, localDonationAmount, project.title);
        setDonationComplete(true);
        setTimeout(() => {
            setLocalDonationAmount(0);
            setDonationComplete(false);
        }, 2000);
    };

    return (
        <div className='render'>
            <div className='name-cont'><span className='name'>{project.title}</span></div>

            <div className='volunteer-cont'>Volunteer / Manager : <div className="volunteer-name">{volunteerName}</div></div>
            <div className='volunteer-cont'>Franchise Monitoring : <div className="volunteer-name">{franchiseTitle}</div></div>
            <div className='contact-cont'>Contact Info: {volunteerContact}</div>
            <div className="dates">
                <div className="start">Start Date</div>
                <div className="end">End Date</div>
            </div>
            <div className="dates">
                <div className="start-date">{project.startDate}</div>
                <div className="end-date">{project.endDate}</div>
            </div>

            <div className='desc-cont'>
                <div className="head-desc">   Description  </div>
                <div className="actual-desc">  {project.description} </div>
            </div>

            <div className='target-cont'>Target Amount: <div className="target-amt">${project.targetAmount}</div></div>
            <div className='collected-cont'>Collected Amount: <div className="collected-amt">${project.collectedAmount}</div></div>

            <div className='status-cont'>Status:<div className="status-actual">{project.status}</div></div>


            {userInDonorsCollection && !donationComplete && (
                <div className='don-cont'>
                    <input className='donations' type="number" placeholder="Enter amount" onChange={(e) => setLocalDonationAmount(e.target.value)} />
                    <button className='handle-donations' onClick={handleDonateClick} disabled={localDonationAmount <= 0}>
                        Donate
                    </button>
                </div>
            )}

            {donationComplete && (<div className="loader">DONATING !!</div>)}
        </div>
    );
};

export default Projectcomp;
