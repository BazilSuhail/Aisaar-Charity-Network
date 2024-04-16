import React, { useState } from 'react';
import "./Styles/projList.css";

const Projectcomp = ({ project, currentUser, handleDonate, userInDonorsCollection }) => {
    const [localDonationAmount, setLocalDonationAmount] = useState(0);

    const handleDonateClick = () => {
        handleDonate(project.id, localDonationAmount,project.title); // Pass localDonationAmount to handleDonate
        // Clear input field after donation
        alert(localDonationAmount + " Donated");
        setLocalDonationAmount(0);
    };
    
    return (
        <div className='render'>
            <div className='name-cont'><span className='name'>{project.title}</span></div>
            <div><strong>Description:</strong> {project.description}</div>
            <div><strong>Start Date:</strong> {project.startDate}</div>
            <div><strong>End Date:</strong> {project.endDate}</div>
            <div><strong>Target Amount:</strong> {project.targetAmount}</div>
            <div><strong>Organization  ID:</strong> {project.organizationID}</div>
            
            <div><strong>Collected Amount:</strong> {project.collectedAmount}</div>
            <div><strong>Status:</strong> {project.status}</div>
            
            {/* Conditionally render input field and button */}
            {userInDonorsCollection && (
                <div className='don-cont'>
                    <input className='donations'
                        type="number"
                        placeholder="Enter amount"
                        onChange={(e) => setLocalDonationAmount(e.target.value)}
                    />
                    <button
                        className='handle-donations'
                        onClick={handleDonateClick}
                        disabled={localDonationAmount <= 0}
                    >
                        Donate
                    </button>
                </div>
            )}
        </div>
    );
};

export default Projectcomp;
