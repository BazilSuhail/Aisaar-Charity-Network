import React, { useState } from "react";
import { fs } from "../Config/Config"; // Assuming firebaseConfig is imported properly

const AddDummyDataToFirestore = () => {
    const [loading, setLoading] = useState(false);

    const dummyData = [
        {
            "title": "Support for Local Shelters",
            "description": "Providing essential aid and support to local animal and human shelters in need.",
            "startDate": "2024-05-04",
            "endDate": "2024-06-04",
            "targetAmount": "5000",
            "status": "Active",
            "volunteerID": "1ZfTADFfAxeWeW4DFBMLZRjA4wj2",
            "franchiseID": "2plXpjvmljROLGZ6Q21LFpcIoP73",
            "collectedAmount": "2500"
        },
        {
            "title": "Green Earth Conservation",
            "description": "Initiatives for preserving the environment through conservation and community actions.",
            "startDate": "2024-05-10",
            "endDate": "2024-06-10",
            "targetAmount": "10000",
            "status": "Active",
            "volunteerID": "UzrnsNQGhiR0DHijVfXzP9qYEf43",
            "franchiseID": "2plXpjvmljROLGZ6Q21LFpcIoP73",
            "collectedAmount": "7500"
        },
        {
            "title": "Education for Children",
            "description": "Funding educational resources and support for underprivileged children to enhance learning.",
            "startDate": "2024-06-01",
            "endDate": "2024-07-01",
            "targetAmount": "8000",
            "status": "Active",
            "volunteerID": "UzrnsNQGhiR0DHijVfXzP9qYEf43",
            "franchiseID": "2plXpjvmljROLGZ6Q21LFpcIoP73",
            "collectedAmount": "3000"
        },
        {
            "title": "Elderly Care Support",
            "description": "Assisting elderly care facilities with resources and volunteer support for better services.",
            "startDate": "2024-06-15",
            "endDate": "2024-07-15",
            "targetAmount": "6000",
            "status": "Active",
            "volunteerID": "UzrnsNQGhiR0DHijVfXzP9qYEf43",
            "franchiseID": "2plXpjvmljROLGZ6Q21LFpcIoP73",
            "collectedAmount": "4000"
        },
        {
            "title": "Disaster Relief Efforts",
            "description": "Providing immediate relief to communities affected by natural disasters, like food and shelter.",
            "startDate": "2024-07-01",
            "endDate": "2024-08-01",
            "targetAmount": "12000",
            "status": "Active",
            "volunteerID": "UzrnsNQGhiR0DHijVfXzP9qYEf43",
            "franchiseID": "2plXpjvmljROLGZ6Q21LFpcIoP73",
            "collectedAmount": "10"
        },
        {
            "title": "Support for Animal Welfare",
            "description": "Aiding animal shelters and promoting animal welfare initiatives across local areas.",
            "startDate": "2024-07-10",
            "endDate": "2024-08-10",
            "targetAmount": "7000",
            "status": "Active",
            "volunteerID": "UzrnsNQGhiR0DHijVfXzP9qYEf43",
            "franchiseID": "2plXpjvmljROLGZ6Q21LFpcIoP73",
            "collectedAmount": "5500"
        },
        {
            "title": "Cultural and Arts Promotion",
            "description": "Encouraging local arts and cultural programs through community engagement and funding.",
            "startDate": "2024-08-01",
            "endDate": "2024-09-01",
            "targetAmount": "9000",
            "status": "Active",
            "volunteerID": "UzrnsNQGhiR0DHijVfXzP9qYEf43",
            "franchiseID": "2plXpjvmljROLGZ6Q21LFpcIoP73",
            "collectedAmount": "6000"
        },
        {
            "title": "Community Health Programs",
            "description": "Supporting community health by providing essential resources and medical aid to residents.",
            "startDate": "2024-08-15",
            "endDate": "2024-09-15",
            "targetAmount": "10000",
            "status": "Active",
            "volunteerID": "WrTEhNisDbfvlpfaLLryvZWjfq62",
            "franchiseID": "2plXpjvmljROLGZ6Q21LFpcIoP73",
            "collectedAmount": "8500"
        },
        {
            "title": "Empowering Women Initiatives",
            "description": "Programs aimed at empowering women through skills training and community support.",
            "startDate": "2024-09-01",
            "endDate": "2024-10-01",
            "targetAmount": "8000",
            "status": "Active",
            "volunteerID": "WrTEhNisDbfvlpfaLLryvZWjfq62",
            "franchiseID": "2plXpjvmljROLGZ6Q21LFpcIoP73",
            "collectedAmount": "5000"
        },
        {
            "title": "Youth Development Fund",
            "description": "Programs for youth development in skill enhancement and community involvement.",
            "startDate": "2024-09-10",
            "endDate": "2024-10-10",
            "targetAmount": "11000",
            "status": "Active",
            "volunteerID": "WrTEhNisDbfvlpfaLLryvZWjfq62",
            "franchiseID": "2plXpjvmljROLGZ6Q21LFpcIoP73",
            "collectedAmount": "7000"
        },
        {
            "title": "Literacy and Learning",
            "description": "Promoting literacy and learning through resources and educational programs in communities.",
            "startDate": "2024-10-01",
            "endDate": "2024-11-01",
            "targetAmount": "7000",
            "status": "Active",
            "volunteerID": "WrTEhNisDbfvlpfaLLryvZWjfq62",
            "franchiseID": "2plXpjvmljROLGZ6Q21LFpcIoP73",
            "collectedAmount": "4500"
        },
        {
            "title": "Hunger Alleviation Campaign",
            "description": "Supporting efforts to alleviate hunger through food distribution and aid programs.",
            "startDate": "2024-10-15",
            "endDate": "2024-11-15",
            "targetAmount": "8000",
            "status": "Active",
            "volunteerID": "WrTEhNisDbfvlpfaLLryvZWjfq62",
            "franchiseID": "2plXpjvmljROLGZ6Q21LFpcIoP73",
            "collectedAmount": "6000"
        }
    ];
    
 
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
        <div className='mt-[154px]'>
            <button onClick={addDataToFirestore} disabled={loading}>
                {loading ? "Adding Data..." : "Add Dummy Data"}
            </button>
        </div>
    );
};

export default AddDummyDataToFirestore;