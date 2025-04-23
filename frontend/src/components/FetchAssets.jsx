import React, { useEffect } from "react";
import axios from "axios";

function FetchAssets({ assets, setAssets, handleEdit, handleDelete }) {
  useEffect(() => {
    axios.get("http://localhost:8070/assets/")
      .then((response) => setAssets(response.data))
      .catch((error) => console.error("Error fetching assets:", error));
  }, [setAssets]);

  return (
    <div>
      <h2>Asset List</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Type</th>
            <th>Purchase Date</th>
            <th>Value</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {assets.map((asset) => (
            <tr key={asset._id}>
              <td>{asset.ID}</td>
              <td>{asset.assetName}</td>
              <td>{asset.assetType}</td>
              <td>{new Date(asset.purchaseDate).toLocaleDateString()}</td>
              <td>{asset.assetValue}</td>
              <td>
                <button onClick={() => handleEdit(asset)}>Edit</button>
                <button onClick={() => handleDelete(asset._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default FetchAssets;