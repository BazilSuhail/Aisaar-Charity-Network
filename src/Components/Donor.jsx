import React, { useEffect, useState } from 'react';
import { auth, fs } from '../Config/Config';
import TransactionHistory from './Transaction_History';
import "./Styles/donor.css"

import "./Styles/form.css"
const Donor = () => {
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

  const [showTransactionHistory, setShowTransactionHistory] = useState(false);
  console.log(showTransactionHistory);

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

    fetchDonorData();
  }, []);

  const handleEdit = () => {
    setEditMode(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Update the form data without causing re-renders on every keystroke
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

  const toggleTransactionHistory = () => {
    setShowTransactionHistory(!showTransactionHistory);
  };


  return (
    <div className='donor'>
      <h2>Donor Information</h2>
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
            <div className='values'>{donorData.phoneNumber}</div>
            <div className='attributes'>City: </div>
            <div className='values'>{donorData.city}</div>
            <div className='attributes'>Donations:</div>
            <div className='values'>{donorData.donations}</div>
            <button className='edit' onClick={handleEdit}>Edit</button>
          </div>

          <button className='show-transaction' onClick={toggleTransactionHistory}>
            {showTransactionHistory ? "Hide Transaction History" : "Show Transaction History"}
          </button>
          <div className='transaction-table'>{showTransactionHistory && <TransactionHistory />}</div>
        </>
      )}

    </div >
  );
};

export default Donor;
