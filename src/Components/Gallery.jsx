import React, { useState, useEffect } from 'react';
import { fs } from '../Config/Config';
import Footer from "./Footer";
//import TopVolunteers from './topVolunteers'; // Import the TopVolunteers component

import Loader from './Loader';
import "./Styles/tables.css";
import "./Styles/gallery.css";
import "./Styles/tables.css";
import Svg1 from './Styles/photos/charitycup.svg';
import Svg2 from './Styles/photos/karekamal.svg';
import Svg3 from './Styles/photos/unicef.svg';
import Svg4 from './Styles/photos/sundas.svg';
import Svg5 from './Styles/photos/local.svg';

const Gallery = () => {
    const [totalProjects, setTotalProjects] = useState(0);
    const [totalCampaigns, setTotalCampaigns] = useState(0);
    const [totalFranchises, setTotalFranchises] = useState(0);
    const [projects, setProjects] = useState([]);
    const [campaigns, setCampaigns] = useState([]);
    const [completedProjects, setCompletedProjects] = useState([]);
    const [totalVolunteers, setTotalVolunteers] = useState(0);
    const [totalDonors, setTotalDonors] = useState(0);
    const [totalBeneficiaries, setTotalBeneficiaries] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const franchiseRef = fs.collection('franchise');
                const franchiseSnapshot = await franchiseRef.get();
                setTotalFranchises(franchiseSnapshot.size);

                const projectsRef = fs.collection('projects');
                const projectsSnapshot = await projectsRef.get();
                setProjects(projectsSnapshot.docs.map(doc => doc.data()));
                setTotalProjects(projectsSnapshot.size);

                const campaignsRef = fs.collection('campaigns');
                const campaignsSnapshot = await campaignsRef.get();
                setCampaigns(campaignsSnapshot.docs.map(doc => doc.data()));
                setTotalCampaigns(campaignsSnapshot.size);

                const completedProjectsRef = fs.collection('completedProjects');
                const completedProjectsSnapshot = await completedProjectsRef.get();
                const completedProjectsData = completedProjectsSnapshot.docs.map(doc => doc.data());
                setCompletedProjects(completedProjectsData);

                const beneficiariesRef = fs.collection('beneficiaries');
                const beneficiariesSnapshot = await beneficiariesRef.get();
                setTotalBeneficiaries(beneficiariesSnapshot.size);

                const volunteersRef = fs.collection('volunteer');
                const volunteersSnapshot = await volunteersRef.get();
                setTotalVolunteers(volunteersSnapshot.size);

                const donorsRef = fs.collection('donors');
                const donorsSnapshot = await donorsRef.get();
                setTotalDonors(donorsSnapshot.size);
            }
            catch (error) {
                console.error('Error fetching data:', error.message);
            }
        };

        fetchData();
    }, []);

    const projDonations = projects.reduce(
        (total, project) => total + parseInt(project.collectedAmount || 0),
        0
    ) + completedProjects.reduce(
        (total, project) => total + parseInt(project.targetAmount || 0),
        0
    );

    const campDonations = campaigns.reduce(
        (total, campaign) => total + parseInt(campaign.currentAmountRaised || 0),
        0
    );

    const overallDonation = projDonations + campDonations;

    // -------->  *Other code for showing top VOlunteers

    const [topVolunteers, setTopVolunteers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchVolunteers = async () => {
            try {
                const volunteersRef = fs.collection('volunteer');
                const volunteersSnapshot = await volunteersRef.get();
                const volunteersData = volunteersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

                const sortedVolunteers = volunteersData
                    .filter(volunteer => volunteer.Projectscompleted !== undefined)
                    .sort((a, b) => b.Projectscompleted - a.Projectscompleted)
                    .slice(0, 5);

                setTopVolunteers(sortedVolunteers);

                const topVolunteersRef = fs.collection('topVolunteers');
                const batch = fs.batch();

                sortedVolunteers.forEach(volunteer => {
                    const docRef = topVolunteersRef.doc(volunteer.id);
                    batch.set(docRef, volunteer);
                });

                await batch.commit();
            } catch (error) {
                console.error('Error fetching top volunteers:', error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchVolunteers();
    }, []);

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
        <div className='gallery'>
            <div className="charity-container">
                <div className='donate-for-afterlife'>
                    <div className="charity-header">Donate For</div>
                    <div className="afterlife-charity-header">AfterLife</div>
                    <div className="charity-content">
                        At <b>إيثار</b>, a non-profit charitable organization, our mission is to extend a helping hand to those in need through
                        a range of humanitarian initiatives , with the unwavering support of our dedicated team of volunteers and supporters.
                    </div>
                </div>

                <div className="how-to-help">
                    <h2>How You Can Help</h2>
                    <div className="help-section">
                        <div className='help-heading'>Donate:</div>
                        <p>Your financial support enables us to provide essential aid and expand our initiatives.</p>
                    </div>
                    <div className="help-section">
                        <div className='help-heading'>Volunteer:</div>
                        <p>Join our team of dedicated volunteers. Your time and skills can make a significant difference.</p>
                    </div>
                    <div className="help-section">
                        <div className='help-heading'>Spread the Word:</div>
                        <p>Help us raise awareness about our mission and work. Share our story with your network to inspire others to get involved.</p>
                    </div>
                </div>
            </div>

            <p className="statheading">Generosity in Action</p>
            <div className="donation-stats">
                <div className="card">
                    <div className="title">Overall Donations</div>
                    <AnimatedCounter value={overallDonation} duration={20} start={10} incrementByHundred={true} val={10000} />
                </div>
                <div className="card">
                    <div className="title">Donations From Projects</div>
                    <AnimatedCounter value={projDonations} duration={20} start={10} incrementByHundred={true} val={2500} />
                </div>
                <div className="card">
                    <div className="title">Donations From Campaigns</div>
                    <AnimatedCounter value={campDonations} duration={20} start={10} incrementByHundred={true} val={2000} />
                </div>
            </div>
            <p className="logos-heading">Our Honourable Partners</p>
            <div className="svg-container">
                <img src={Svg1} alt="SVG 1" className="animated-svg" />
                <img src={Svg2} alt="SVG 2" className="animated-svg" />
                <img src={Svg3} alt="SVG 3" className="animated-svg" />
                <img src={Svg4} alt="SVG 4" className="animated-svg" />
                <img src={Svg5} alt="SVG 5" className="animated-svg" />
            </div>

            <p className="statheading">Our Work</p>
            <div className="stats">
                <div className="card">
                    <div className="title">Total Franchises</div>
                    <AnimatedCounter value={totalFranchises} duration={1500} start={50} incrementByHundred={false} val={1} />
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

            <p className="logos-heading">Top Volunteers</p>
            {loading ? (
                <Loader typeOfloader={"a"} />
            ) : (
                <div className="top-volunteers">
                    <div className="table-container">
                        <table className="table-body">
                            <thead className="head">
                                <tr className='volunteer-header'>
                                    <th>Rank</th>
                                    <th>Name</th>
                                    <th>Phone</th>
                                    <th>Projects Completed</th>
                                </tr>
                            </thead>

                            <tbody className="body">
                                {topVolunteers.map((volunteer, index) => (
                                    <tr key={index} className={`volunteer-row-${index + 1}`}>
                                        <td>{index + 1}</td>

                                        <td>{!volunteer.displayName
                                            ? (<div >Info Not entered</div>)
                                            : (<div>{volunteer.displayName}</div>)}
                                        </td>

                                        <td>{!volunteer.phoneNumber
                                            ? (<div >Info Not entered</div>)
                                            : (<div>{volunteer.phoneNumber}</div>)}
                                        </td>

                                        <td>{!volunteer.Projectscompleted
                                            ? (<div >Info Not entered</div>)
                                            : (<div>{volunteer.Projectscompleted}</div>)}
                                        </td>
 
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/*
                    <div>{topVolunteers.map((volunteer, index) => (
                        <div key={index} className={`volunteer-row-${index + 1}`}>
                            <div>{index + 1}</div>
                            <div>{volunteer.displayName}</div>
                            <div>{volunteer.phoneNumber}</div>
                            <div>{volunteer.Projectscompleted}</div>
                        </div>
                    ))}</div>
                        */}


                </div>

            )}

            <Footer />
        </div>
    );
};

export default Gallery;

