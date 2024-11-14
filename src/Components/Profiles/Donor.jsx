import React, { useEffect, useState } from 'react';
import { auth, fs } from '../../Config/Config';
import { useNavigate } from "react-router-dom";
import { FiEdit, FiSave } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { FaMedal } from 'react-icons/fa';

const Donor = () => {
  const navigate = useNavigate();
  const [donorData, setDonorData] = useState({});
  const [editMode, setEditMode] = useState(false);

  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    displayName: "",
    email: "",
    phoneNumber: "",
    city: "",
    donations: "",
    idtype: "Donor",
    photoURL: ""
  });

  useEffect(() => {
    window.scrollTo(0, 0);
}, []);

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

  const openAvatarModal = () => {
    setIsAvatarModalOpen(true);
  };

  const closeAvatarModal = () => {
    setIsAvatarModalOpen(false);
  };

  const selectAvatar = (index) => {
    setFormData((prevData) => ({
      ...prevData,
      photoURL: index
    }));
    closeAvatarModal();
  };

  return (
    <div className='mt-[60px]  min-h-screen bg-white flex flex-col'>
      <div className='p-6 '>
        <div className="mb-[15px] flex lg:items-center flex-col lg:flex-row lg:justify-between bg-green-900 border-2 border-green-300 p-6 rounded-xl shadow-md">
          <div className="flex items-end space-x-4">
            <img
              src={`/Assets/${formData.photoURL}.jpg`}
              alt="Profile Avatar"
              className="w-20 h-20 lg:w-32 lg:h-32 rounded-full border border-gray-300 shadow-md"
            />
            <div className="flex lg:flex-row flex-col lg:items-end text-[25px] lg:text-[35px] font-extrabold text-green-200">
              Hello,
              <p className="lg:ml-[15px] text-[30px] lg:text-[45px] text-white">{formData.displayName}</p>
            </div>
          </div>
          <div className=" lg:order-1 order-2 flex flex-col py-[25px] items-center space-x-2 text-white rounded-lg bg-[#27760f85] px-[35px]">
            <FaMedal className="text-yellow-500 lg:text-[115px]" />
            <span className="font-semibold text-green-200 mt-[15px]">Total Donations:</span>
            <span className="font-bold text-[35px]">${donorData.donations}</span>
          </div>
        </div>

        {!editMode ? (
          <div>
            <div className=' mb-4'>

              <div className="flex-1 space-y-8">

                {/* Profile Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* name Section */}
                  <div className="flex items-center space-x-4 bg-gray-100 p-6 rounded-lg shadow-sm">
                    <div className="p-3 bg-blue-600 text-white rounded-full">
                      {/* Custom Email SVG */}
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-8 h-8">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 11c0-4.28-3.455-5-5-5h-1c-1.545 0-5 .72-5 5v3c0 1.38 1.12 2.5 2.5 2.5H5c1.38 0 2.5 1.12 2.5 2.5v2c0 1.38 1.12 2.5 2.5 2.5h2c1.38 0 2.5-1.12 2.5-2.5v-2c0-1.38 1.12-2.5 2.5-2.5h.5C19.88 16.5 21 15.38 21 14v-3c0-4.28-3.455-5-5-5h-1c-1.545 0-5 .72-5 5z" />
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-gray-800">Full Name</h2>
                      <p className="text-gray-600">{donorData.displayName}</p>
                    </div>
                  </div>

                  {/* Email Section */}
                  <div className="flex items-center space-x-4 bg-gray-100 p-6 rounded-lg shadow-sm">
                    <div className="p-3 bg-blue-600 text-white rounded-full">
                      {/* Custom Email SVG */}
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12l-4-4m0 0l-4 4m4-4v12" />
                        <path d="M16 5H8a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2z" />
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-gray-800">Email</h2>
                      <p className="text-gray-600">{donorData.email}</p>
                    </div>
                  </div>

                  {/* Phone Section */}
                  <div className="flex items-center space-x-4 bg-gray-100 p-6 rounded-lg shadow-sm">
                    <div className="p-3 bg-green-600 text-white rounded-full">
                      {/* Custom Phone SVG */}
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="green" stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h2l1 2m4 0l1-2h5a2 2 0 012 2v6a2 2 0 01-2 2h-6a2 2 0 01-2-2v-2m-2 0H3m0 0V9m0 0a3 3 0 00-3 3v6a3 3 0 003 3h12a3 3 0 003-3V9a3 3 0 00-3-3h-2a3 3 0 00-3 3v1H6" />
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-gray-800">Phone</h2>
                      <p className="text-gray-600">{!donorData.phoneNumber ? donorData.phoneNumber : 'Enter Phone Number'}</p>
                    </div>
                  </div>

                  {/* Gender Section */}
                  <div className="flex items-center space-x-4 bg-gray-100 p-6 rounded-lg shadow-sm">
                    <div className="p-3 bg-pink-600 text-white rounded-full">
                      {/* Custom Gender SVG */}
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="green" stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 7a4 4 0 014-4h3m-7 0a4 4 0 00-4 4v4m0 0l4 4m-4-4l4-4" />
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-gray-800">City</h2>
                      <p className="text-gray-600">{donorData.city ? donorData.city : 'Enter City'}</p>
                    </div>
                  </div>

                </div>
              </div>

            </div>
            <div className='flex mt-[40px] items-center'>
              <button onClick={handleEdit}
                className='bg-green-700 text-white px-4 py-2 rounded-md shadow-md hover:bg-green-600 flex items-center space-x-2'
              >
                <FiEdit className='w-5 h-5' /> {/* Professional Edit Icon */}
                <span>Edit Profile</span>
              </button>
              <button onClick={gotoTransactionHistory}
                className='bg-green-900 ml-[10px]  text-white px-4 py-2 rounded-md shadow-md hover:bg-green-600 flex items-center space-x-2'
              >
                <FiEdit className='w-5 h-5' /> {/* Professional Edit Icon */}
                <span>Check Donations</span>
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className='space-y-4'>
            <div className='flex items-end mb-4'>
              <img
                src={`/Assets/${donorData.photoURL}.jpg`} // Display the currently selected avatar
                alt="Profile Avatar"
                className="w-24 h-24 rounded-full border border-gray-300 shadow-md"
              />
              <button
                type="button"
                onClick={openAvatarModal}
                className='bg-blue-900 ml-[10px] text-white px-4 py-[4px] rounded-md hover:bg-gray-600'
              >
                Change Avatar
              </button>
            </div>
            <input
              type="text"
              name="name"
              value={formData.displayName}
              onChange={handleChange}
              placeholder="Enter Name"
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            />
            <input
              type="text"
              name="name"
              value={formData.city}
              onChange={handleChange}
              placeholder="Enter City"
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            />
            <input
              type="text"
              name="phone"
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder="Phone"
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter Email"
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            />
            {/* Change Avatar Button */}
            <div className='flex'>
              <button
                type="submit"
                className='bg-blue-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-600 flex items-center space-x-2'
              >
                <FiSave className='w-5 h-5' /> {/* Save Icon */}
                <span>Update Profile</span>
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Avatar Selection Modal 
      */}
      {isAvatarModalOpen && (
        <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50'>
          <motion.div
            className='bg-white p-6 rounded-lg shadow-lg'
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
          >
            <h2 className='text-xl font-bold mb-4'>Select an Avatar</h2>
            <div className='grid grid-cols-3 lg:grid-cols-4 gap-4'>
              {Array.from({ length: 12 }).map((_, index) => (
                <img
                  key={index}
                  src={`/Assets/${index + 1}.jpg`} // Render avatar images from 1 to 12
                  alt={`Avatar ${index + 1}`}
                  className='w-24 h-24 rounded-full border border-gray-300 shadow-md cursor-pointer hover:opacity-75'
                  onClick={() => selectAvatar(index + 1)} // Set avatar to the clicked one
                />
              ))}
            </div>
            <button
              onClick={closeAvatarModal}
              className='mt-4 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600'
            >
              Close
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
};



export default Donor;

/*
(
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

*/