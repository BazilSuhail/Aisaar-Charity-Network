import React, { useState, useEffect } from 'react';
import { fs } from '../../Config/Config';
//import TopVolunteers from './topVolunteers'; // Import the TopVolunteers component

import Loader from '../Loader';
import "../Styles/tables.css";
import "./gallery.css";
import "../Styles/tables.css";
import Svg1 from '../Styles/photos/charitycup.svg';
import Svg2 from '../Styles/photos/karekamal.svg';
import Svg3 from '../Styles/photos/unicef.svg';
import Svg4 from '../Styles/photos/sundas.svg';
import Svg5 from '../Styles/photos/local.svg';


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

    return (
        <div className='w-full overflow-x-hidden pt-[70px]'>
            <section className="flex h-screen flex-col lg:flex-row items-center px-6 py-12 lg:py-20 lg:px-16 bg-white">
                <div className="lg:w-1/2">
                    <h3 className="text-green-500 font-semibold mb-2">About Our Foundation</h3>
                    <h2 className="text-4xl font-bold text-green-700 mb-4">
                        We Are In A Mission To <br /> Help Helpless
                    </h2>
                    <p className="text-gray-700 mb-4">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit,mod tempor
                        incididunt ut labore et dolore magna aliqua. Utnixm, quis nostrud
                        exercitation ullamc.
                    </p>
                    <p className="text-gray-700 mb-6">
                        Lorem ipvsum dolor sit amext, consectetur adipisicing elit, smod
                        tempor incididunt ut labore et dolore.
                    </p>
                    <button className="bg-green-500 text-white px-6 py-2 font-semibold rounded">
                        About US
                    </button>
                </div>

                <div className="lg:w-1/2 mt-10 lg:mt-0 lg:ml-10 flex flex-col items-end">
                    <div className="relative flex space-x-4">
                        {/* Image 1 */}
                        <div className="w-[350px] h-[450px] bg-gray-200 rounded-md mr-[-95px] overflow-hidden">
                            <img
                                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTAbg3oIKDgvPRcYj7_JoXUckQIInvF8xtuUBHbG_qo7DEj2anvUSU4Y0ij7JV--W-xX0w&usqp=CAU"
                                alt="Placeholder"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        {/* Image 2 */}
                        <div className="w-[240px] h-[310px] mt-[-45px] bg-gray-200 rounded-md overflow-hidden">
                            <img
                                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT9S0cJrYw26C5lag_cvgFY7sVKCJFspo6uJCUaH6BWaqEvQHCSv_g5cHY19_YOFoJykTg&usqp=CAU"
                                alt="Placeholder"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>
                </div>
            </section>

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
                </div>
            )}
        </div>
    );
};

export default Gallery;

