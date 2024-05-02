import React, { useState, useEffect } from 'react';
import { fs } from '../Config/Config';
import Footer from "./Footer";
import "./Styles/home.css";
import "./Styles/tables.css";

const Gallery = () => {
    const [totalProjects, setTotalProjects] = useState(0);
    const [totalCampaigns, setTotalCampaigns] = useState(0);
    const [totalfranchises, setTotalfranchises] = useState(0);

    const [projects, setProjects] = useState([]);
    const [campaigns, setCampaigns] = useState([]);
    const [totalVolunteers, setTotalVolunteers] = useState(0);
    const [totalDonors, setTotalDonors] = useState(0);

    const [totalBeneficiaries, setTotalBeneficiaries] = useState(0);
    useEffect(() => {

        const fetchFranchises = async () => {
            try {
                const franchiseRef = fs.collection('franchise');
                const snapshot = await franchiseRef.get();
                setTotalfranchises(snapshot.size);
            } catch (error) {
                console.error('Error fetching organizations:', error.message);
            }
        };


        const fetchProjects = async () => {
            try {
                const projectsRef = fs.collection('projects');
                const snapshot = await projectsRef.get();
                const projectData = snapshot.docs.map(doc => doc.data());
                setProjects(projectData);
                setTotalProjects(snapshot.size); // Set the total number of projects
            } catch (error) {
                console.error('Error fetching projects:', error.message);
            }
        };

        const fetchCampaigns = async () => {
            try {
                const campaignsRef = fs.collection('campaigns');
                const snapshot = await campaignsRef.get();
                const campaignData = snapshot.docs.map(doc => doc.data());
                setCampaigns(campaignData);
                setTotalCampaigns(snapshot.size);
            } catch (error) {
                console.error('Error fetching campaigns:', error.message);
            }
        };


        const fetchBeneficiaries = async () => {
            try {
                const beneficiariesRef = fs.collection('beneficiaries');
                const snapshot = await beneficiariesRef.get();
                setTotalBeneficiaries(snapshot.size);
            } catch (error) {
                console.error('Error fetching beneficiaries:', error.message);
            }
        };

        const fetchTotalVolunteers = async () => {
            try {
                const volunteersRef = fs.collection('volunteer');
                const snapshot = await volunteersRef.get();
                const totalVolunteers = snapshot.size;
                setTotalVolunteers(totalVolunteers);
            } catch (error) {
                console.error('Error fetching total volunteers:', error.message);
            }
        };


        const fetchTotalDonors = async () => {
            try {
                const donorsRef = fs.collection('donors');
                const snapshot = await donorsRef.get();
                const totalDonors = snapshot.size;
                setTotalDonors(totalDonors);
            } catch (error) {
                console.error('Error fetching total donors:', error.message);
            }
        };

        fetchFranchises();
        fetchProjects();
        fetchCampaigns();
        fetchTotalVolunteers();
        fetchTotalDonors();
        fetchBeneficiaries();
    }, []);


    const projDonations = projects.reduce(
        (total, project) => total + parseInt(project.collectedAmount),
        0
    );

    const campDonations = campaigns.reduce(
        (total, campaign) => total + parseInt(campaign.currentAmountRaised),
        0
    );

    const overallDonation = projDonations + campDonations;


    const AnimatedCounter = ({ value, duration, start, incrementByHundred, val }) => {
        const [displayValue, setDisplayValue] = useState(0);

        useEffect(() => {
            let currentValue = 0;
            const endValue = parseInt(value);
            let incrementTime;

            if (incrementByHundred) {
                incrementTime = start;
            } else {
                incrementTime = Math.max(duration / Math.abs(endValue - currentValue), start);
            }

            const animation = () => {
                if (currentValue < endValue) {
                    currentValue += incrementByHundred ? val : 1;
                    setDisplayValue(currentValue);
                    setTimeout(animation, incrementTime);
                }
            };

            animation();

            return () => clearTimeout(animation);
        }, [value, duration, start, incrementByHundred, val]);

        return <div className="total">{displayValue}</div>;
    };


    return (
        <div>



            {/*Stats section*/}
            <p className="statheading" >Generosity in Action</p>

            <div className="stats">

                <div className="card">
                    <div className="title">Total Organizations</div>
                    <AnimatedCounter value={totalfranchises} duration={1500} start={50} incrementByHundred={false} val={1} />
                </div>

                <div className="card">
                    <div className="title">Total Projects</div>
                    <AnimatedCounter value={totalProjects} duration={1500} start={500} incrementByHundred={false} val={1} />
                </div>

                <div className="card">
                    <div className="title">Total Campaigns</div>
                    <AnimatedCounter value={totalCampaigns} duration={1500} start={500} incrementByHundred={false} val={1} />
                </div>

                <div className="card">
                    <div className="title">Overall Donations</div>
                    <AnimatedCounter value={overallDonation} duration={20} start={10} incrementByHundred={true} val={500} />
                </div>
                <div className="card">
                    <div className="title">Donations From Projects</div>
                    <AnimatedCounter value={projDonations} duration={20} start={10} incrementByHundred={true} val={250} />
                </div>
                <div className="card">
                    <div className="title">Donations From Campaigns</div>
                    <AnimatedCounter value={campDonations} duration={20} start={10} incrementByHundred={true} val={200} />
                </div>

                <div className="card">
                    <div className="title">Total Volunteers</div>
                    <AnimatedCounter value={totalVolunteers} duration={1500} start={50} incrementByHundred={false} val={1} />
                </div>

                <div className="card">
                    <div className="title">Total Donors</div>
                    <AnimatedCounter value={totalDonors} duration={1500} start={50} incrementByHundred={false} val={1} />
                </div>

                <div className="card">
                    <div className="title">Total Beneficiaries</div>
                    <AnimatedCounter value={totalBeneficiaries} duration={1500} start={50} incrementByHundred={false} val={1} />
                </div>


            </div>
            <Footer />
        </div>
    )
}

export default Gallery
