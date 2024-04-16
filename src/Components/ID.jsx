import React, { useEffect, useState } from "react";
import { auth, fs } from "../Config/Config";

const ID = () => {
  const [donorData, setDonorData] = useState({});

  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    displayName: "",
    email: "",
    phoneNumber: "",
    city: "",
    donations: ""
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
            setFormData(doc.data());
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
    setFormData({ ...formData, [name]: value });
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

  return (
    <div>
      <h2>Donor Information</h2>
      {editMode ? (
        <form onSubmit={handleSubmit}>
          <label>
            Name:<input type="text" name="displayName" value={formData.displayName} onChange={handleChange} />
          </label>
          <br />
          <label>
            Email:<input type="email" name="email" value={formData.email} onChange={handleChange} />
          </label>
          <br />
          <label>
            Phone Number:<input type="text" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} />
          </label>
          <br />
          <label>
            City:<input type="text" name="city" value={formData.city} onChange={handleChange} />
          </label>
          <br />
          <label>
            Donations:<input type="text" name="donations" value={formData.donations} onChange={handleChange} />
          </label>
          <br />
          <button type="submit">Save</button>
        </form>
      ) : (
        <>
          <p>Name: {donorData.displayName}</p>
          <p>Email: {donorData.email}</p>
          <p>Phone Number: {donorData.phoneNumber}</p>
          <p>City: {donorData.city}</p>
          <p>Donations: {donorData.donations}</p>
          <button onClick={handleEdit}>Edit</button>
        </>
      )}

    </div>
  );
};


export default ID
