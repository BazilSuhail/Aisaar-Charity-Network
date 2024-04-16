// TransactionHistory.js
import React, { useState, useEffect } from "react";
import { fs, useFirebaseAuth } from "../Config/Config";

import "./Styles/tables.css";
const TransactionHistory = () => {
  const { currentUser } = useFirebaseAuth();
  const [transactionHistory, setTransactionHistory] = useState([]);

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

  return (
    <div >
      <h2>Transaction History</h2>

      <div className="back">
        <div className="table-container">
          <table className="table-body">
            <thead className="head">
              <tr>
                <th>Amount</th>
                <th>Name</th>
                <th>Donated To</th> 
                <th>ID</th>
                <th>Time</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody className="body">
              {transactionHistory.map((transaction, index) => (
                <tr key={index}>
                  <td>{transaction.amount}</td>
                  <td>{transaction.projectName}</td>
                  <td><strong>{transaction.idType}</strong></td> 
                  <td>{transaction.projectId}</td>
                  <td>{new Date(transaction.timestamp).toLocaleTimeString()}</td>
                  <td>{new Date(transaction.timestamp).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default TransactionHistory;
