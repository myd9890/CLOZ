import React from "react";
import axios from "axios";

function AddAsset({ formData, setFormData, editId, setEditId, fetchAssets }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editId) {
      axios.put(`http://localhost:8070/assets/update/${editId}`, formData)
        .then(() => {
          alert("Asset updated!");
          setEditId(null);
          setFormData({ ID: "", assetName: "", assetType: "Non-current", purchaseDate: "", assetValue: "" });
          fetchAssets();
        })
        .catch((error) => console.error("Error updating asset:", error));
    } else {
      axios.post("http://localhost:8070/assets/add", formData)
        .then(() => {
          alert("Asset added!");
          setFormData({ ID: "", assetName: "", assetType: "Non-current", purchaseDate: "", assetValue: "" });
          fetchAssets();
        })
        .catch((error) => console.error("Error adding asset:", error));
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="ID"
        placeholder="Asset ID"
        value={formData.ID}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="assetName"
        placeholder="Asset Name"
        value={formData.assetName}
        onChange={handleChange}
        required
      />
      <select
        name="assetType"
        value={formData.assetType}
        onChange={handleChange}
        required
      >
        <option value="" disabled>Select Asset Type</option>
        <option value="Non-current">Non-current</option>
        <option value="Current">Current</option>
      </select>
      <input
        type="date"
        name="purchaseDate"
        value={formData.purchaseDate}
        onChange={handleChange}
        required
      />
      <input
        type="number"
        name="assetValue"
        placeholder="Asset Value"
        value={formData.assetValue}
        onChange={handleChange}
        required
      />
      <button type="submit">{editId ? "Update Asset" : "Add Asset"}</button>
    </form>
  );
}

export default AddAsset;