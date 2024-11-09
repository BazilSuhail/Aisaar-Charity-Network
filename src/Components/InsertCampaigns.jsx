import React, { useState } from 'react'
import { fs } from '../Config/Config';

const InsertCampaigns = () => {
    const [loading, setLoading] = useState(false);

    const dummyData = [
        {
            "name": "Save the Oceans",
            "description": "A campaign to reduce ocean pollution and protect marine life.",
            "startDate": "2023-01-01",
            "endDate": "2023-06-30",
            "targetAmount": "50000",
            "currentAmountRaised": "20000",
            "status": "active",
            "franchiseID": "jdwSQECOmjREwbotqGs37tdg34C3"
        },
        {
            "name": "Feed the Hungry",
            "description": "Providing meals to underprivileged communities around the world.",
            "startDate": "2023-02-01",
            "endDate": "2023-07-31",
            "targetAmount": "60000",
            "currentAmountRaised": "35000",
            "status": "active",
            "franchiseID": "jdwSQECOmjREwbotqGs37tdg34C3"
        },
        {
            "name": "Build Schools in Africa",
            "description": "Constructing schools in rural areas to provide education for children.",
            "startDate": "2023-03-01",
            "endDate": "2023-08-31",
            "targetAmount": "75000",
            "currentAmountRaised": "45000",
            "status": "active",
            "franchiseID": "jdwSQECOmjREwbotqGs37tdg34C3"
        },
        {
            "name": "Wildlife Conservation",
            "description": "Protecting endangered species and their habitats.",
            "startDate": "2023-04-01",
            "endDate": "2023-09-30",
            "targetAmount": "80000",
            "currentAmountRaised": "30000",
            "status": "active",
            "franchiseID": "jdwSQECOmjREwbotqGs37tdg34C3"
        },
        {
            "name": "Disaster Relief Fund",
            "description": "Supporting victims of natural disasters with immediate relief and rebuilding efforts.",
            "startDate": "2023-05-01",
            "endDate": "2023-10-31",
            "targetAmount": "90000",
            "currentAmountRaised": "50000",
            "status": "active",
            "franchiseID": "jdwSQECOmjREwbotqGs37tdg34C3"
        },
        {
            "name": "Clean Water Initiative",
            "description": "Providing access to clean and safe drinking water in developing countries.",
            "startDate": "2023-06-01",
            "endDate": "2023-11-30",
            "targetAmount": "65000",
            "currentAmountRaised": "25000",
            "status": "active",
            "franchiseID": "jdwSQECOmjREwbotqGs37tdg34C3"
        },
        {
            "name": "Support Refugees",
            "description": "Offering aid and support to refugees displaced by conflict and persecution.",
            "startDate": "2023-07-01",
            "endDate": "2023-12-31",
            "targetAmount": "70000",
            "currentAmountRaised": "40000",
            "status": "active",
            "franchiseID": "jdwSQECOmjREwbotqGs37tdg34C3"
        },
        {
            "name": "Healthcare for All",
            "description": "Providing medical care and supplies to underserved communities.",
            "startDate": "2023-08-01",
            "endDate": "2024-01-31",
            "targetAmount": "85000",
            "currentAmountRaised": "60000",
            "status": "active",
            "franchiseID": "jdwSQECOmjREwbotqGs37tdg34C3"
        },
        {
            "name": "Education for Girls",
            "description": "Promoting education for girls in regions where access is limited.",
            "startDate": "2023-09-01",
            "endDate": "2024-02-29",
            "targetAmount": "95000",
            "currentAmountRaised": "70000",
            "status": "active",
            "franchiseID": "jdwSQECOmjREwbotqGs37tdg34C3"
        },
        {
            "name": "Plant a Billion Trees",
            "description": "Aiming to plant one billion trees to combat climate change.",
            "startDate": "2023-10-01",
            "endDate": "2024-03-31",
            "targetAmount": "100000",
            "currentAmountRaised": "45000",
            "status": "active",
            "franchiseID": "jdwSQECOmjREwbotqGs37tdg34C3"
        },
        {
            "name": "Support Mental Health",
            "description": "Providing mental health resources and support to those in need.",
            "startDate": "2023-11-01",
            "endDate": "2024-04-30",
            "targetAmount": "55000",
            "currentAmountRaised": "30000",
            "status": "active",
            "franchiseID": "jdwSQECOmjREwbotqGs37tdg34C3"
        },
        {
            "name": "Veterans Assistance",
            "description": "Supporting veterans with housing, employment, and mental health services.",
            "startDate": "2023-12-01",
            "endDate": "2024-05-31",
            "targetAmount": "60000",
            "currentAmountRaised": "25000",
            "status": "active",
            "franchiseID": "jdwSQECOmjREwbotqGs37tdg34C3"
        }
    ];
 
    const addDataToFirestore = async () => {
        setLoading(true);
        const batch = fs.batch();

        dummyData.forEach((data) => {
            const docRef = fs.collection("campaigns").doc();
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
        <div className='mt-[88px]'>
            <button onClick={addDataToFirestore} disabled={loading}>
                {loading ? "Adding Data..." : "Add Dummy Data"}
            </button>
        </div>
    );
};

export default InsertCampaigns
