import React, { useEffect, useState } from "react";
import { fs, useFirebaseAuth } from "../../Config/Config";
import "./complains.css";

const Testimonial = () => {
    const { currentUser } = useFirebaseAuth();
    const [testimonialData, setTestimonialData] = useState({
        displayName: "",
        email: "",
        donations: "",
        phoneNumber: "",
        feedback: "",
    });
    const [testimonials, setTestimonials] = useState([]);
    const [showTable, setShowTable] = useState(false);
    const [donationTooLow, setDonationTooLow] = useState(false);
    const [donationsExist, setDonationsExist] = useState(true);

    useEffect(() => {
        const fetchDonorData = async () => {
            try {
                if (currentUser) {
                    const donorDocRef = fs.collection("donors").doc(currentUser.uid);
                    const donorDoc = await donorDocRef.get();

                    if (donorDoc.exists) {
                        const donorData = donorDoc.data();
                        console.log("Fetched donor data:", donorData);
                        if (donorData.donations !== undefined) {
                            setTestimonialData((prevData) => ({
                                ...prevData,
                                displayName: donorData.displayName || "",
                                email: donorData.email || "",
                                donations: donorData.donations || "",
                                phoneNumber: donorData.phoneNumber || "",
                            }));
                            setDonationTooLow(donorData.donations < 100000);
                        } else {
                            setDonationsExist(false);
                        }
                    } else {
                        console.log("No donor data found for user:", currentUser.uid);
                        setDonationsExist(false);
                    }

                    const testimonialDocRef = fs.collection("testimonials").doc(currentUser.uid);
                    const testimonialDoc = await testimonialDocRef.get();

                    if (testimonialDoc.exists) {
                        const data = testimonialDoc.data();
                        setTestimonials(data.testimonialData || []);
                    }
                }
            } catch (error) {
                console.error("Error fetching user or testimonial data:", error);
                setDonationsExist(false);
            }
        };

        fetchDonorData();
    }, [currentUser]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setTestimonialData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const testimonialDocRef = fs.collection("testimonials").doc(currentUser.uid);
            const updatedTestimonials = [...testimonials, testimonialData];

            await testimonialDocRef.set({
                testimonialData: updatedTestimonials,
            }, { merge: true });

            setTestimonials(updatedTestimonials);

            setTestimonialData((prevData) => ({
                ...prevData,
                feedback: "",
            }));
        } catch (error) {
            console.error("Error submitting testimonial:", error.message);
        }
    };

    if (!donationsExist) {
        return <div className="warning-message">Payen Kherat krden Akhrat me aapka hi bhla hona !!</div>;
    }

    return (
        <div className="complain min-h-screen">
            <div className="complain-head">Write a Testimonial</div>

            {donationTooLow ? (
                <div className="warning-message">Abby Kanjoos 100,000 kheraat to krdy, Phr Laga den ge tera Testimonial bhi Home Page pr!!</div>
            ) : (
                <>
                    <div className="complain-title">Donor Details: </div>
                    <div className="user-info">
                        <div className="user-detail">
                            <label>Name:</label>
                            <div className="detail-value">{testimonialData.displayName}</div>
                        </div>
                        <div className="user-detail">
                            <label>Email:</label>
                            <div className="detail-value">{testimonialData.email}</div>
                        </div>
                    </div>

                    <form className="complain-form" onSubmit={handleSubmit}>
                        <div className="complain-title">Feedback: </div>
                        <textarea className="comp-desc" name="feedback" placeholder="Enter Your Feedback" value={testimonialData.feedback} onChange={handleChange} required />

                        <button className="submit-complain" type="submit">Submit Testimonial</button>
                    </form>

                    <button className="show-complain" onClick={() => setShowTable(!showTable)}>
                        {showTable ? "Hide Testimonials" : "Show Testimonials"}
                    </button>

                    {showTable && (
                        <div className="card-container">
                            {testimonials.map((testimonial, index) => (
                                <div key={index} className="testimonial-card">
                                    <p>{testimonial.feedback}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default Testimonial;
