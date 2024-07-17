import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fs, auth, FieldValue } from '../../Config/Config';
import './projectDetails.css';

const ProjectDetails = () => {
    const { id: projectId } = useParams();
    const navigate = useNavigate();
    const [project, setProject] = useState(null);
    const [volunteerName, setVolunteerName] = useState("");
    const [volunteerContact, setVolunteerContact] = useState("");
    const [franchiseTitle, setFranchiseTitle] = useState("");
    const [franchiseContact, setFranchiseContact] = useState("");
    const [currentUser, setCurrentUser] = useState(null);
    const [userInDonorsCollection, setUserInDonorsCollection] = useState(false);
    const [donationAmount, setDonationAmount] = useState(""); // State for donation amount input
    const [donationDisabled, setDonationDisabled] = useState(false); // State to manage the disable state of the donate button
    const [projectCompleted, setProjectCompleted] = useState(false); // State to show project completion message

    const fetchProjectDetails = useCallback(async () => {
        try {
            const projectRef = fs.collection("projects").doc(projectId);
            const projectDoc = await projectRef.get();
            if (projectDoc.exists) {
                const projectData = projectDoc.data();
                setProject(projectData);

                if (projectData.volunteerID) {
                    const volunteerRef = fs.collection("volunteer").doc(projectData.volunteerID);
                    const volunteerDoc = await volunteerRef.get();
                    if (volunteerDoc.exists) {
                        setVolunteerName(volunteerDoc.data().displayName);
                        setVolunteerContact(volunteerDoc.data().phoneNumber);
                    }
                }

                if (projectData.franchiseID) {
                    const franchiseRef = fs.collection("franchise").doc(projectData.franchiseID);
                    const franchiseDoc = await franchiseRef.get();
                    if (franchiseDoc.exists) {
                        setFranchiseTitle(franchiseDoc.data().name);
                        setFranchiseContact(franchiseDoc.data().contact);
                    }
                }
            }
        } catch (error) {
            console.error("Error fetching project details:", error);
        }
    }, [projectId]);

    useEffect(() => {
        fetchProjectDetails();

        const unsubscribe = auth.onAuthStateChanged((user) => {
            setCurrentUser(user);
            checkUserInDonorsCollection(user);
        });

        return () => unsubscribe();
    }, [fetchProjectDetails, projectId]);

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

    const handleDonate = async () => {
        setDonationAmount("");
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

            const projectToUpdate = project;

            if (!projectToUpdate) {
                throw new Error("Project not found");
            }

            const remainingAmount = parseInt(projectToUpdate.targetAmount) - parseInt(projectToUpdate.collectedAmount);

            if (amount > remainingAmount) {
                throw new Error(`You can only donate up to $${remainingAmount}`);
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
                        projectName: project.title,
                        idType: "Project",
                        projectId: projectId,
                        amount: amount,
                        timestamp: new Date().toISOString(),
                    }),
                });
            } else {
                await transactionDocRef.set({
                    history: [
                        {
                            projectName: project.title,
                            idType: "Project",
                            projectId: projectId,
                            amount: amount,
                            timestamp: new Date().toISOString(),
                        },
                    ],
                });
            }

            if (updatedCollectedAmount >= parseInt(projectToUpdate.targetAmount)) {
                const completedProjectData = { ...projectToUpdate, id: projectId };
                delete completedProjectData.collectedAmount;

                await fs.collection("completedProjects").doc(projectId).set(completedProjectData);
                await fs.collection("projects").doc(projectId).delete();

                const volunteerId = projectToUpdate.volunteerID;
                if (volunteerId) {
                    const volunteerRef = fs.collection("volunteer").doc(volunteerId);
                    const volunteerSnapshot = await volunteerRef.get();

                    if (volunteerSnapshot.exists) {
                        const volunteerData = volunteerSnapshot.data();
                        const currentProjectsCompleted = volunteerData.Projectscompleted || 0;
                        await volunteerRef.update({
                            Projectscompleted: currentProjectsCompleted + 1,
                        });
                    } else {
                        await volunteerRef.set({
                            Projectscompleted: 1,
                        });
                    }
                }

                setProjectCompleted(true);
                setTimeout(() => navigate('/listedprojects'), 3000);
            } else {
                fetchProjectDetails();
            }

        } catch (error) {
            console.error("Error donating:", error);
        }
    };

    useEffect(() => {
        if (project) {
            const remainingAmount = parseInt(project.targetAmount) - parseInt(project.collectedAmount);
            setDonationDisabled(donationAmount > remainingAmount);
        }
    }, [donationAmount, project]);

    if (!project) return <div>Loading...</div>;

    if (projectCompleted) {
        return <div>Project completed. Thank you for donating!</div>;
    }

    return (
        <div className='desc-details'>
            <h1 className='desc-title'>{project.title}</h1>
            <div className='desc-container'>
                <div className="desc-volunteer-profile">
                    <p className='desc-volunteer'>Volunteer: <span className='volunteer-name'> {volunteerName}</span> </p>
                    <p className='desc-contact'>Volunteer-Contact: <span className='volunteer-name'>{volunteerContact}</span> </p>
                </div>
                <div className='desc-line'></div>
                <div className="desc-volunteer-profile">
                    <p className='desc-volunteer'>Franchise: <span className='volunteer-name'> {franchiseTitle}</span> </p>
                    <p className='desc-contact'>Franchise-Contact: <span className='volunteer-name'>{franchiseContact}</span> </p>
                </div>
                <div className="desc-dates">
                    <div className="desc-start">Start Date</div>
                    <div className="desc-end">End Date</div>

                </div>
                <div className="desc-dates">
                    <div className="desc-start-date">{project.startDate}</div>
                    <div className="desc-end-date">{project.endDate}</div>
                </div>

                <p className='desc-description'>{project.description}</p>


                <p className='desc-required'><span className='desc-target '>Target Amount:</span><span className='desc-amount'> ${project.targetAmount}</span></p>
                <p className='desc-required'><span className='desc-target-collected'>Collected Amount:</span><span className='desc-amount-collected'> ${project.collectedAmount}</span></p>
            </div>

            {/* Donation Section */}
            {currentUser && userInDonorsCollection && (
                <div className='donation-section'>
                    <input
                        className='donation-input'
                        type="number"
                        placeholder="Enter donation amount"
                        value={donationAmount}
                        onChange={(e) => setDonationAmount(e.target.value)}
                    />
                    <button className='donate-button' onClick={handleDonate} disabled={donationDisabled}>Donate</button>
                    {donationDisabled && <p className='donation-error'>Cannot donate more than the remaining amount.</p>}
                </div>
            )}
        </div>

    );
};

export default ProjectDetails;
