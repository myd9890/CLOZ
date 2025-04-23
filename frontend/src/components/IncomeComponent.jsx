import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";

function Income() {
    const [incomes, setIncomes] = useState([]);
    const [form, setForm] = useState({
        ID: "",
        Income: "",
        Date: "",
        Amount: ""
    });
    const [formErrors, setFormErrors] = useState({}); // State for validation errors
    const [editing, setEditing] = useState(false);
    const [editId, setEditId] = useState(null);
    const [sales, setSales] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        fetchIncomes();
    }, []);

    const fetchIncomes = async () => {
        try {
            const res = await axios.get("http://localhost:8070/incomes/");
            setIncomes(res.data);
        } catch (err) {
            console.error("Error fetching incomes", err);
        }
    };

    useEffect(() => {
        const fetchSales = async () => {
            try {
                const response = await axios.get("http://localhost:8070/sale/");
                setSales(response.data);
                console.log(response.data);
            } catch (err) {
                console.error("Error fetching sales", err);
            }
        };
    
        fetchSales();
    }, []);
    

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setFormErrors({ ...formErrors, [e.target.name]: "" }); // Clear error for the field being edited
    };

    const validateForm = () => {
        const errors = {};

        // Validation for ID: must start with "Inc" followed by numeric values
        const idRegex = /^Inc\d+$/;
        if (!idRegex.test(form.ID)) {
            errors.ID = "ID must start with 'Inc' followed by numeric values (e.g., Inc123).";
        }

        // Validation for Income Name: must contain only alphabetic characters
        const nameRegex = /^[A-Za-z\s]+$/;
        if (!nameRegex.test(form.Income)) {
            errors.Income = "Income Name must contain only alphabetic characters.";
        }

        if (!form.Income.trim()) {
            errors.Income = "Income Name is required!";
        }

        // Validation for Income Value: must be a positive number
        if (isNaN(form.Amount) || form.Amount <= 0) {
            errors.Amount = "Income Value must be a positive number!";
        }

        // Validation for Date: must not be a future date
        const today = new Date();
        const enteredDate = new Date(form.Date);
        if (enteredDate > today) {
            errors.Date = "Date cannot be a future date!";
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
                await axios.put(`http://localhost:8070/incomes/update/${editId}`, form);
            } else {
                await axios.post("http://localhost:8070/incomes/add", form);
            }
            setForm({ ID: "", Income: "", Date: "", Amount: "" });
            setEditing(false);
            showToast("Income saved successfully!", "success");
            fetchIncomes();
        } catch (err) {
            console.error("Error saving income", err);
            showToast("Error saving income!", "danger");
        }
    };

    const handleEdit = (income) => {
        setForm({
            ID: income.ID,
            Income: income.Income,
            Date: new Date(income.Date).toISOString().split("T")[0], // Format date for input
            Amount: income.Amount,
        });
        setEditing(true);
        setEditId(income._id); // Set the ID of the income being edited
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this income?")) {
            try {
                await axios.delete(`http://localhost:8070/incomes/delete/${id}`);
                fetchIncomes(); // Refresh the list after deletion
                showToast("Income deleted successfully!", "warning");
            } catch (err) {
                console.error("Error deleting income", err);
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

    const filteredIncomes = incomes.filter(income =>
        income.Income.toLowerCase().includes(searchTerm.toLowerCase()) ||
        income.ID.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="container mt-4">
            <h1 className="text-center mb-4">Income Management</h1>

            <div className="mb-3">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Search by ID or Income Name"
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
                            name="Income"
                            className={`form-control ${formErrors.Income ? "is-invalid" : ""}`}
                            placeholder="Income"
                            value={form.Income}
                            onChange={handleChange}
                            required
                        />
                        {formErrors.Income && <div className="invalid-feedback">{formErrors.Income}</div>}
                    </div>
                    <div className="col-md-4">
                        <input
                            type="date"
                            name="Date"
                            className={`form-control ${formErrors.Date ? "is-invalid" : ""}`}
                            value={form.Date}
                            onChange={handleChange}
                            required
                        />
                        {formErrors.Date && <div className="invalid-feedback">{formErrors.Date}</div>}
                    </div>
                    <div className="col-md-4">
                        <input
                            type="number"
                            name="Amount"
                            className={`form-control ${formErrors.Amount ? "is-invalid" : ""}`}
                            placeholder="Amount"
                            value={form.Amount}
                            onChange={handleChange}
                            required
                        />
                        {formErrors.Amount && <div className="invalid-feedback">{formErrors.Amount}</div>}
                    </div>
                    <div className="col-md-4">
                        <button type="submit" className="btn btn-primary w-100">{editing ? "Update Income" : "Add Income"}</button>
                    </div>
                </form>
            </div>

            <table className="table table-bordered table-striped text-center">
                <thead className="table-dark">
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Date</th>
                        <th>Amount</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredIncomes.map((income) => (
                        <tr key={income._id}>
                            <td>{income.ID}</td>
                            <td>{income.Income}</td>
                            <td>{new Date(income.Date).toLocaleDateString()}</td>
                            <td>Rs.{income.Amount}</td>
                            <td>
                                <button className="btn btn-warning btn-sm me-2" onClick={() => handleEdit(income)}>Edit</button>
                                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(income._id)}>Delete</button>
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

export default Income;