// TransactionHistory.js
import React, { useState, useEffect } from "react";
import { fs, useFirebaseAuth } from "../../Config/Config";
import { useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
const TransactionHistory = () => {
  const navigate = useNavigate();

  const { currentUser } = useFirebaseAuth();
  const [transactionHistory, setTransactionHistory] = useState([]);

  useEffect(() => {
    window.scrollTo(0, 0);
}, []);
  useEffect(() => {
    const fetchTransactionHistory = async () => {
      try {
        if (currentUser) {

          const transactionDocRef = fs.collection("transactions").doc(currentUser.uid);
          const transactionDoc = await transactionDocRef.get();

          if (transactionDoc.exists) {
            const data = transactionDoc.data();
            setTransactionHistory(data.history);
          }
        }
      }
      catch (error) {
        console.error("Error fetching transaction history:", error);
      }
    };

    fetchTransactionHistory();
  }, [currentUser]);

  const gotoProfile = () => {
    navigate('/donor');
  }

  return (
    (
      <div className="xl:px-[145px] pt-[85px] lg:px-[55px] px-[15px] mx-auto p-4 bg-gray-50 min-h-screen">
        <div className="flex justify-between  items-center mb-4">
          <button
            onClick={gotoProfile}
            className="flex items-center gap-2 px-4 py-2 text-white bg-green-900 rounded-lg shadow hover:bg-green-600 transition-colors"
          >
            <FaUserCircle className="text-xl" />
            Go to Profile
          </button>
        </div>

        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Transaction History</h2>

        <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
          <table className="min-w-full bg-white">
            <thead>
              <tr className="bg-green-900 text-green-100 uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-left">Amount</th>
                <th className="py-3 px-6 text-left">Name</th>
                <th className="py-3 px-6 text-left">Donated To</th>
                <th className="py-3 px-6 text-left">Transaction IDID</th>
                <th className="py-3 px-6 text-left">Time</th>
                <th className="py-3 px-6 text-left">Date</th>
              </tr>
            </thead>
            <tbody className="text-gray-700 text-sm font-light">
              {transactionHistory.map((transaction, index) => (
                <tr
                  key={index}
                  className="border-b border-gray-200 hover:bg-gray-100 transition-colors"
                >
                  <td className="py-3 font-[600] text-green-900 px-6 text-left whitespace-nowrap">
                    {transaction.amount}
                  </td>
                  <td className="py-3 px-6 font-[600] text-green-900 text-left">{transaction.projectName}</td>

                  <td className="py-3 px-6 text-left">
                    <div
                      className={`py-2 rounded-xl text-center font-semibold text-white ${transaction.idType === "Project" ? "bg-green-700" : "bg-green-900"
                        }`}
                    >
                      {transaction.idType}
                    </div>
                  </td>
                  <td className="py-3 px-6 text-left">{transaction.projectId}</td>
                  <td className="py-3 px-6 text-left">
                    {new Date(transaction.timestamp).toLocaleTimeString()}
                  </td>
                  <td className="py-3 px-6 text-left">
                    {new Date(transaction.timestamp).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    ))
};

export default TransactionHistory;
