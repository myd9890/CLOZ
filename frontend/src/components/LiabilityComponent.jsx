/* import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";

function Liab() {
    const [liabilities, setLiabilities] = useState([]);
    const [form, setForm] = useState({
        ID: "",
        liabilityName: "",
        liabilityType: "Non-current",
        liabDate: "",
        liabilityAmount: "",
    });
     const [formErrors, setFormErrors] = useState({}); // State for validation errors
    const [editing, setEditing] = useState(false);
    const [editId, setEditId] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        fetchLiabilities();
    }, []);

    const fetchLiabilities = async () => {
        try {
            const response = await axios.get("http://localhost:8070/liabilities/");
            setLiabilities(response.data);
        } catch (error) {
            console.error("Error fetching liabilities:", error);
        }
    };

    const validateForm = () => {
        const errors = {};

        // Validation for ID: must start with "L" followed by numeric values
        const idRegex = /^L\d+$/;
        if (!form.ID.trim()) {
            errors.ID = "ID is required.";
        } else if (!idRegex.test(form.ID)) {
            errors.ID = "ID must start with 'L' followed by numeric values (e.g., L123).";
        }

        // Validation for Liability Name: must contain only alphabetic characters
        const nameRegex = /^[A-Za-z\s]+$/;
        if (!form.liabilityName.trim()) {
            errors.liabilityName = "Liability Name is required.";
        } else if (!nameRegex.test(form.liabilityName)) {
            errors.liabilityName = "Liability Name must contain only alphabetic characters.";
        }

        if (!form.liabDate) {
            errors.liabDate = "Date is required.";
        } else if (new Date(form.liabDate) > new Date()) {
            errors.liabDate = "Date cannot be in the future.";
        }

        if (!form.liabilityAmount) {
            errors.liabilityAmount = "Amount is required.";
        } else if (isNaN(form.liabilityAmount) || Number(form.liabilityAmount) <= 0) {
            errors.liabilityAmount = "Amount must be a positive number.";
        }

        return errors;
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setFormErrors({ ...formErrors, [e.target.name]: "" }); // Clear error for the field being edited
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
                await axios.put(`http://localhost:8070/liabilities/update/${editId}`, form);
            } else {
                await axios.post("http://localhost:8070/liabilities/add", form);
            }

            setForm({ ID: "", liabilityName: "", liabilityType: "Non-current", liabDate: "", liabilityAmount: "" });
            setEditing(false);
            showToast("Liability saved successfully!", "success");
            fetchLiabilities();
        } catch (error) {
            console.error("Error saving liability:", error);
            showToast("Error saving liability!", "danger");
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this liability?")) {
            try {
                await axios.delete(`http://localhost:8070/liabilities/delete/${id}`);
                fetchLiabilities();
                showToast("Liability deleted successfully!", "warning");
            } catch (error) {
                console.error("Error deleting liability:", error);
                showToast("Error deleting liability!", "danger");
            }
        }
    };

    const handleEdit = (liability) => {
        setForm({
            ID: liability.ID,
            liabilityName: liability.liabilityName,
            liabilityType: liability.liabilityType,
            liabDate: new Date(liability.liabDate).toISOString().split("T")[0], // Format date for input
            liabilityAmount: liability.liabilityAmount,
        });
        setEditing(true);
        setEditId(liability._id);
    };

    const showToast = (message, type) => {
      const toast = document.getElementById("toast");
      toast.classList.remove("bg-success", "bg-danger", "bg-warning");
      toast.classList.add(`bg-${type}`);
      document.getElementById("toastMessage").innerText = message;
      const bsToast = new window.bootstrap.Toast(toast, { delay: 3000 });
      bsToast.show();
  };

  const filteredLiab = liabilities.filter(liability =>
    liability.liabilityName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    liability.ID.toLowerCase().includes(searchTerm.toLowerCase())
);

  return (
      <div className="container mt-4">
          <h1 className="text-center mb-4">Liability Management</h1>

          <div className="mb-3">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Search by ID or Liability Name"
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
                      placeholder="ID"
                      value={form.ID}
                      onChange={handleChange}
                      className={`form-control ${formErrors.ID ? "is-invalid" : ""}`}
                      required
                  />
                  {formErrors.ID && <div className="invalid-feedback">{formErrors.ID}</div>}
              </div>

              <div className="col-md-4">
                  
                  <input
                      type="text"
                      name="liabilityName"
                      placeholder="Liability"
                      value={form.liabilityName}
                      onChange={handleChange}
                      className={`form-control ${formErrors.liabilityName ? "is-invalid" : ""}`}
                      required
                  />
                  {formErrors.liabilityName && <div className="invalid-feedback">{formErrors.liabilityName}</div>}
              </div>

              <div className="col-md-4">
        
                  <select
                      name="liabilityType"
                      value={form.liabilityType}
                      onChange={handleChange}
                      className="form-select"
                  >
                      <option value="Non-current">Non-current</option>
                      <option value="Current">Current</option>
                  </select>
              </div>

              <div className="col-md-4">
                  
                  <input
                      type="date"
                      name="liabDate"
                      value={form.liabDate}
                      onChange={handleChange}
                      className={`form-control ${formErrors.liabDate ? "is-invalid" : ""}`}
                      required
                  />
                  {formErrors.liabDate && <div className="invalid-feedback">{formErrors.liabDate}</div>}
              </div>

              <div className="col-md-4">
                  
                  <input
                      type="number"
                      name="liabilityAmount"
                      placeholder="Liability amount"
                      value={form.liabilityAmount}
                      onChange={handleChange}
                      className={`form-control ${formErrors.liabilityAmount ? "is-invalid" : ""}`}
                      required
                  />
                  {formErrors.liabilityAmount && <div className="invalid-feedback">{formErrors.liabilityAmount}</div>}
              </div>

              <div className="col-md-4">
              <button type="submit" className="btn btn-primary w-100">
                  {editing ? "Update" : "Add"} Liability
              </button>
              </div>
          </form>
          </div>

          <table className="table table-bordered table-striped text-center">
            <thead className="table-dark">
              <tr>
                <th>ID</th>
                <th>Liability Name</th>
                <th>Liability Type</th>
                <th>Date</th>
                <th>Amount</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>

          
          
          {filteredLiab.map((liability) => (
            <tr key={liability._id}>
              <td>{liability.ID}</td>
              <td>{liability.liabilityName}</td>
              <td>{liability.liabilityType}</td>
              <td>{new Date(liability.liabDate).toLocaleDateString()}</td>
              <td>Rs.{liability.liabilityAmount}</td>
              <td>
                <button onClick={() => handleEdit(liability)} className="btn btn-warning btn-sm me-2">Edit</button>
                <button onClick={() => handleDelete(liability._id)} className="btn btn-danger btn-sm">Delete</button>
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

export default Liab; */



/* import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";

function Liab() {
    const [liabilities, setLiabilities] = useState([]);
    const [form, setForm] = useState({
        ID: "",
        liabilityName: "",
        liabilityType: "Non-current",
        liabDate: "",
        liabilityAmount: "",
    });
    const [formErrors, setFormErrors] = useState({});
    const [editing, setEditing] = useState(false);
    const [editId, setEditId] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        fetchLiabilities();
    }, []);

    const fetchLiabilities = async () => {
        try {
            const response = await axios.get("http://localhost:8070/liabilities/");
            setLiabilities(response.data);
        } catch (error) {
            console.error("Error fetching liabilities:", error);
        }
    };

    const validateForm = () => {
        const errors = {};

        const idRegex = /^L\d+$/;
        if (!form.ID.trim()) {
            errors.ID = "ID is required.";
        } else if (!idRegex.test(form.ID)) {
            errors.ID = "ID must start with 'L' followed by numeric values (e.g., L123).";
        }

        const nameRegex = /^[A-Za-z\s]+$/;
        if (!form.liabilityName.trim()) {
            errors.liabilityName = "Liability Name is required.";
        } else if (!nameRegex.test(form.liabilityName)) {
            errors.liabilityName = "Liability Name must contain only alphabetic characters.";
        }

        if (!form.liabDate) {
            errors.liabDate = "Date is required.";
        } else if (new Date(form.liabDate) > new Date()) {
            errors.liabDate = "Date cannot be in the future.";
        }

        if (!form.liabilityAmount) {
            errors.liabilityAmount = "Amount is required.";
        } else if (isNaN(form.liabilityAmount) || Number(form.liabilityAmount) <= 0) {
            errors.liabilityAmount = "Amount must be a positive number.";
        }

        return errors;
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setFormErrors({ ...formErrors, [e.target.name]: "" });
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
                await axios.put(`http://localhost:8070/liabilities/update/${editId}`, form);
            } else {
                await axios.post("http://localhost:8070/liabilities/add", form);
            }

            setForm({ ID: "", liabilityName: "", liabilityType: "Non-current", liabDate: "", liabilityAmount: "" });
            setEditing(false);
            showToast("Liability saved successfully!", "success");
            fetchLiabilities();
        } catch (error) {
            console.error("Error saving liability:", error);
            showToast("Error saving liability!", "danger");
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this liability?")) {
            try {
                await axios.delete(`http://localhost:8070/liabilities/delete/${id}`);
                fetchLiabilities();
                showToast("Liability deleted successfully!", "warning");
            } catch (error) {
                console.error("Error deleting liability:", error);
                showToast("Error deleting liability!", "danger");
            }
        }
    };

    const handleEdit = (liability) => {
        setForm({
            ID: liability.ID,
            liabilityName: liability.liabilityName,
            liabilityType: liability.liabilityType,
            liabDate: new Date(liability.liabDate).toISOString().split("T")[0],
            liabilityAmount: liability.liabilityAmount,
        });
        setEditing(true);
        setEditId(liability._id);
    };

    const showToast = (message, type) => {
        const toast = document.getElementById("toast");
        toast.classList.remove("bg-success", "bg-danger", "bg-warning");
        toast.classList.add(`bg-${type}`);
        document.getElementById("toastMessage").innerText = message;
        const bsToast = new window.bootstrap.Toast(toast, { delay: 3000 });
        bsToast.show();
    };

    const filteredLiab = liabilities.filter(liability =>
        liability.liabilityName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        liability.ID.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // New: Function to restrict input to only letters and spaces
    const handleNameKeyDown = (e) => {
        const allowedKeys = [
            ...Array.from({ length: 26 }, (_, i) => i + 65), // A-Z
            ...Array.from({ length: 26 }, (_, i) => i + 97), // a-z
            8, // Backspace
            32 // Space
        ];
        if (!allowedKeys.includes(e.keyCode)) {
            e.preventDefault();
        }
    };

    return (
        <div className="container mt-4">
            <h1 className="text-center mb-4">Liability Management</h1>

            <div className="mb-3">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Search by ID or Liability Name"
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
                            placeholder="ID"
                            value={form.ID}
                            onChange={handleChange}
                            className={`form-control ${formErrors.ID ? "is-invalid" : ""}`}
                            required
                        />
                        {formErrors.ID && <div className="invalid-feedback">{formErrors.ID}</div>}
                    </div>

                    <div className="col-md-4">
                        <input
                            type="text"
                            name="liabilityName"
                            placeholder="Liability Name"
                            value={form.liabilityName}
                            onChange={handleChange}
                            onKeyDown={handleNameKeyDown} // <-- Added onKeyDown here
                            className={`form-control ${formErrors.liabilityName ? "is-invalid" : ""}`}
                            required
                        />
                        {formErrors.liabilityName && <div className="invalid-feedback">{formErrors.liabilityName}</div>}
                    </div>

                    <div className="col-md-4">
                        <select
                            name="liabilityType"
                            value={form.liabilityType}
                            onChange={handleChange}
                            className="form-select"
                        >
                            <option value="Non-current">Non-current</option>
                            <option value="Current">Current</option>
                        </select>
                    </div>

                    <div className="col-md-4">
                        <input
                            type="date"
                            name="liabDate"
                            value={form.liabDate}
                            onChange={handleChange}
                            className={`form-control ${formErrors.liabDate ? "is-invalid" : ""}`}
                            required
                        />
                        {formErrors.liabDate && <div className="invalid-feedback">{formErrors.liabDate}</div>}
                    </div>

                    <div className="col-md-4">
                        <input
                            type="number"
                            name="liabilityAmount"
                            placeholder="Liability Amount"
                            value={form.liabilityAmount}
                            onChange={handleChange}
                            className={`form-control ${formErrors.liabilityAmount ? "is-invalid" : ""}`}
                            required
                        />
                        {formErrors.liabilityAmount && <div className="invalid-feedback">{formErrors.liabilityAmount}</div>}
                    </div>

                    <div className="col-md-4">
                        <button type="submit" className="btn btn-primary w-100">
                            {editing ? "Update" : "Add"} Liability
                        </button>
                    </div>
                </form>
            </div>

            <table className="table table-bordered table-striped text-center">
                <thead className="table-dark">
                    <tr>
                        <th>ID</th>
                        <th>Liability Name</th>
                        <th>Liability Type</th>
                        <th>Date</th>
                        <th>Amount</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredLiab.map((liability) => (
                        <tr key={liability._id}>
                            <td>{liability.ID}</td>
                            <td>{liability.liabilityName}</td>
                            <td>{liability.liabilityType}</td>
                            <td>{new Date(liability.liabDate).toLocaleDateString()}</td>
                            <td>Rs.{liability.liabilityAmount}</td>
                            <td>
                                <button onClick={() => handleEdit(liability)} className="btn btn-warning btn-sm me-2">Edit</button>
                                <button onClick={() => handleDelete(liability._id)} className="btn btn-danger btn-sm">Delete</button>
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

export default Liab; */





import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";

function Liab() {
    const [liabilities, setLiabilities] = useState([]);
    const [form, setForm] = useState({
        ID: "",
        liabilityName: "",
        liabilityType: "Non-current",
        liabDate: "",
        liabilityAmount: "",
    });
    const [formErrors, setFormErrors] = useState({});
    const [editing, setEditing] = useState(false);
    const [editId, setEditId] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        fetchLiabilities();
    }, []);

    const fetchLiabilities = async () => {
        try {
            const response = await axios.get("http://localhost:8070/liabilities/");
            setLiabilities(response.data);
        } catch (error) {
            console.error("Error fetching liabilities:", error);
        }
    };

    const validateForm = () => {
        const errors = {};

        const idRegex = /^L\d+$/;
        if (!form.ID.trim()) {
            errors.ID = "ID is required.";
        } else if (!idRegex.test(form.ID)) {
            errors.ID = "ID must start with 'L' followed by numeric values (e.g., L123).";
        }

        const nameRegex = /^[A-Za-z\s]+$/;
        if (!form.liabilityName.trim()) {
            errors.liabilityName = "Liability Name is required.";
        } else if (!nameRegex.test(form.liabilityName)) {
            errors.liabilityName = "Liability Name must contain only alphabetic characters.";
        }

        if (!form.liabDate) {
            errors.liabDate = "Date is required.";
        } else if (new Date(form.liabDate) > new Date()) {
            errors.liabDate = "Date cannot be in the future.";
        }

        if (!form.liabilityAmount) {
            errors.liabilityAmount = "Amount is required.";
        } else if (isNaN(form.liabilityAmount) || Number(form.liabilityAmount) <= 0) {
            errors.liabilityAmount = "Amount must be a positive number.";
        }

        return errors;
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setFormErrors({ ...formErrors, [e.target.name]: "" });
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
                await axios.put(`http://localhost:8070/liabilities/update/${editId}`, form);
            } else {
                await axios.post("http://localhost:8070/liabilities/add", form);
            }

            setForm({ ID: "", liabilityName: "", liabilityType: "Non-current", liabDate: "", liabilityAmount: "" });
            setEditing(false);
            showToast("Liability saved successfully!", "success");
            fetchLiabilities();
        } catch (error) {
            console.error("Error saving liability:", error);
            showToast("Error saving liability!", "danger");
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this liability?")) {
            try {
                await axios.delete(`http://localhost:8070/liabilities/delete/${id}`);
                fetchLiabilities();
                showToast("Liability deleted successfully!", "warning");
            } catch (error) {
                console.error("Error deleting liability:", error);
                showToast("Error deleting liability!", "danger");
            }
        }
    };

    const handleEdit = (liability) => {
        setForm({
            ID: liability.ID,
            liabilityName: liability.liabilityName,
            liabilityType: liability.liabilityType,
            liabDate: new Date(liability.liabDate).toISOString().split("T")[0],
            liabilityAmount: liability.liabilityAmount,
        });
        setEditing(true);
        setEditId(liability._id);
    };

    const showToast = (message, type) => {
        const toast = document.getElementById("toast");
        toast.classList.remove("bg-success", "bg-danger", "bg-warning");
        toast.classList.add(`bg-${type}`);
        document.getElementById("toastMessage").innerText = message;
        const bsToast = new window.bootstrap.Toast(toast, { delay: 3000 });
        bsToast.show();
    };

    const filteredLiab = liabilities.filter(liability =>
        liability.liabilityName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        liability.ID.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleNameKeyDown = (e) => {
        const allowedKeys = /^[a-zA-Z\s]$/;
        if (!allowedKeys.test(e.key) && !["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab"].includes(e.key)) {
            e.preventDefault();
        }
    };

    // NEW: Handle ID input validation (L followed by numbers)
    const handleIDKeyDown = (e) => {
        const { value } = e.target;

        // Allow control keys
        if (["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab"].includes(e.key)) {
            return;
        }

        if (value.length === 0) {
            // First character must be 'L' or 'l'
            if (e.key.toUpperCase() !== 'L') {
                e.preventDefault();
            }
        } else {
            // After first character, only numbers allowed
            if (!/[0-9]/.test(e.key)) {
                e.preventDefault();
            }
        }
    };

    return (
        <div className="container mt-4">
            <h1 className="text-center mb-4">Liability Management</h1>

            <div className="mb-3">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Search by ID or Liability Name"
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
                            placeholder="ID"
                            value={form.ID}
                            onChange={handleChange}
                            onKeyDown={handleIDKeyDown}
                            className={`form-control ${formErrors.ID ? "is-invalid" : ""}`}
                            required
                        />
                        {formErrors.ID && <div className="invalid-feedback">{formErrors.ID}</div>}
                    </div>

                    <div className="col-md-4">
                        <input
                            type="text"
                            name="liabilityName"
                            placeholder="Liability Name"
                            value={form.liabilityName}
                            onChange={handleChange}
                            onKeyDown={handleNameKeyDown}
                            className={`form-control ${formErrors.liabilityName ? "is-invalid" : ""}`}
                            required
                        />
                        {formErrors.liabilityName && <div className="invalid-feedback">{formErrors.liabilityName}</div>}
                    </div>

                    <div className="col-md-4">
                        <select
                            name="liabilityType"
                            value={form.liabilityType}
                            onChange={handleChange}
                            className="form-select"
                        >
                            <option value="Non-current">Non-current</option>
                            <option value="Current">Current</option>
                        </select>
                    </div>

                    <div className="col-md-4">
                        <input
                            type="date"
                            name="liabDate"
                            value={form.liabDate}
                            onChange={handleChange}
                            className={`form-control ${formErrors.liabDate ? "is-invalid" : ""}`}
                            required
                        />
                        {formErrors.liabDate && <div className="invalid-feedback">{formErrors.liabDate}</div>}
                    </div>

                    <div className="col-md-4">
                        <input
                            type="number"
                            name="liabilityAmount"
                            placeholder="Liability Amount"
                            value={form.liabilityAmount}
                            onChange={handleChange}
                            className={`form-control ${formErrors.liabilityAmount ? "is-invalid" : ""}`}
                            required
                        />
                        {formErrors.liabilityAmount && <div className="invalid-feedback">{formErrors.liabilityAmount}</div>}
                    </div>

                    <div className="col-md-4">
                        <button type="submit" className="btn btn-primary w-100">
                            {editing ? "Update" : "Add"} Liability
                        </button>
                    </div>
                </form>
            </div>

            <table className="table table-bordered table-striped text-center">
                <thead className="table-dark">
                    <tr>
                        <th>ID</th>
                        <th>Liability Name</th>
                        <th>Liability Type</th>
                        <th>Date</th>
                        <th>Amount</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredLiab.map((liability) => (
                        <tr key={liability._id}>
                            <td>{liability.ID}</td>
                            <td>{liability.liabilityName}</td>
                            <td>{liability.liabilityType}</td>
                            <td>{new Date(liability.liabDate).toLocaleDateString()}</td>
                            <td>Rs.{liability.liabilityAmount}</td>
                            <td>
                                <button onClick={() => handleEdit(liability)} className="btn btn-warning btn-sm me-2">Edit</button>
                                <button onClick={() => handleDelete(liability._id)} className="btn btn-danger btn-sm">Delete</button>
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

export default Liab;

