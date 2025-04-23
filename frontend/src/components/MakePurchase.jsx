import { useState } from "react";
import { addPurchase } from "../services/api";
import { useNavigate } from "react-router-dom";

const MakePurchase = ({ customer }) => {
  const [productName, setProductName] = useState("");
  const [amount, setAmount] = useState("");
  const navigate = useNavigate();

  const handlePurchase = async () => {
    try {
      const updatedLoyaltyPoints = await addPurchase(
        customer.phone,
        productName,
        amount
      );

      alert("Purchase successful! Loyalty points updated.");
      navigate(-1); // Navigate back to the previous page
    } catch (error) {
      console.error(
        "Error updating loyalty points:",
        error.response?.data || error.message
      );
      alert(
        `Failed to update loyalty points: ${
          error.response?.data?.error || "Server error"
        }`
      );
    }
  };

  return (
    <div>
      <h3>Make a Purchase</h3>
      <input
        type="text"
        placeholder="Product Name"
        value={productName}
        onChange={(e) => setProductName(e.target.value)}
      />
      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <button onClick={handlePurchase}>Add Purchase</button>
    </div>
  );
};

export default MakePurchase;
