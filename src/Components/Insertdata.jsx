import React, { useState } from "react";
import { fs } from "../Config/Config"; // Assuming firebaseConfig is imported properly

const AddDummyDataToFirestore = () => {
    const [loading, setLoading] = useState(false);

    const dummyData = [
        {
            "title": "Fundraiser 1",
            "description": "Helping local shelters",
            "startDate": "2024-05-04",
            "endDate": "2024-06-04",
            "targetAmount": "5000",
            "status": "Active",
            "volunteerID": "1ZfTADFfAxeWeW4DFBMLZRjA4wj2",
            "franchiseID": "fran456",
            "collectedAmount": "2500"
        },
        {
            "title": "Fundraiser 2",
            "description": "Environmental conservation",
            "startDate": "2024-05-10",
            "endDate": "2024-06-10",
            "targetAmount": "10000",
            "status": "Active",
            "volunteerID": "UzrnsNQGhiR0DHijVfXzP9qYEf43",
            "franchiseID": "fran567",
            "collectedAmount": "7500"
        },
        {
            "title": "Fundraiser 3",
            "description": "Children's education",
            "startDate": "2024-06-01",
            "endDate": "2024-07-01",
            "targetAmount": "8000",
            "status": "Active",
            "volunteerID": "UzrnsNQGhiR0DHijVfXzP9qYEf43",
            "franchiseID": "fran678",
            "collectedAmount": "3000"
        },
        {
            "title": "Fundraiser 4",
            "description": "Supporting elderly care",
            "startDate": "2024-06-15",
            "endDate": "2024-07-15",
            "targetAmount": "6000",
            "status": "Active",
            "volunteerID": "UzrnsNQGhiR0DHijVfXzP9qYEf43",
            "franchiseID": "fran789",
            "collectedAmount": "4000"
        },
        {
            "title": "Fundraiser 5",
            "description": "Disaster relief efforts",
            "startDate": "2024-07-01",
            "endDate": "2024-08-01",
            "targetAmount": "12000",
            "status": "Active",
            "volunteerID": "UzrnsNQGhiR0DHijVfXzP9qYEf43",
            "franchiseID": "fran890",
            "collectedAmount": "8000"
        },
        {
            "title": "Fundraiser 6",
            "description": "Animal welfare",
            "startDate": "2024-07-10",
            "endDate": "2024-08-10",
            "targetAmount": "7000",
            "status": "Active",
            "volunteerID": "UzrnsNQGhiR0DHijVfXzP9qYEf43",
            "franchiseID": "fran901",
            "collectedAmount": "5500"
        },
        {
            "title": "Fundraiser 7",
            "description": "Promoting arts and culture",
            "startDate": "2024-08-01",
            "endDate": "2024-09-01",
            "targetAmount": "9000",
            "status": "Active",
            "volunteerID": "UzrnsNQGhiR0DHijVfXzP9qYEf43",
            "franchiseID": "fran012",
            "collectedAmount": "6000"
        },
        {
            "title": "Fundraiser 8",
            "description": "Community health initiatives",
            "startDate": "2024-08-15",
            "endDate": "2024-09-15",
            "targetAmount": "10000",
            "status": "Active",
            "volunteerID": "WrTEhNisDbfvlpfaLLryvZWjfq62",
            "franchiseID": "fran123",
            "collectedAmount": "8500"
        },
        {
            "title": "Fundraiser 9",
            "description": "Empowering women",
            "startDate": "2024-09-01",
            "endDate": "2024-10-01",
            "targetAmount": "8000",
            "status": "Active",
            "volunteerID": "WrTEhNisDbfvlpfaLLryvZWjfq62",
            "franchiseID": "fran234",
            "collectedAmount": "5000"
        },
        {
            "title": "Fundraiser 10",
            "description": "Youth development programs",
            "startDate": "2024-09-10",
            "endDate": "2024-10-10",
            "targetAmount": "11000",
            "status": "Active",
            "volunteerID": "WrTEhNisDbfvlpfaLLryvZWjfq62",
            "franchiseID": "fran345",
            "collectedAmount": "7000"
        },
        {
            "title": "Fundraiser 11",
            "description": "Promoting literacy",
            "startDate": "2024-10-01",
            "endDate": "2024-11-01",
            "targetAmount": "7000",
            "status": "Active",
            "volunteerID": "WrTEhNisDbfvlpfaLLryvZWjfq62",
            "franchiseID": "fran456",
            "collectedAmount": "4500"
        },
        {
            "title": "Fundraiser 12",
            "description": "Combatting hunger",
            "startDate": "2024-10-15",
            "endDate": "2024-11-15",
            "targetAmount": "8000",
            "status": "Active",
            "volunteerID": "WrTEhNisDbfvlpfaLLryvZWjfq62",
            "franchiseID": "fran567",
            "collectedAmount": "6000"
        },
        {
            "title": "Fundraiser 13",
            "description": "Promoting mental health awareness",
            "startDate": "2024-11-01",
            "endDate": "2024-12-01",
            "targetAmount": "10000",
            "status": "Active",
            "volunteerID": "c4385OAVvFVm30CF6goOjBbBCuv1",
            "franchiseID": "fran678",
            "collectedAmount": "8500"
        },
        {
            "title": "Fundraiser 14",
            "description": "Cancer research funding",
            "startDate": "2024-11-10",
            "endDate": "2024-12-10",
            "targetAmount": "12000",
            "status": "Active",
            "volunteerID": "c4385OAVvFVm30CF6goOjBbBCuv1",
            "franchiseID": "fran789",
            "collectedAmount": "9500"
        },
        {
            "title": "Fundraiser 15",
            "description": "Supporting LGBTQ+ community",
            "startDate": "2024-12-01",
            "endDate": "2025-01-01",
            "targetAmount": "9000",
            "status": "Active",
            "volunteerID": "c4385OAVvFVm30CF6goOjBbBCuv1",
            "franchiseID": "fran890",
            "collectedAmount": "7500"
        },
        {
            "title": "Fundraiser 16",
            "description": "Emergency medical aid",
            "startDate": "2025-01-01",
            "endDate": "2025-02-01",
            "targetAmount": "15000",
            "status": "Active",
            "volunteerID": "c4385OAVvFVm30CF6goOjBbBCuv1",
            "franchiseID": "fran901",
            "collectedAmount": "12000"
        },
        {
            "title": "Fundraiser 17",
            "description": "Promoting sustainable living",
            "startDate": "2025-01-10",
            "endDate": "2025-02-10",
            "targetAmount": "10000",
            "status": "Active",
            "volunteerID": "c4385OAVvFVm30CF6goOjBbBCuv1",
            "franchiseID": "fran012",
            "collectedAmount": "8500"
        },
        {
            "title": "Fundraiser 18",
            "description": "Disability rights advocacy",
            "startDate": "2025-02-01",
            "endDate": "2025-03-01",
            "targetAmount": "8000",
            "status": "Active",
            "volunteerID": "c4385OAVvFVm30CF6goOjBbBCuv1",
            "franchiseID": "fran123",
            "collectedAmount": "6000"
        },
        {
            "title": "Fundraiser 19",
            "description": "Promoting cultural diversity",
            "startDate": "2025-02-10",
            "endDate": "2025-03-10",
            "targetAmount": "11000",
            "status": "Active",
            "volunteerID": "c4385OAVvFVm30CF6goOjBbBCuv1",
            "franchiseID": "fran234",
            "collectedAmount": "9000"
        },
        {
            "title": "Fundraiser 20",
            "description": "Supporting small businesses",
            "startDate": "2025-03-01",
            "endDate": "2025-04-01",
            "targetAmount": "12000",
            "status": "Active",
            "volunteerID": "c4385OAVvFVm30CF6goOjBbBCuv1",
            "franchiseID": "fran345",
            "collectedAmount": "10000"
        }
    ];

    // Function to add data to Firestore
    const addDataToFirestore = async () => {
        setLoading(true);
        const batch = fs.batch();

        dummyData.forEach((data) => {
            const docRef = fs.collection("projects").doc();
            batch.set(docRef, data);
        });

        try {
            await batch.commit();
            console.log("Dummy data added to Firestore");
        } catch (error) {
            console.error("Error adding dummy data to Firestore:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <button onClick={addDataToFirestore} disabled={loading}>
                {loading ? "Adding Data..." : "Add Dummy Data"}
            </button>
        </div>
    );
};

export default AddDummyDataToFirestore;