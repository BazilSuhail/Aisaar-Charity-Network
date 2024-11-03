import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { fs, auth, FieldValue } from '../../Config/Config';

const ProjectDetails = ({ onClose, id }) => {
    const projectId = useMemo(() => id, [id]);
    const navigate = useNavigate();
    const [project, setProject] = useState(null);
    const [volunteer, setVolunteer] = useState({});
    const [franchise, setFranchise] = useState({});
    const [currentUser, setCurrentUser] = useState(null);
    const [donationAmount, setDonationAmount] = useState("");
    const [donationDisabled, setDonationDisabled] = useState(false);
    const [projectCompleted, setProjectCompleted] = useState(false);

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
                        setVolunteer(volunteerDoc.data());
                    }
                }

                if (projectData.franchiseID) {
                    const franchiseRef = fs.collection("franchise").doc(projectData.franchiseID);
                    const franchiseDoc = await franchiseRef.get();
                    if (franchiseDoc.exists) {
                        setFranchise(franchiseDoc.data());
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
        });

        return () => unsubscribe();
    }, [fetchProjectDetails]);

    const handleDonate = useCallback(async () => {
        setDonationAmount("");
        if (!currentUser) return;

        const amount = parseInt(donationAmount);
        if (isNaN(amount) || amount <= 0 || amount > project.targetAmount - project.collectedAmount) {
            alert(`Please enter a valid donation up to $${project.targetAmount - project.collectedAmount}`);
            return;
        }
        const projectToUpdate = project;

        try {
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
    }, [donationAmount, project, projectId, currentUser,fetchProjectDetails , navigate]);

    useEffect(() => {
        if (project) {
            setDonationDisabled(donationAmount > project.targetAmount - project.collectedAmount);
        }
    }, [donationAmount, project]);

    if (!project) return <div className="flex items-center justify-center h-full">Loading...</div>;

    if (projectCompleted) {
        return <div className="text-center text-green-600 mt-4">Project completed. Thank you for donating!</div>;
    }

    return (
        <div className="flex fixed items-center justify-center z-50 inset-0 bg-black bg-opacity-50 p-4">
            <div className="bg-white p-6 rounded-md w-full max-w-lg shadow-lg">
                <button className="text-gray-500 hover:text-gray-800 text-lg mb-4" onClick={onClose}>Close</button>
                <h1 className="text-2xl font-semibold mb-4">{project.title}</h1>

                <div className="border-b border-gray-300 pb-4 mb-4">
                    <p><strong>Volunteer:</strong> {volunteer.displayName || "N/A"}</p>
                    <p><strong>Contact:</strong> {volunteer.phoneNumber || "N/A"}</p>
                </div>

                <div className="border-b border-gray-300 pb-4 mb-4">
                    <p><strong>Franchise:</strong> {franchise.name || "N/A"}</p>
                    <p><strong>Contact:</strong> {franchise.contact || "N/A"}</p>
                </div>

                <div className="mb-4">
                    <p><strong>Start Date:</strong> {project.startDate}</p>
                    <p><strong>End Date:</strong> {project.endDate}</p>
                    <p className="mt-2"><strong>Description:</strong> {project.ription}</p>
                </div>

                <div className="mb-4">
                    <p><strong>Target Amount:</strong> ${project.targetAmount}</p>
                    <p><strong>Collected Amount:</strong> ${project.collectedAmount}</p>
                </div>

                {currentUser && (
                    <div className="mt-4">
                        <input
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-300 mb-2"
                            type="number"
                            placeholder="Enter donation amount"
                            value={donationAmount}
                            onChange={(e) => setDonationAmount(e.target.value)}
                        />
                        <button
                            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 disabled:opacity-50"
                            onClick={handleDonate}
                            disabled={donationDisabled}
                        >
                            Donate
                        </button>
                        {donationDisabled && (
                            <p className="text-red-500 mt-2">Cannot donate more than the remaining amount.</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProjectDetails;
