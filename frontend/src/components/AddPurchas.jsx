import React, { useState } from "react";
import { addPurchase } from "../services/api";

const AddPurchase = () => {
  const [phone, setPhone] = useState("");
  const [productName, setProductName] = useState("");
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");

  const handleAddPurchase = async () => {
    const purchaseData = { phone, productName, amount };
    const data = await addPurchase(purchaseData);

    if (data) {
      setMessage(
        `Purchase added! New Loyalty Points: ${data.customer.loyaltyPoints}`
      );
    } else {
      setMessage("Error adding purchase!");
    }
  };

  return (
    <div className="card">
      <h2>Add Purchase</h2>
      <input
        type="text"
        placeholder="Phone Number"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />
      <input
        type="text"
        placeholder="Product Name"
        value={productName}
        onChange={(e) => setProductName(e.target.value)}
      />
      <input
        type="number"
        placeholder="Amount (Rs)"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <button onClick={handleAddPurchase}>Add Purchase</button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default AddPurchase;
