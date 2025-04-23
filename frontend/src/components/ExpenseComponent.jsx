import React, { useState, useEffect } from "react";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import "bootstrap/dist/js/bootstrap.bundle.min";

function Exp() {
  const [expenses, setExpenses] = useState([]);
  const [form, setForm] = useState({
    ID: "",
    expense: "",
    expenseType: "Distribution",
    expDate: "",
    Amount: "",
  });
  const [formErrors, setFormErrors] = useState({}); // State for validation errors
  const [editing, setEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  


  // Fetch all expenses
  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
        const res = await axios.get("http://localhost:8070/expenses/");
        setExpenses(res.data);
    } catch (err) {
        console.error("Error fetching expenses", err);
    }
};


const handleChange = (e) => {
  setForm({ ...form, [e.target.name]: e.target.value });
  setFormErrors({ ...formErrors, [e.target.name]: "" }); // Clear error for the field being edited
};

const validateForm = () => {
  const errors = {};

  // Validation for ID: must start with "Exp" followed by numeric values
  const idRegex = /^Exp\d+$/;
  if (!idRegex.test(form.ID)) {
      errors.ID = "ID must start with 'Exp' followed by numeric values (e.g., Exp123).";
  }

  // Validation for Expense Name: must contain only alphabetic characters
  const nameRegex = /^[A-Za-z\s]+$/;
  if (!nameRegex.test(form.expense)) {
      errors.expense = "Expense Name must contain only alphabetic characters.";
  }

  if (!form.expense.trim()) {
      errors.expense = "Expense Name is required!";
  }

  // Validation for Expense Value: must be a positive number
  if (isNaN(form.Amount) || form.Amount <= 0) {
      errors.Amount = "Expense Value must be a positive number!";
  }

  // Validation for Expense Date: must not be a future date
  const today = new Date();
  const enteredDate = new Date(form.expDate);
  if (enteredDate > today) {
      errors.expDate = "Expense Date cannot be a future date!";
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
          await axios.put(`http://localhost:8070/expenses/update/${editId}`, form);
      } else {
          await axios.post("http://localhost:8070/expenses/add", form);
      }
      setForm({ ID: "", expense: "", expenseType: "Non-current", expDate: "", Amount: "" });
      setEditing(false);
      showToast("Expense saved successfully!", "success");
      fetchExpenses();
  } catch (err) {
      console.error("Error saving expense", err);
      showToast("Error saving expense!", "danger");
  }
};

const handleEdit = (expense) => {
  setForm({
      ID: expense.ID,
      expense: expense.expense,
      expenseType: expense.expenseType,
      expDate: new Date(expense.expDate).toISOString().split("T")[0], // Format date for input
      Amount: expense.Amount,
  });
  setEditing(true);
  setEditId(expense._id); // Set the ID of the asset being edited
};

const handleDelete = async (id) => {
  if (window.confirm("Are you sure you want to delete this expense?")) {
      try {
          await axios.delete(`http://localhost:8070/expenses/delete/${id}`);
          fetchExpenses(); // Refresh the list after deletion
          showToast("Expense deleted successfully!", "warning");
      } catch (err) {
          console.error("Error deleting expense", err);
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

const filteredExpenses = expenses.filter(expense =>
  expense.expense.toLowerCase().includes(searchTerm.toLowerCase()) ||
  expense.ID.toLowerCase().includes(searchTerm.toLowerCase())
);

  return (
    <div className="container mt-4">
      <h1 className="text-center mb-4">Expense Management</h1>

      <div className="mb-3">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Search by ID or Expense Name"
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
            name="expense"
            className={`form-control ${formErrors.expense ? "is-invalid" : ""}`}
            placeholder="Expense"
            value={form.expense}
            onChange={handleChange}
            required
          />
          {formErrors.expense && <div className="invalid-feedback">{formErrors.expense}</div>}
        </div>

        <div className="col-md-4">
          
          <select
            name="expenseType"
            className="form-select"
            value={form.expenseType}
            onChange={handleChange}
    
          >
            <option value="Distribution">Distribution</option>
            <option value="Administrative">Administrative</option>
            <option value="Financial">Financial</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="col-md-4">
          
          <input
            type="date"
            name="expDate"
            className={`form-control ${formErrors.expDate ? "is-invalid" : ""}`}
            value={form.expDate}
            onChange={handleChange}
            required
          />
          {formErrors.expDate && <div className="invalid-feedback">{formErrors.expDate}</div>}
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

        <button type="submit" className="btn btn-primary w-100">{editing ? "Update" : "Add"} Expense</button>
          
        </div>
      </form>
      </div>

      <table className="table table-bordered table-striped text-center">
                <thead className="table-dark">
                    <tr>
                        <th>ID</th>
                        <th>Expense</th>
                        <th>Type</th>
                        <th>Date</th>
                        <th>Amount</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredExpenses.map((expense) => (
                        <tr key={expense._id}>
                            <td>{expense.ID}</td>
                            <td>{expense.expense}</td>
                            <td>{expense.expenseType}</td>
                            <td>{new Date(expense.expDate).toLocaleDateString()}</td>
                            <td>Rs.{expense.Amount}</td>
                            <td>
                                <button className="btn btn-warning btn-sm me-2" onClick={() => handleEdit(expense)}>Edit</button>
                                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(expense._id)}>Delete</button>
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

      

export default Exp;
