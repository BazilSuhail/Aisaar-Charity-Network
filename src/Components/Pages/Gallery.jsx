import React, { useState, useEffect } from 'react';
import { fs } from '../../Config/Config';

import Loader from '../Loader';   

const Counter = ({ value, duration }) => {
    const [count, setCount] = useState(0);
    useEffect(() => {
        let start = 0;
        const increment = value / (duration / 10);
        const interval = setInterval(() => {
            start += increment;
            if (start >= value) {
                setCount(value);
                clearInterval(interval);
            } else {
                setCount(Math.round(start));
            }
        }, 10);

        return () => clearInterval(interval);
    }, [value, duration]);

    return (
        <div className='text-[85px] md:text-[55px] mr-[5px] font-[700]'>
            {count}
        </div>
    );
};

const Gallery = () => {
    const [totalProjects, setTotalProjects] = useState(0);
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

         
            <h2 className="text-3xl mt-[25px] font-bold text-center text-green-900 mb-8">
                Geneoristy In Action
            </h2>
            <section className="grid md:scale-[1] scale-[0.95] overflow-hidden md:grid-cols-2 grid-cols-1 lg:grid-cols-4 place-content-center my-[28px]">
                <div className="flex flex-col items-center justify-center mx-auto  text-green-900 py-[30px] ">
                    <Counter value={overallDonation} duration={100} />
                    <div className="text-center mt-[5px] rounded-lg font-medium text-gray-500 text-lg">OverAll Donations</div>
                </div>
                <div className="flex flex-col items-center justify-center mx-auto text-white py-[30px] ">
                    <Counter value={projDonations} duration={100} />
                    <div className="text-center mt-[5px] rounded-lg font-medium text-gray-500 text-lg">Project  Donations</div>
                </div>
                <div className="flex flex-col items-center justify-center mx-auto  text-green-900 py-[30px] ">
                    <Counter value={campDonations} duration={50} />
                    <div className="text-center mt-[5px] rounded-lg font-medium text-gray-500 text-lg">Campaigns  Donations</div>
                </div>
                <div className="flex flex-col items-center justify-center mx-auto  text-green-900 py-[30px] ">
                    <Counter value={totalBeneficiaries} duration={50} />
                    <div className="text-center mt-[5px] rounded-lg font-medium text-gray-500 text-lg">Total Beneficaires</div>
                </div>
            </section>

            <section className="grid md:scale-[1] scale-[0.95] overflow-hidden md:grid-cols-2 grid-cols-1 lg:grid-cols-4 place-content-center my-[28px]">
                <div className="flex  flex-col items-center justify-center mx-auto  text-green-900 py-[30px] ">
                    <Counter value={totalFranchises} duration={100} />
                    <div className="text-center mt-[5px] rounded-lg font-medium text-gray-500 text-lg">Total Franchises</div>
                </div>
                <div className="flex flex-col  items-center justify-center mx-auto text-white py-[30px] ">
                    <Counter value={totalProjects} duration={100} />
                    <div className="text-center mt-[5px] rounded-lg font-medium text-gray-500 text-lg">Total projects</div>
                </div>
                <div className="flex  flex-col items-center justify-center mx-auto  text-green-900 py-[30px] ">
                    <Counter value={totalDonors} duration={50} />
                    <div className="text-center mt-[5px] rounded-lg font-medium text-gray-500 text-lg">Total Donors</div>
                </div>
                <div className="flex  flex-col items-center justify-center mx-auto  text-green-900 py-[30px] ">
                    <Counter value={totalVolunteers} duration={50} />
                    <div className="text-center mt-[5px] rounded-lg font-medium text-gray-500 text-lg">Total Volunteers</div>
                </div>
            </section>



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

