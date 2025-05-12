/* import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";

function Asset() {
    const [assets, setAssets] = useState([]);
    const [form, setForm] = useState({
        ID: "",
        assetName: "",
        assetType: "Non-current",
        purchaseDate: "",
        assetValue: ""
    });
    const [formErrors, setFormErrors] = useState({}); // State for validation errors
    const [editing, setEditing] = useState(false);
    const [editId, setEditId] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        fetchAssets();
    }, []);

    const fetchAssets = async () => {
        try {
            const res = await axios.get("http://localhost:8070/assets/");
            setAssets(res.data);
        } catch (err) {
            console.error("Error fetching assets", err);
        }
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setFormErrors({ ...formErrors, [e.target.name]: "" }); // Clear error for the field being edited
    };

    const validateForm = () => {
        const errors = {};

        const preventSpecialCharacters = (e) => {
            const key = e.key;
            // Allow letters, spaces, backspace, and delete
            if (
              !(
                (key >= 'a' && key <= 'z') || // Lowercase letters
                (key >= 'A' && key <= 'Z') || // Uppercase letters
                key === ' ' || // Space
                key === 'Backspace' || // Backspace
                key === 'Delete' // Delete
              )
            ) {
              e.preventDefault(); // Prevent invalid characters
            }
          };

        // Validation for ID: must start with "A" followed by numeric values
        const idRegex = /^A\d+$/;
        if (!idRegex.test(form.ID)) {
            errors.ID = "ID must start with 'A' followed by numeric values (e.g., A123).";
        }

        // Validation for Asset Name: must contain only alphabetic characters
        const nameRegex = /^[A-Za-z\s]+$/;
        if (!nameRegex.test(form.assetName)) {
            errors.assetName = "Asset Name must contain only alphabetic characters.";
        }

        if (!form.assetName.trim()) {
            errors.assetName = "Asset Name is required!";
        }

        // Validation for Asset Value: must be a positive number
        if (isNaN(form.assetValue) || form.assetValue <= 0) {
            errors.assetValue = "Asset Value must be a positive number!";
        }

        // Validation for Purchase Date: must not be a future date
        const today = new Date();
        const enteredDate = new Date(form.purchaseDate);
        if (enteredDate > today) {
            errors.purchaseDate = "Purchase Date cannot be a future date!";
        }

        return errors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const errors = validateForm();
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors); // Set validation errors
            return;
        }

        try {
            if (editing) {
                await axios.put(`http://localhost:8070/assets/update/${editId}`, form);
            } else {
                await axios.post("http://localhost:8070/assets/add", form);
            }
            setForm({ ID: "", assetName: "", assetType: "Non-current", purchaseDate: "", assetValue: "" });
            setEditing(false);
            showToast("Asset saved successfully!", "success");
            fetchAssets();
        } catch (err) {
            console.error("Error saving asset", err);
            showToast("Error saving asset!", "danger");
        }
    };

    const handleEdit = (asset) => {
        setForm({
            ID: asset.ID,
            assetName: asset.assetName,
            assetType: asset.assetType,
            purchaseDate: new Date(asset.purchaseDate).toISOString().split("T")[0], // Format date for input
            assetValue: asset.assetValue,
        });
        setEditing(true);
        setEditId(asset._id); // Set the ID of the asset being edited
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this asset?")) {
            try {
                await axios.delete(`http://localhost:8070/assets/delete/${id}`);
                fetchAssets(); // Refresh the list after deletion
                showToast("Asset deleted successfully!", "warning");
            } catch (err) {
                console.error("Error deleting asset", err);
            }
        }
    };

    const showToast = (message, type) => {
        const toast = document.getElementById("toast");
        toast.classList.remove("bg-success", "bg-danger", "bg-warning");
        toast.classList.add(`bg-${type}`);
        document.getElementById("toastMessage").innerText = message;
        const bsToast = new window.bootstrap.Toast(toast, [{ delay: 3000 }]);
        bsToast.show();
      };

    const filteredAssets = assets.filter(asset =>
        asset.assetName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        asset.ID.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="container mt-4">
            <h1 className="text-center mb-4">Asset Management</h1>

            <div className="mb-3">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Search by ID or Asset Name"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="card p-4 mb-4 shadow-sm">
                <form onSubmit={handleSubmit} className="row g-3">
                    <div className="col-md-4">
                        <input
                            type="text"
                            name="ID"
                            className={`form-control ${formErrors.ID ? "is-invalid" : ""}`}
                            placeholder="ID"
                            value={form.ID}
                            onChange={handleChange}
                            required
                        />
                        {formErrors.ID && <div className="invalid-feedback">{formErrors.ID}</div>}
                    </div>
                    <div className="col-md-4">
                        <input
                            type="text"
                            name="assetName"
                            className={`form-control ${formErrors.assetName ? "is-invalid" : ""}`}
                            placeholder="Asset Name"
                            value={form.assetName}
                            onChange={handleChange}
                            required
                        />
                        {formErrors.assetName && <div className="invalid-feedback">{formErrors.assetName}</div>}
                    </div>
                    <div className="col-md-4">
                        <select
                            name="assetType"
                            className="form-select"
                            value={form.assetType}
                            onChange={handleChange}
                        >
                            <option value="Non-current">Non-current</option>
                            <option value="Current">Current</option>
                        </select>
                    </div>
                    <div className="col-md-4">
                        <input
                            type="date"
                            name="purchaseDate"
                            className={`form-control ${formErrors.purchaseDate ? "is-invalid" : ""}`}
                            value={form.purchaseDate}
                            onChange={handleChange}
                            required
                        />
                        {formErrors.purchaseDate && <div className="invalid-feedback">{formErrors.purchaseDate}</div>}
                    </div>
                    <div className="col-md-4">
                        <input
                            type="number"
                            name="assetValue"
                            className={`form-control ${formErrors.assetValue ? "is-invalid" : ""}`}
                            placeholder="Asset Value"
                            value={form.assetValue}
                            onChange={handleChange}
                            required
                        />
                        {formErrors.assetValue && <div className="invalid-feedback">{formErrors.assetValue}</div>}
                    </div>
                    <div className="col-md-4">
                        <button type="submit" className="btn btn-primary w-100">{editing ? "Update Asset" : "Add Asset"}</button>
                    </div>
                </form>
            </div>

            <table className="table table-bordered table-striped text-center">
                <thead className="table-dark">
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
                    {filteredAssets.map((asset) => (
                        <tr key={asset._id}>
                            <td>{asset.ID}</td>
                            <td>{asset.assetName}</td>
                            <td>{asset.assetType}</td>
                            <td>{new Date(asset.purchaseDate).toLocaleDateString()}</td>
                            <td>Rs.{asset.assetValue}</td>
                            <td>
                                <button className="btn btn-warning btn-sm me-2" onClick={() => handleEdit(asset)}>Edit</button>
                                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(asset._id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div id="toast" className="toast align-items-center text-white position-fixed bottom-0 end-0 p-3" role="alert">
        <div className="toast-body" id="toastMessage"></div>
      </div>
        </div>
        
    );
}

export default Asset; */




/* import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";

function Asset() {
    const [assets, setAssets] = useState([]);
    const [form, setForm] = useState({
        ID: "",
        assetName: "",
        assetType: "Non-current",
        purchaseDate: "",
        assetValue: ""
    });
    const [formErrors, setFormErrors] = useState({});
    const [editing, setEditing] = useState(false);
    const [editId, setEditId] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        fetchAssets();
    }, []);

    const fetchAssets = async () => {
        try {
            const res = await axios.get("http://localhost:8070/assets/");
            setAssets(res.data);
        } catch (err) {
            console.error("Error fetching assets", err);
        }
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setFormErrors({ ...formErrors, [e.target.name]: "" });
    };

    const validateForm = () => {
        const errors = {};

        // ID must start with 'A' and be followed by numbers
        const idRegex = /^A\d+$/;
        if (!idRegex.test(form.ID)) {
            errors.ID = "ID must start with 'A' followed by numeric values (e.g., A123).";
        }

        // Asset Name: alphabets and spaces only
        const nameRegex = /^[A-Za-z\s]+$/;
        if (!nameRegex.test(form.assetName)) {
            errors.assetName = "Asset Name must contain only alphabetic characters.";
        }

        if (!form.assetName.trim()) {
            errors.assetName = "Asset Name is required!";
        }

        // Asset Value: must be positive
        if (isNaN(form.assetValue) || form.assetValue <= 0) {
            errors.assetValue = "Asset Value must be a positive number!";
        }

        // Purchase Date: must not be future date
        const today = new Date();
        const enteredDate = new Date(form.purchaseDate);
        if (enteredDate > today) {
            errors.purchaseDate = "Purchase Date cannot be a future date!";
        }

        return errors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const errors = validateForm();
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }

        try {
            if (editing) {
                await axios.put(`http://localhost:8070/assets/update/${editId}`, form);
            } else {
                await axios.post("http://localhost:8070/assets/add", form);
            }
            setForm({ ID: "", assetName: "", assetType: "Non-current", purchaseDate: "", assetValue: "" });
            setEditing(false);
            showToast("Asset saved successfully!", "success");
            fetchAssets();
        } catch (err) {
            console.error("Error saving asset", err);
            showToast("Error saving asset!", "danger");
        }
    };

    const handleEdit = (asset) => {
        setForm({
            ID: asset.ID,
            assetName: asset.assetName,
            assetType: asset.assetType,
            purchaseDate: new Date(asset.purchaseDate).toISOString().split("T")[0],
            assetValue: asset.assetValue,
        });
        setEditing(true);
        setEditId(asset._id);
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this asset?")) {
            try {
                await axios.delete(`http://localhost:8070/assets/delete/${id}`);
                fetchAssets();
                showToast("Asset deleted successfully!", "warning");
            } catch (err) {
                console.error("Error deleting asset", err);
            }
        }
    };

    const showToast = (message, type) => {
        const toast = document.getElementById("toast");
        toast.classList.remove("bg-success", "bg-danger", "bg-warning");
        toast.classList.add(`bg-${type}`);
        document.getElementById("toastMessage").innerText = message;
        const bsToast = new window.bootstrap.Toast(toast, [{ delay: 3000 }]);
        bsToast.show();
    };

    const filteredAssets = assets.filter(asset =>
        asset.assetName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        asset.ID.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleAssetNameKeyDown = (e) => {
        const key = e.key;
        if (
            !(
                (key >= 'a' && key <= 'z') ||
                (key >= 'A' && key <= 'Z') ||
                key === ' ' ||
                key === 'Backspace' ||
                key === 'Delete'
            )
        ) {
            e.preventDefault();
        }
    };
    



    return (
        <div className="container mt-4">
            <h1 className="text-center mb-4">Asset Management</h1>

            <div className="mb-3">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Search by ID or Asset Name"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="card p-4 mb-4 shadow-sm">
                <form onSubmit={handleSubmit} className="row g-3">
                    <div className="col-md-4">
                        <input
                            type="text"
                            name="ID"
                            className={`form-control ${formErrors.ID ? "is-invalid" : ""}`}
                            placeholder="ID"
                            value={form.ID}
                            onChange={handleChange}
                            required
                        />
                        {formErrors.ID && <div className="invalid-feedback">{formErrors.ID}</div>}
                    </div>
                    <div className="col-md-4">
                        <input
                            type="text"
                            name="assetName"
                            className={`form-control ${formErrors.assetName ? "is-invalid" : ""}`}
                            placeholder="Asset Name"
                            value={form.assetName}
                            onChange={handleChange}
                            onKeyDown={handleAssetNameKeyDown}
                            required
                        />
                        {formErrors.assetName && <div className="invalid-feedback">{formErrors.assetName}</div>}
                    </div>
                    <div className="col-md-4">
                        <select
                            name="assetType"
                            className="form-select"
                            value={form.assetType}
                            onChange={handleChange}
                        >
                            <option value="Non-current">Non-current</option>
                            <option value="Current">Current</option>
                        </select>
                    </div>
                    <div className="col-md-4">
                        <input
                            type="date"
                            name="purchaseDate"
                            className={`form-control ${formErrors.purchaseDate ? "is-invalid" : ""}`}
                            value={form.purchaseDate}
                            onChange={handleChange}
                            required
                        />
                        {formErrors.purchaseDate && <div className="invalid-feedback">{formErrors.purchaseDate}</div>}
                    </div>
                    <div className="col-md-4">
                        <input
                            type="number"
                            name="assetValue"
                            className={`form-control ${formErrors.assetValue ? "is-invalid" : ""}`}
                            placeholder="Asset Value"
                            value={form.assetValue}
                            onChange={handleChange}
                            required
                        />
                        {formErrors.assetValue && <div className="invalid-feedback">{formErrors.assetValue}</div>}
                    </div>
                    <div className="col-md-4">
                        <button type="submit" className="btn btn-primary w-100">{editing ? "Update Asset" : "Add Asset"}</button>
                    </div>
                </form>
            </div>

            <table className="table table-bordered table-striped text-center">
                <thead className="table-dark">
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
                    {filteredAssets.map((asset) => (
                        <tr key={asset._id}>
                            <td>{asset.ID}</td>
                            <td>{asset.assetName}</td>
                            <td>{asset.assetType}</td>
                            <td>{new Date(asset.purchaseDate).toLocaleDateString()}</td>
                            <td>Rs.{asset.assetValue}</td>
                            <td>
                                <button className="btn btn-warning btn-sm me-2" onClick={() => handleEdit(asset)}>Edit</button>
                                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(asset._id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div id="toast" className="toast align-items-center text-white position-fixed bottom-0 end-0 p-3" role="alert">
                <div className="toast-body" id="toastMessage"></div>
            </div>
        </div>
    );
}

export default Asset; */




import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";

function Asset() {
    const [assets, setAssets] = useState([]);
    const [form, setForm] = useState({
        ID: "",
        assetName: "",
        assetType: "Non-current",
        purchaseDate: "",
        assetValue: ""
    });
    const [formErrors, setFormErrors] = useState({});
    const [editing, setEditing] = useState(false);
    const [editId, setEditId] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        fetchAssets();
    }, []);

    const fetchAssets = async () => {
        try {
            const res = await axios.get("http://localhost:8070/assets/");
            setAssets(res.data);
        } catch (err) {
            console.error("Error fetching assets", err);
        }
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setFormErrors({ ...formErrors, [e.target.name]: "" });
    };

    const validateForm = () => {
        const errors = {};

        const idRegex = /^A\d+$/;
        if (!idRegex.test(form.ID)) {
            errors.ID = "ID must start with 'A' followed by numeric values (e.g., A123).";
        }

        const nameRegex = /^[A-Za-z\s]+$/;
        if (!nameRegex.test(form.assetName)) {
            errors.assetName = "Asset Name must contain only alphabetic characters.";
        }

        if (!form.assetName.trim()) {
            errors.assetName = "Asset Name is required!";
        }

        if (isNaN(form.assetValue) || form.assetValue <= 0) {
            errors.assetValue = "Asset Value must be a positive number!";
        }

        const today = new Date();
        const enteredDate = new Date(form.purchaseDate);
        if (enteredDate > today) {
            errors.purchaseDate = "Purchase Date cannot be a future date!";
        }

        return errors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const errors = validateForm();
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }

        try {
            if (editing) {
                await axios.put(`http://localhost:8070/assets/update/${editId}`, form);
            } else {
                await axios.post("http://localhost:8070/assets/add", form);
            }
            setForm({ ID: "", assetName: "", assetType: "Non-current", purchaseDate: "", assetValue: "" });
            setEditing(false);
            showToast("Asset saved successfully!", "success");
            fetchAssets();
        } catch (err) {
            console.error("Error saving asset", err);
            showToast("Error saving asset!", "danger");
        }
    };

    const handleEdit = (asset) => {
        setForm({
            ID: asset.ID,
            assetName: asset.assetName,
            assetType: asset.assetType,
            purchaseDate: new Date(asset.purchaseDate).toISOString().split("T")[0],
            assetValue: asset.assetValue,
        });
        setEditing(true);
        setEditId(asset._id);
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this asset?")) {
            try {
                await axios.delete(`http://localhost:8070/assets/delete/${id}`);
                fetchAssets();
                showToast("Asset deleted successfully!", "warning");
            } catch (err) {
                console.error("Error deleting asset", err);
            }
        }
    };

    const showToast = (message, type) => {
        const toast = document.getElementById("toast");
        toast.classList.remove("bg-success", "bg-danger", "bg-warning");
        toast.classList.add(`bg-${type}`);
        document.getElementById("toastMessage").innerText = message;
        const bsToast = new window.bootstrap.Toast(toast, [{ delay: 3000 }]);
        bsToast.show();
    };

    const filteredAssets = assets.filter(asset =>
        asset.assetName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        asset.ID.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleAssetNameKeyDown = (e) => {
        const key = e.key;
        if (
            !(
                (key >= 'a' && key <= 'z') ||
                (key >= 'A' && key <= 'Z') ||
                key === ' ' ||
                key === 'Backspace' ||
                key === 'Delete'
            )
        ) {
            e.preventDefault();
        }
    };

    const handleAssetIDKeyDown = (e) => {
        const { value } = e.target;
        const key = e.key;

        const allowedKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'];

        if (allowedKeys.includes(key)) {
            return;
        }

        if (value.length === 0) {
            if (key !== 'A') {
                e.preventDefault();
            }
        } else {
            if (key < '0' || key > '9') {
                e.preventDefault();
            }
        }
    };

    return (
        <div className="container mt-4">
            <h1 className="text-center mb-4">Asset Management</h1>

            <div className="mb-3">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Search by ID or Asset Name"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="card p-4 mb-4 shadow-sm">
                <form onSubmit={handleSubmit} className="row g-3">
                    <div className="col-md-4">
                        <input
                            type="text"
                            name="ID"
                            className={`form-control ${formErrors.ID ? "is-invalid" : ""}`}
                            placeholder="ID"
                            value={form.ID}
                            onChange={handleChange}
                            onKeyDown={handleAssetIDKeyDown}
                            required
                        />
                        {formErrors.ID && <div className="invalid-feedback">{formErrors.ID}</div>}
                    </div>
                    <div className="col-md-4">
                        <input
                            type="text"
                            name="assetName"
                            className={`form-control ${formErrors.assetName ? "is-invalid" : ""}`}
                            placeholder="Asset Name"
                            value={form.assetName}
                            onChange={handleChange}
                            onKeyDown={handleAssetNameKeyDown}
                            required
                        />
                        {formErrors.assetName && <div className="invalid-feedback">{formErrors.assetName}</div>}
                    </div>
                    <div className="col-md-4">
                        <select
                            name="assetType"
                            className="form-select"
                            value={form.assetType}
                            onChange={handleChange}
                        >
                            <option value="Non-current">Non-current</option>
                            <option value="Current">Current</option>
                        </select>
                    </div>
                    <div className="col-md-4">
                        <input
                            type="date"
                            name="purchaseDate"
                            className={`form-control ${formErrors.purchaseDate ? "is-invalid" : ""}`}
                            value={form.purchaseDate}
                            onChange={handleChange}
                            required
                        />
                        {formErrors.purchaseDate && <div className="invalid-feedback">{formErrors.purchaseDate}</div>}
                    </div>
                    <div className="col-md-4">
                        <input
                            type="number"
                            name="assetValue"
                            className={`form-control ${formErrors.assetValue ? "is-invalid" : ""}`}
                            placeholder="Asset Value"
                            value={form.assetValue}
                            onChange={handleChange}
                            required
                        />
                        {formErrors.assetValue && <div className="invalid-feedback">{formErrors.assetValue}</div>}
                    </div>
                    <div className="col-md-4">
                        <button type="submit" className="btn btn-primary w-100">{editing ? "Update Asset" : "Add Asset"}</button>
                    </div>
                </form>
            </div>

            <table className="table table-bordered table-striped text-center">
                <thead className="table-dark">
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
                    {filteredAssets.map((asset) => (
                        <tr key={asset._id}>
                            <td>{asset.ID}</td>
                            <td>{asset.assetName}</td>
                            <td>{asset.assetType}</td>
                            <td>{new Date(asset.purchaseDate).toLocaleDateString()}</td>
                            <td>Rs.{asset.assetValue}</td>
                            <td>
                                <button className="btn btn-warning btn-sm me-2" onClick={() => handleEdit(asset)}>Edit</button>
                                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(asset._id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div id="toast" className="toast align-items-center text-white position-fixed bottom-0 end-0 p-3" role="alert">
                <div className="toast-body" id="toastMessage"></div>
            </div>
        </div>
    );
}

export default Asset;



