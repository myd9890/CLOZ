import axios from "axios";

function DeleteAsset(id, fetchAssets) {
  axios.delete(`http://localhost:8070/assets/delete/${id}`)
    .then(() => {
      alert("Asset deleted!");
      fetchAssets();
    })
    .catch((error) => console.error("Error deleting asset:", error));
}

export default DeleteAsset;