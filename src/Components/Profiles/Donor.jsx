import React, { useEffect, useState } from 'react';
import { auth, fs } from '../../Config/Config';
import { useNavigate } from "react-router-dom"; 
import "./donor.css"; 
import "../Styles/form.css";

const Donor = () => {
  const navigate = useNavigate();
  const [donorData, setDonorData] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    displayName: "",
    email: "",
    phoneNumber: "",
    city: "",
    donations: "",
    idtype: "Donor"
  });

  useEffect(() => {
    const fetchDonorData = async () => {
      try {
        const currentUser = auth.currentUser;

        if (currentUser) {
          const donorRef = fs.collection("donors").doc(currentUser.uid);
          const doc = await donorRef.get();

          if (doc.exists) {
            setDonorData(doc.data());
            setFormData({ ...doc.data(), idtype: "Donor" });
          }
          else {
            console.log("No donor data found");
          }
        }
      }
      catch (error) {
        console.error("Error fetching donor data:", error.message);
      }
    };
    // Call fetchData when the component mounts or when the authentication state changes
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        fetchDonorData();
      }
    });

    return unsubscribe;
  }, []);

  const handleEdit = () => {
    setEditMode(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const currentUser = auth.currentUser;

      if (currentUser) {
        await fs.collection("donors").doc(currentUser.uid).update(formData);
        setDonorData(formData);
        setEditMode(false);
      }
    }
    catch (error) {
      console.error("Error updating donor data:", error.message);
    }
  };

  const gotoTransactionHistory = () => {
    navigate('/transactionhistory');
  };

  return (
    <div className='donor'>
      <div className='donor-heading'>Donor Information</div>
      {editMode ? (
        <div className='form'>
          <form className="formData" onSubmit={handleSubmit}>
            <div className='attribute'>Name: </div>
            <input type="text" name="displayName" value={formData.displayName} onChange={handleChange} />
            <div className='attribute'>Email:</div>
            <input type="email" name="email" value={formData.email} onChange={handleChange} />
            <div className='attribute'>Phone Number: </div>
            <input type="text" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} />
            <div className='attribute'>City: </div>
            <input type="text" name="city" value={formData.city} onChange={handleChange} />
            <button className='save' type="submit">Save</button>
          </form>
        </div>
      ) : (
        <>
          <div className='props'>
            <div className='attributes'>Name: </div>
            <div className='values'>{donorData.displayName}</div>
            <div className='attributes'>Email:</div>
            <div className='values'>{donorData.email}</div>

            <div className='attributes'>Phone Number: </div>
            <div className='values'>{!donorData.phoneNumber
              ? (<div className='values-placeholder'>Enter your bio</div>)
              : (<div>{donorData.phoneNumber}</div>)}
            </div>

            <div className='attributes'>City: </div>
            <div className='values'>{!donorData.city
              ? (<div className='values-placeholder'>Enter your bio</div>)
              : (<div>{donorData.city}</div>)}
            </div>

            <div className='attributes'>Donations:</div>
            <div className='values'>{!donorData.donations
              ? (<div className='values-placeholder'>You Haven't Donated Yet</div>)
              : (<div>{donorData.donations}</div>)}
            </div>

            <button className='edit' onClick={handleEdit}>Edit</button>
          </div>
          <button className='show-transaction' onClick={gotoTransactionHistory}>
            Check Transaction History
          </button>
        </>
      )} 
    </div>
  );
};

export default Donor;
