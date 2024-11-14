import React, { useState, useEffect } from 'react';
import { fs } from '../../Config/Config';
import Loader from '../Loader';
import { FaAward, FaMedal, FaPhone, FaTasks } from 'react-icons/fa';

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
    const [totalCampaigns, setTotalCampaigns] = useState(0);
    const [totalFranchises, setTotalFranchises] = useState(0);
    const [projects, setProjects] = useState([]);
    const [campaigns, setCampaigns] = useState([]);
    const [completedProjects, setCompletedProjects] = useState([]);
    const [totalVolunteers, setTotalVolunteers] = useState(0);
    const [totalDonors, setTotalDonors] = useState(0);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

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

    const badgeColors = [
        "bg-yellow-400",  // Gold for 1st
        "bg-gray-500",    // Silver for 2nd
        "bg-yellow-600",  // Bronze for 3rd
        "bg-green-500",   // Green for 4th
        "bg-green-500"    // Green for 5th
    ];

    return (
        <div className='w-full overflow-x-hidden py-[80px]'>
            <section className="flex flex-col lg:flex-row items-center justify-center px-6 ">
                <div className="relative lg:scale-[0.8] w-full lg:w-1/2 mb-8 lg:mb-0">
                    <div className="rounded-full overflow-hidden mx-auto w-72 h-72 lg:w-full lg:h-auto">
                        <img src="https://templates.envytheme.com/leud/rtl/assets/images/what-we-do-img.png" alt="Children" className="object-cover w-full h-full" />
                    </div>
                </div>

                <div className="lg:w-1/2 text-center lg:text-left lg:pl-10">
                    <h2 className="text-green-600 uppercase text-sm font-semibold mb-2">What We Do</h2>
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">Manage all activities from our foundation</h1>
                    <p className="text-gray-600 mb-6">
                        Our foundation is dedicated to managing a wide range of impactful initiatives to create lasting change. From supporting local communities to driving educational and healthcare projects, we aim to make a tangible difference in people’s lives. Join us in transforming lives, one project at a time.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-800">
                        <div className="flex items-center">
                            <span className="text-green-500 mr-2">✔</span> Medicine help
                        </div>
                        <div className="flex items-center">
                            <span className="text-green-500 mr-2">✔</span> Care and protection
                        </div>
                        <div className="flex items-center">
                            <span className="text-green-500 mr-2">✔</span> Education help
                        </div>
                        <div className="flex items-center">
                            <span className="text-green-500 mr-2">✔</span> Water delivery
                        </div>
                        <div className="flex items-center">
                            <span className="text-green-500 mr-2">✔</span> Special needs
                        </div>
                        <div className="flex items-center">
                            <span className="text-green-500 mr-2">✔</span> Adopt a child
                        </div>
                        <div className="flex items-center">
                            <span className="text-green-500 mr-2">✔</span> Safe house
                        </div>
                        <div className="flex items-center">
                            <span className="text-green-500 mr-2">✔</span> Medical camps
                        </div>
                        <div className="flex items-center">
                            <span className="text-green-500 mr-2">✔</span> Food collect
                        </div>
                        <div className="flex items-center">
                            <span className="text-green-500 mr-2">✔</span> Cancer treatment
                        </div>
                    </div>
                </div>
            </section>

            <h2 className="text-3xl mt-[65px] lg:mt-[25px] font-bold text-center text-green-900 mb-8">
                Geneoristy In Action
            </h2>
            <p className="text-green-900 text-center xl:px-[290px] lg:px-[195px] md:px-[85px] px-[15px] mb-4">
                Every act of kindness counts, and together we are creating powerful change. Through the collective generosity of our supporters, we've been able to make a real impact across multiple areas, from healthcare and education to community development and emergency relief.
            </p>
            <section className="grid md:scale-[1] scale-[0.95] overflow-hidden md:grid-cols-2 grid-cols-1 lg:grid-cols-4 place-content-center my-[28px]">
                <div className="flex flex-col items-center justify-center mx-auto  text-green-900 py-[30px] ">
                    <Counter value={overallDonation} duration={100} />
                    <div className="text-center mt-[5px] rounded-lg font-medium text-gray-500 text-lg">OverAll Donations</div>
                </div>
                <div className="flex flex-col items-center justify-center mx-auto text-green-900 py-[30px] ">
                    <Counter value={projDonations} duration={100} />
                    <div className="text-center mt-[5px] rounded-lg font-medium text-gray-500 text-lg">Project  Donations</div>
                </div>
                <div className="flex flex-col items-center justify-center mx-auto  text-green-900 py-[30px] ">
                    <Counter value={campDonations} duration={50} />
                    <div className="text-center mt-[5px] rounded-lg font-medium text-gray-500 text-lg">Campaigns  Donations</div>
                </div>
                <div className="flex flex-col items-center justify-center mx-auto  text-green-900 py-[30px] ">
                    <Counter value={totalCampaigns} duration={50} />
                    <div className="text-center mt-[5px] rounded-lg font-medium text-gray-500 text-lg">Total Campaigns</div>
                </div>
            </section>

            <section className="grid md:scale-[1] scale-[0.95] overflow-hidden md:grid-cols-2 grid-cols-1 lg:grid-cols-4 place-content-center my-[28px]">
                <div className="flex  flex-col items-center justify-center mx-auto  text-green-900 py-[30px] ">
                    <Counter value={totalFranchises} duration={100} />
                    <div className="text-center mt-[5px] rounded-lg font-medium text-gray-500 text-lg">Total Franchises</div>
                </div>
                <div className="flex flex-col  items-center justify-center mx-auto text-green-900 py-[30px] ">
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

            <section className="flex h-screen  flex-col lg:flex-row items-center px-6 py-12 lg:py-20 lg:px-16 bg-white">
                <div className="lg:w-1/2">
                    <h3 className="text-green-500 font-semibold mb-2">About Our Foundation</h3>
                    <h2 className="text-4xl font-bold text-green-700 mb-4">
                        We Are In A Mission To <br /> Help Helpless
                    </h2>
                    <p className="text-gray-700 mb-4">
                        Our foundation is committed to bringing hope and support to those who need it most. From providing essential resources to uplifting lives, we believe in creating opportunities and empowering individuals facing challenging circumstances.
                    </p>
                    <p className="text-gray-700 mb-6">
                        With every project and initiative, we strive to make a meaningful impact. Join us as we work together to create a brighter future for the helpless and underprivileged.
                    </p>
                </div>

                <div className="lg:w-1/2 mt-10 md:scale-[1] scale-[0.6] lg:mt-0 lg:ml-10 flex flex-col items-end">
                    <div className="relative flex space-x-4">
                        {/* Image 1 */}
                        <div className="w-[350px] h-[450px] bg-gray-200 rounded-md mr-[-95px] overflow-hidden">
                            <img src='https://templates.envytheme.com/leud/rtl/assets/images/gallery/gallery-6.jpg' alt="Placeholder" className="w-full h-full object-cover" />
                        </div>
                        {/* Image 2 */}
                        <div className="w-[240px] h-[310px] mt-[-45px] bg-gray-200 rounded-md overflow-hidden">
                            <img
                                src='https://templates.envytheme.com/leud/rtl/assets/images/gallery/gallery-1.jpg'
                                alt="Placeholder"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>
                </div>
            </section>

            <h2 className="text-3xl lg:mt-0 mt-[155px] font-bold text-center text-green-900 mb-8">
                Meet the Team <span className='text-green-700'>Our Top Volunteers</span>
            </h2>
            <div className='h-[3px] bg-green-900 w-[90%] mx-auto mb-[20px]'></div>

            <p className="text-green-900 text-center xl:px-[290px] lg:px-[195px] mb-[35px] md:px-[85px] px-[15px]">
                Behind every success story is a team of passionate volunteers dedicated to making a difference. Meet our top volunteers who tirelessly contribute their time and energy to support our mission. Together, we’re transforming lives and building a brighter future for those in need.
            </p>
            {loading ? (
                <Loader typeOfloader={"a"} />
            ) : (
                <div className="flex justify-center overflow-hidden px-[15px] xl:px-[195px] flex-wrap gap-8">
                    {topVolunteers.slice(0, 5).map((volunteer, index) => (
                        <div key={index} className="bg-white border scale-[1.1] mr-[15px]  shadow-md rounded-lg p-6 hover:shadow-xl transition-transform duration-300 w-full sm:w-64 transform hover:-translate-y-1 hover:scale-105">
                            <div className="flex items-center space-x-4 mb-4">
                                <span className={`${badgeColors[index] || 'bg-blue-500'} text-white font-bold px-3 py-1 rounded-full flex items-center`}>
                                    {index === 0 && <FaMedal className="mr-1" />}
                                    {index === 1 && <FaAward className="mr-1" />}
                                    {index === 2 && <FaMedal className="mr-1 text-yellow-100" />}
                                    {index + 1}
                                </span>
                                <h3 className="text-lg font-semibold text-gray-800 truncate">
                                    {volunteer.displayName || "Info Not Entered"}
                                </h3>
                            </div>

                            <div className="text-gray-600 space-y-3">
                                <div className="flex items-center space-x-2">
                                    <FaPhone className="text-indigo-500" />
                                    <span>{volunteer.phoneNumber || "Info Not Entered"}</span>
                                </div>

                                <div className="flex items-center space-x-2">
                                    <FaTasks className="text-indigo-500" />
                                    <span>{volunteer.Projectscompleted || "Info Not Entered"}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Gallery;

