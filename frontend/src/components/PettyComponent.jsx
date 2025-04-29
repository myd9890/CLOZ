/* import { useState, useEffect, useRef } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";

export default function PettyCash() {
  const [expenses, setExpenses] = useState([]);
  const [form, setForm] = useState({ ID: "", expense: "", Type: "Debit", expDate: "", Amount: "" });
  const [editing, setEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchPetty();
  }, []);
 
  const fetchPetty = async () => {
    try {
      const res = await axios.get("http://localhost:8070/pettycash/");
      setExpenses(res.data);
    } catch (err) {
      console.error("Error fetching petty cash transactions", err);
    }
  };
  
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setFormErrors({ ...formErrors, [e.target.name]: "" }); // Clear error for the field being edited
  };

  const validateForm = () => {
    const errors = {};

    // Validation for ID: must start with "Pet" followed by numeric characters
    const idRegex = /^Pet\d+$/;
    if (!form.ID) {
        errors.ID = "ID is required.";
    } else if (!idRegex.test(form.ID)) {
        errors.ID = "ID must start with 'Pet' followed by numeric characters (e.g., Pet123).";
    }

    if (!form.expense) {
        errors.expense = "Expense is required.";
    }

    // Validation for Date: must not be a future date
    if (!form.expDate) {
        errors.expDate = "Date is required.";
    } else {
        const today = new Date();
        const enteredDate = new Date(form.expDate);
        if (enteredDate > today) {
            errors.expDate = "Date cannot be in the future.";
        }
    }

    if (isNaN(form.Amount) || form.Amount <= 0) {
        errors.Amount = "Amount must be a positive number.";
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
                await axios.put(`http://localhost:8070/pettycash/update/${editId}`, form);
            } else {
                await axios.post("http://localhost:8070/pettycash/add", form);
            }
            setForm({ ID: "", expense: "", Type: "Debit", expDate: "", Amount: "" });
            setEditing(false);
            showToast("Transaction saved successfully!", "success");
            fetchPetty();
        } catch (err) {
            console.error("Error saving petty cash transaction", err);
            showToast("Error saving transaction!", "danger");
        }
    };



const handleEdit = (item) => {
  setForm({
    ID: item.ID,
    expense: item.expense,
    Type: item.Type,
    expDate: item.expDate.split("T")[0], // Format the date for the input field
    Amount: item.Amount,
  });
  setEditing(true);
  setEditId(item._id); // Set the editing ID to the selected item's ID
};

const handleDelete = async (id) => {
  if (window.confirm("Are you sure you want to delete this transaction?")) {
      try {
          await axios.delete(`http://localhost:8070/pettycash/delete/${id}`);
          showToast("Transaction deleted successfully!", "warning");
          fetchPetty(); // Refresh the list after deletion
      } catch (err) {
          console.error("Error deleting transaction", err);
          showToast("Error deleting transaction!", "danger");
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


const filteredPetty = expenses.filter(item =>
  item.expense.toLowerCase().includes(searchTerm.toLowerCase()) ||
  item.ID.toLowerCase().includes(searchTerm.toLowerCase())
);

  return (
    <div className="container mt-4">
      <h1 className="text-center mb-4">Petty Cash Management</h1>

      <div className="mb-3">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Search by ID or Transaction Name"
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
            required
            className={`form-control ${formErrors.ID ? "is-invalid" : ""}`}
          />
          {formErrors.ID && <div className="invalid-feedback">{formErrors.ID}</div>}
        </div>

        <div className="col-md-4">
          
          <input
            type="text"
            name="expense"
            placeholder="Expense"
            value={form.expense}
            onChange={handleChange}
            required
            className={`form-control ${formErrors.expense ? "is-invalid" : ""}`}
          />
          {formErrors.expense && <div className="invalid-feedback">{formErrors.expense}</div>}
        </div>

        <div className="col-md-4">
          <select
            name="Type"
            value={form.Type}
            onChange={handleChange}
            className="form-select"
          >
            <option value="Debit">Debit</option>
            <option value="Credit">Credit</option>
          </select>
        </div>

        <div className="col-md-4">
    
          <input
            type="date"
            name="expDate"
            value={form.expDate}
            onChange={handleChange}
            required
            className={`form-control ${formErrors.expDate ? "is-invalid" : ""}`}
          />
          {formErrors.expDate && <div className="invalid-feedback">{formErrors.expDate}</div>}
        </div>

        <div className="col-md-4">
    
          <input
            type="number"
            name="Amount"
            placeholder="Amount"
            value={form.Amount}
            onChange={handleChange}
            required
            className={`form-control ${formErrors.Amount ? "is-invalid" : ""}`}
          />
          {formErrors.Amount && <div className="invalid-feedback">{formErrors.Amount}</div>}
        </div>

        <div className="col-md-4">
        <button type="submit" className="btn btn-primary w-100">{editing ? "Update" : "Add"}</button>
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
  
  
  {filteredPetty.map((item) => (
      <tr key={item._id}>
        <td>{item.ID}</td>
        <td>{item.expense}</td>
        <td>{item.Type}</td>
        <td>{item.expDate.split("T")[0]}</td>
        <td>Rs.{item.Amount}</td>
        <td>
          <button onClick={() => handleEdit(item)} className="btn btn-warning btn-sm me-2">Edit</button>
          <button onClick={() => handleDelete(item._id)} className="btn btn-danger btn-sm">Delete</button>
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
 */





/* import { useState, useEffect, useRef } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";

export default function PettyCash() {
  const [expenses, setExpenses] = useState([]);
  const [form, setForm] = useState({ ID: "", expense: "", Type: "Debit", expDate: "", Amount: "" });
  const [editing, setEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchPetty();
  }, []);
 
  const fetchPetty = async () => {
    try {
      const res = await axios.get("http://localhost:8070/pettycash/");
      setExpenses(res.data);
    } catch (err) {
      console.error("Error fetching petty cash transactions", err);
    }
  };
  
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setFormErrors({ ...formErrors, [e.target.name]: "" }); // Clear error for the field being edited
  };

  const validateForm = () => {
    const errors = {};

    // Validation for ID: must start with "Pet" followed by numeric characters
    const idRegex = /^Pet\d+$/;
    if (!form.ID) {
        errors.ID = "ID is required.";
    } else if (!idRegex.test(form.ID)) {
        errors.ID = "ID must start with 'Pet' followed by numeric characters (e.g., Pet123).";
    }

    if (!form.expense) {
        errors.expense = "Expense is required.";
    }

    // Validation for Date: must not be a future date
    if (!form.expDate) {
        errors.expDate = "Date is required.";
    } else {
        const today = new Date();
        const enteredDate = new Date(form.expDate);
        if (enteredDate > today) {
            errors.expDate = "Date cannot be in the future.";
        }
    }

    if (isNaN(form.Amount) || form.Amount <= 0) {
        errors.Amount = "Amount must be a positive number.";
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
          await axios.put(`http://localhost:8070/pettycash/update/${editId}`, form);
      } else {
          await axios.post("http://localhost:8070/pettycash/add", form);
      }
      setForm({ ID: "", expense: "", Type: "Debit", expDate: "", Amount: "" });
      setEditing(false);
      showToast("Transaction saved successfully!", "success");
      fetchPetty();
    } catch (err) {
      console.error("Error saving petty cash transaction", err);
      showToast("Error saving transaction!", "danger");
    }
  };

  const handleEdit = (item) => {
    setForm({
      ID: item.ID,
      expense: item.expense,
      Type: item.Type,
      expDate: item.expDate.split("T")[0], // Format the date for the input field
      Amount: item.Amount,
    });
    setEditing(true);
    setEditId(item._id); // Set the editing ID to the selected item's ID
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this transaction?")) {
        try {
            await axios.delete(`http://localhost:8070/pettycash/delete/${id}`);
            showToast("Transaction deleted successfully!", "warning");
            fetchPetty(); // Refresh the list after deletion
        } catch (err) {
            console.error("Error deleting transaction", err);
            showToast("Error deleting transaction!", "danger");
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

  const filteredPetty = expenses.filter(item =>
    item.expense.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.ID.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleExpenseKeyDown = (e) => {
    const allowedChars = /^[a-zA-Z\s.,'-]$/; // Letters, spaces, dots, commas, hyphens, apostrophes
    if (e.key.length === 1 && !allowedChars.test(e.key)) {
      e.preventDefault();
    }
  };

  return (
    <div className="container mt-4">
      <h1 className="text-center mb-4">Petty Cash Management</h1>

      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search by ID or Transaction Name"
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
              required
              className={`form-control ${formErrors.ID ? "is-invalid" : ""}`}
            />
            {formErrors.ID && <div className="invalid-feedback">{formErrors.ID}</div>}
          </div>

          <div className="col-md-4">
            <input
              type="text"
              name="expense"
              placeholder="Expense"
              value={form.expense}
              onChange={handleChange}
              onKeyDown={handleExpenseKeyDown} // <-- Added onKeyDown validation
              required
              className={`form-control ${formErrors.expense ? "is-invalid" : ""}`}
            />
            {formErrors.expense && <div className="invalid-feedback">{formErrors.expense}</div>}
          </div>

          <div className="col-md-4">
            <select
              name="Type"
              value={form.Type}
              onChange={handleChange}
              className="form-select"
            >
              <option value="Debit">Debit</option>
              <option value="Credit">Credit</option>
            </select>
          </div>

          <div className="col-md-4">
            <input
              type="date"
              name="expDate"
              value={form.expDate}
              onChange={handleChange}
              required
              className={`form-control ${formErrors.expDate ? "is-invalid" : ""}`}
            />
            {formErrors.expDate && <div className="invalid-feedback">{formErrors.expDate}</div>}
          </div>

          <div className="col-md-4">
            <input
              type="number"
              name="Amount"
              placeholder="Amount"
              value={form.Amount}
              onChange={handleChange}
              required
              className={`form-control ${formErrors.Amount ? "is-invalid" : ""}`}
            />
            {formErrors.Amount && <div className="invalid-feedback">{formErrors.Amount}</div>}
          </div>

          <div className="col-md-4">
            <button type="submit" className="btn btn-primary w-100">
              {editing ? "Update" : "Add"}
            </button>
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
          {filteredPetty.map((item) => (
            <tr key={item._id}>
              <td>{item.ID}</td>
              <td>{item.expense}</td>
              <td>{item.Type}</td>
              <td>{item.expDate.split("T")[0]}</td>
              <td>Rs.{item.Amount}</td>
              <td>
                <button onClick={() => handleEdit(item)} className="btn btn-warning btn-sm me-2">
                  Edit
                </button>
                <button onClick={() => handleDelete(item._id)} className="btn btn-danger btn-sm">
                  Delete
                </button>
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
} */









  import { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";

export default function PettyCash() {
  const [expenses, setExpenses] = useState([]);
  const [form, setForm] = useState({ ID: "", expense: "", Type: "Debit", expDate: "", Amount: "" });
  const [editing, setEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchPetty();
  }, []);

  const fetchPetty = async () => {
    try {
      const res = await axios.get("http://localhost:8070/pettycash/");
      setExpenses(res.data);
    } catch (err) {
      console.error("Error fetching petty cash transactions", err);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setFormErrors({ ...formErrors, [e.target.name]: "" }); // Clear error for the field being edited
  };

  const validateForm = () => {
    const errors = {};

    // Validation for ID: must start with "Pet" followed by numeric characters
    const idRegex = /^Pet\d+$/;
    if (!form.ID) {
      errors.ID = "ID is required.";
    } else if (!idRegex.test(form.ID)) {
      errors.ID = "ID must start with 'Pet' followed by numeric characters (e.g., Pet123).";
    }

    if (!form.expense) {
      errors.expense = "Expense is required.";
    }

    if (!form.expDate) {
      errors.expDate = "Date is required.";
    } else {
      const today = new Date();
      const enteredDate = new Date(form.expDate);
      if (enteredDate > today) {
        errors.expDate = "Date cannot be in the future.";
      }
    }

    if (isNaN(form.Amount) || form.Amount <= 0) {
      errors.Amount = "Amount must be a positive number.";
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
        await axios.put(`http://localhost:8070/pettycash/update/${editId}`, form);
      } else {
        await axios.post("http://localhost:8070/pettycash/add", form);
      }
      setForm({ ID: "", expense: "", Type: "Debit", expDate: "", Amount: "" });
      setEditing(false);
      showToast("Transaction saved successfully!", "success");
      fetchPetty();
    } catch (err) {
      console.error("Error saving petty cash transaction", err);
      showToast("Error saving transaction!", "danger");
    }
  };

  const handleEdit = (item) => {
    setForm({
      ID: item.ID,
      expense: item.expense,
      Type: item.Type,
      expDate: item.expDate.split("T")[0], // Format the date for the input field
      Amount: item.Amount,
    });
    setEditing(true);
    setEditId(item._id);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this transaction?")) {
      try {
        await axios.delete(`http://localhost:8070/pettycash/delete/${id}`);
        showToast("Transaction deleted successfully!", "warning");
        fetchPetty();
      } catch (err) {
        console.error("Error deleting transaction", err);
        showToast("Error deleting transaction!", "danger");
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

  const filteredPetty = expenses.filter(item =>
    item.expense.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.ID.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleExpenseKeyDown = (e) => {
    const allowedChars = /^[a-zA-Z\s.,'-]$/;
    if (e.key.length === 1 && !allowedChars.test(e.key)) {
      e.preventDefault();
    }
  };

  const handleIdKeyDown = (e) => {
    const currentValue = e.target.value;
    const key = e.key;
    // Allow Backspace, Delete, Arrow keys
    if (key === "Backspace" || key === "Delete" || key.startsWith("Arrow")) {
      return;
    }
    // Force 'Pet' at the start
    if (currentValue.length < 3) {
      const petPrefix = "Pet";
      if (key !== petPrefix[currentValue.length]) {
        e.preventDefault();
      }
    } else {
      // After "Pet", allow only numbers
      if (!/[0-9]/.test(key)) {
        e.preventDefault();
      }
    }
  };

  return (
    <div className="container mt-4">
      <h1 className="text-center mb-4">Petty Cash Management</h1>

      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search by ID or Transaction Name"
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
              onKeyDown={handleIdKeyDown} // <-- Added onKeyDown validation for ID
              required
              className={`form-control ${formErrors.ID ? "is-invalid" : ""}`}
            />
            {formErrors.ID && <div className="invalid-feedback">{formErrors.ID}</div>}
          </div>

          <div className="col-md-4">
            <input
              type="text"
              name="expense"
              placeholder="Expense"
              value={form.expense}
              onChange={handleChange}
              onKeyDown={handleExpenseKeyDown}
              required
              className={`form-control ${formErrors.expense ? "is-invalid" : ""}`}
            />
            {formErrors.expense && <div className="invalid-feedback">{formErrors.expense}</div>}
          </div>

          <div className="col-md-4">
            <select
              name="Type"
              value={form.Type}
              onChange={handleChange}
              className="form-select"
            >
              <option value="Debit">Debit</option>
              <option value="Credit">Credit</option>
            </select>
          </div>

          <div className="col-md-4">
            <input
              type="date"
              name="expDate"
              value={form.expDate}
              onChange={handleChange}
              required
              className={`form-control ${formErrors.expDate ? "is-invalid" : ""}`}
            />
            {formErrors.expDate && <div className="invalid-feedback">{formErrors.expDate}</div>}
          </div>

          <div className="col-md-4">
            <input
              type="number"
              name="Amount"
              placeholder="Amount"
              value={form.Amount}
              onChange={handleChange}
              required
              className={`form-control ${formErrors.Amount ? "is-invalid" : ""}`}
            />
            {formErrors.Amount && <div className="invalid-feedback">{formErrors.Amount}</div>}
          </div>

          <div className="col-md-4">
            <button type="submit" className="btn btn-primary w-100">
              {editing ? "Update" : "Add"}
            </button>
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
          {filteredPetty.map((item) => (
            <tr key={item._id}>
              <td>{item.ID}</td>
              <td>{item.expense}</td>
              <td>{item.Type}</td>
              <td>{item.expDate.split("T")[0]}</td>
              <td>Rs.{item.Amount}</td>
              <td>
                <button onClick={() => handleEdit(item)} className="btn btn-warning btn-sm me-2">
                  Edit
                </button>
                <button onClick={() => handleDelete(item._id)} className="btn btn-danger btn-sm">
                  Delete
                </button>
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

