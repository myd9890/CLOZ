/* 
import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";

function Income() {
    const [incomes, setIncomes] = useState([]);
    const [form, setForm] = useState({
        ID: "",
        IncomeName: "",
        IncomeDate: "",
        Amount: ""
    });
    const [formErrors, setFormErrors] = useState({});
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
        setFormErrors({ ...formErrors, [e.target.name]: "" });
    };

    const validateForm = () => {
        const errors = {};
        const idRegex = /^Inc\d+$/;
        if (!idRegex.test(form.ID)) {
            errors.ID = "ID must start with 'Inc' followed by numeric values (e.g., Inc123).";
        }
        const nameRegex = /^[A-Za-z\s]+$/;
        if (!nameRegex.test(form.IncomeName)) {
            errors.IncomeName = "Income Name must contain only alphabetic characters.";
        }
        if (!form.IncomeName.trim()) {
            errors.IncomeName = "Income Name is required!";
        }
        if (isNaN(form.Amount) || form.Amount <= 0) {
            errors.Amount = "Income Value must be a positive number!";
        }
        const today = new Date();
        const enteredDate = new Date(form.IncomeDate);
        if (enteredDate > today) {
            errors.IncomeDate = "Date cannot be a future date!";
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
                await axios.put(`http://localhost:8070/incomes/update/${editId}`, form);
            } else {
                await axios.post("http://localhost:8070/incomes/add", form);
            }
            setForm({ ID: "", IncomeName: "", IncomeDate: "", Amount: "" });
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
            IncomeName: income.IncomeName,
            IncomeDate: new Date(income.IncomeDate).toISOString().split("T")[0],
            Amount: income.Amount,
        });
        setEditing(true);
        setEditId(income._id);
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this income?")) {
            try {
                await axios.delete(`http://localhost:8070/incomes/delete/${id}`);
                fetchIncomes();
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
        income.IncomeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        income.ID.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalSales = sales.reduce((total, sale) => total + Number(sale.totalAmount || 0), 0);

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
                            name="IncomeName"
                            className={`form-control ${formErrors.IncomeName ? "is-invalid" : ""}`}
                            placeholder="Income"
                            value={form.IncomeName}
                            onChange={handleChange}
                            required
                        />
                        {formErrors.IncomeName && <div className="invalid-feedback">{formErrors.IncomeName}</div>}
                    </div>
                    <div className="col-md-4">
                        <input
                            type="date"
                            name="IncomeDate"
                            className={`form-control ${formErrors.IncomeDate ? "is-invalid" : ""}`}
                            value={form.IncomeDate}
                            onChange={handleChange}
                            required
                        />
                        {formErrors.IncomeDate && <div className="invalid-feedback">{formErrors.IncomeDate}</div>}
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
                        <button type="submit" className="btn btn-primary w-100">
                            {editing ? "Update Income" : "Add Income"}
                        </button>
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
                            <td>{income.IncomeName}</td>
                            <td>{new Date(income.IncomeDate).toLocaleDateString()}</td>
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
 */


/* import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";

function Income() {
    const [incomes, setIncomes] = useState([]);
    const [form, setForm] = useState({
        ID: "",
        IncomeName: "",
        IncomeDate: "",
        Amount: ""
    });
    const [formErrors, setFormErrors] = useState({});
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
            } catch (err) {
                console.error("Error fetching sales", err);
            }
        };
        fetchSales();
    }, []);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setFormErrors({ ...formErrors, [e.target.name]: "" });
    };

    const validateForm = () => {
        const errors = {};
        const idRegex = /^Inc\d+$/;
        if (!idRegex.test(form.ID)) {
            errors.ID = "ID must start with 'Inc' followed by numeric values (e.g., Inc123).";
        }
        const nameRegex = /^[A-Za-z\s]+$/;
        if (!nameRegex.test(form.IncomeName)) {
            errors.IncomeName = "Income Name must contain only alphabetic characters.";
        }
        if (!form.IncomeName.trim()) {
            errors.IncomeName = "Income Name is required!";
        }
        if (isNaN(form.Amount) || form.Amount <= 0) {
            errors.Amount = "Income Value must be a positive number!";
        }
        const today = new Date();
        const enteredDate = new Date(form.IncomeDate);
        if (enteredDate > today) {
            errors.IncomeDate = "Date cannot be a future date!";
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
                await axios.put(`http://localhost:8070/incomes/update/${editId}`, form);
            } else {
                await axios.post("http://localhost:8070/incomes/add", form);
            }
            setForm({ ID: "", IncomeName: "", IncomeDate: "", Amount: "" });
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
            IncomeName: income.IncomeName,
            IncomeDate: new Date(income.IncomeDate).toISOString().split("T")[0],
            Amount: income.Amount,
        });
        setEditing(true);
        setEditId(income._id);
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this income?")) {
            try {
                await axios.delete(`http://localhost:8070/incomes/delete/${id}`);
                fetchIncomes();
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

    const handleIncomeNameKeyDown = (e) => {
        const key = e.key;
        if (!/^[a-zA-Z\s]$/.test(key) && key.length === 1) {
            e.preventDefault();
        }
    };

    const filteredIncomes = incomes.filter(income =>
        income.IncomeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        income.ID.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalSales = sales.reduce((total, sale) => total + Number(sale.totalAmount || 0), 0);

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
                            name="IncomeName"
                            className={`form-control ${formErrors.IncomeName ? "is-invalid" : ""}`}
                            placeholder="Income"
                            value={form.IncomeName}
                            onChange={handleChange}
                            onKeyDown={handleIncomeNameKeyDown}
                            required
                        />
                        {formErrors.IncomeName && <div className="invalid-feedback">{formErrors.IncomeName}</div>}
                    </div>
                    <div className="col-md-4">
                        <input
                            type="date"
                            name="IncomeDate"
                            className={`form-control ${formErrors.IncomeDate ? "is-invalid" : ""}`}
                            value={form.IncomeDate}
                            onChange={handleChange}
                            required
                        />
                        {formErrors.IncomeDate && <div className="invalid-feedback">{formErrors.IncomeDate}</div>}
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
                        <button type="submit" className="btn btn-primary w-100">
                            {editing ? "Update Income" : "Add Income"}
                        </button>
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
                            <td>{income.IncomeName}</td>
                            <td>{new Date(income.IncomeDate).toLocaleDateString()}</td>
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

export default Income; */






import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";

function Income() {
    const [incomes, setIncomes] = useState([]);
    const [form, setForm] = useState({
        ID: "",
        IncomeName: "",
        IncomeDate: "",
        Amount: ""
    });
    const [formErrors, setFormErrors] = useState({});
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
            } catch (err) {
                console.error("Error fetching sales", err);
            }
        };
        fetchSales();
    }, []);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setFormErrors({ ...formErrors, [e.target.name]: "" });
    };

    const validateForm = () => {
        const errors = {};
        const idRegex = /^Inc\d+$/;
        if (!idRegex.test(form.ID)) {
            errors.ID = "ID must start with 'Inc' followed by numeric values (e.g., Inc123).";
        }
        const nameRegex = /^[A-Za-z\s]+$/;
        if (!nameRegex.test(form.IncomeName)) {
            errors.IncomeName = "Income Name must contain only alphabetic characters.";
        }
        if (!form.IncomeName.trim()) {
            errors.IncomeName = "Income Name is required!";
        }
        if (isNaN(form.Amount) || form.Amount <= 0) {
            errors.Amount = "Income Value must be a positive number!";
        }
        const today = new Date();
        const enteredDate = new Date(form.IncomeDate);
        if (enteredDate > today) {
            errors.IncomeDate = "Date cannot be a future date!";
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
                await axios.put(`http://localhost:8070/incomes/update/${editId}`, form);
            } else {
                await axios.post("http://localhost:8070/incomes/add", form);
            }
            setForm({ ID: "", IncomeName: "", IncomeDate: "", Amount: "" });
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
            IncomeName: income.IncomeName,
            IncomeDate: new Date(income.IncomeDate).toISOString().split("T")[0],
            Amount: income.Amount,
        });
        setEditing(true);
        setEditId(income._id);
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this income?")) {
            try {
                await axios.delete(`http://localhost:8070/incomes/delete/${id}`);
                fetchIncomes();
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

    // Allow only valid keys for IncomeName (letters + spaces)
    const handleIncomeNameKeyDown = (e) => {
        const key = e.key;
        if (!/^[a-zA-Z\s]$/.test(key) && key.length === 1) {
            e.preventDefault();
        }
    };

    // Allow only "I", "n", "c", and numbers for ID
    const handleIdKeyDown = (e) => {
        const allowedChars = ['I', 'n', 'c', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
        if (!allowedChars.includes(e.key) && e.key.length === 1 && e.key !== "Backspace" && e.key !== "Delete") {
            e.preventDefault();
        }
    };

    const filteredIncomes = incomes.filter(income =>
        income.IncomeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        income.ID.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalSales = sales.reduce((total, sale) => total + Number(sale.totalAmount || 0), 0);

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
                            onKeyDown={handleIdKeyDown} // <-- Added here
                            required
                        />
                        {formErrors.ID && <div className="invalid-feedback">{formErrors.ID}</div>}
                    </div>
                    <div className="col-md-4">
                        <input
                            type="text"
                            name="IncomeName"
                            className={`form-control ${formErrors.IncomeName ? "is-invalid" : ""}`}
                            placeholder="Income"
                            value={form.IncomeName}
                            onChange={handleChange}
                            onKeyDown={handleIncomeNameKeyDown}
                            required
                        />
                        {formErrors.IncomeName && <div className="invalid-feedback">{formErrors.IncomeName}</div>}
                    </div>
                    <div className="col-md-4">
                        <input
                            type="date"
                            name="IncomeDate"
                            className={`form-control ${formErrors.IncomeDate ? "is-invalid" : ""}`}
                            value={form.IncomeDate}
                            onChange={handleChange}
                            required
                        />
                        {formErrors.IncomeDate && <div className="invalid-feedback">{formErrors.IncomeDate}</div>}
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
                        <button type="submit" className="btn btn-primary w-100">
                            {editing ? "Update Income" : "Add Income"}
                        </button>
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
                            <td>{income.IncomeName}</td>
                            <td>{new Date(income.IncomeDate).toLocaleDateString()}</td>
                            <td>Rs.{income.Amount}</td>
                            <td>
                                <button className="btn btn-warning btn-sm me-2" onClick={() => handleEdit(income)}>Edit</button>
                                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(income._id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Toast */}
            <div id="toast" className="toast align-items-center text-white position-fixed bottom-0 end-0 p-3" role="alert">
                <div className="toast-body" id="toastMessage"></div>
            </div>
        </div>
    );
}

export default Income;

