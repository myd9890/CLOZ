import { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "http://localhost:8070/api/customers";

function CustomerList() {
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editData, setEditData] = useState(null);
  const [errors, setErrors] = useState({ name: "", email: "", phone: "" });

  const mobileCodes = ["070", "071", "072", "075", "077", "078"];

  useEffect(() => {
    fetchCustomers();
  }, []);

  useEffect(() => {
    if (searchTerm === "") {
      setFilteredCustomers(customers);
    } else {
      const filtered = customers.filter(customer => 
        customer.phone.includes(searchTerm)
      );
      setFilteredCustomers(filtered);
    }
  }, [searchTerm, customers]);

  const fetchCustomers = async () => {
    try {
      const response = await axios.get(`${API_URL}/read`);
      setCustomers(response.data);
      setFilteredCustomers(response.data);
    } catch (error) {
      console.error("Error fetching customers:", error);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this customer?"
    );
    if (confirmDelete) {
      try {
        await axios.delete(`${API_URL}/delete/${id}`);
        setCustomers(customers.filter((customer) => customer._id !== id));
      } catch (error) {
        console.error("Error deleting customer:", error);
      }
    }
  };

  const handleEdit = (customer) => {
    setEditData(customer);
    setErrors({ name: "", email: "", phone: "" });
  };

  const validateForm = () => {
    let isValid = true;
    let newErrors = { name: "", email: "", phone: "" };

    // Name validation
    const namePattern = /^[A-Za-z\s]{3,50}$/;
    if (!namePattern.test(editData.name)) {
      newErrors.name =
        "Name must contain only letters and spaces (3-50 characters).";
      isValid = false;
    }

    // Email validation
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(editData.email)) {
      newErrors.email = "Invalid email format.";
      isValid = false;
    }

    // Phone number validation (Mobile only - Sri Lanka)
    if (!/^\d{10}$/.test(editData.phone)) {
      newErrors.phone = "Phone number must be exactly 10 digits.";
      isValid = false;
    } else {
      const prefix = editData.phone.substring(0, 3); // Get first 3 digits

      if (!mobileCodes.includes(prefix)) {
        newErrors.phone = "Invalid mobile number prefix for Sri Lanka.";
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleUpdate = async () => {
    if (!validateForm()) {
      return; // Stop form submission if validation fails
    }

    try {
      await axios.put(`${API_URL}/update/${editData._id}`, editData);
      setEditData(null);
      fetchCustomers();
    } catch (error) {
      console.error("Error updating customer:", error);
    }
  };

  return (
    <div>
      <h1>Customer Management</h1>

      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search by phone number..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {editData ? (
        <div>
          <h2>Edit Customer</h2>
          <div>
            <input
              type="text"
              value={editData.name}
              onChange={(e) =>
                setEditData({ ...editData, name: e.target.value })
              }
              placeholder="Name"
            />
            {errors.name && <p style={{ color: "red" }}>{errors.name}</p>}
          </div>
          <div>
            <input
              type="email"
              value={editData.email}
              onChange={(e) =>
                setEditData({ ...editData, email: e.target.value })
              }
              placeholder="Email"
            />
            {errors.email && <p style={{ color: "red" }}>{errors.email}</p>}
          </div>
          <div>
            <input
              type="text"
              value={editData.phone}
              onChange={(e) =>
                setEditData({ ...editData, phone: e.target.value })
              }
              placeholder="Phone"
            />
            {errors.phone && <p style={{ color: "red" }}>{errors.phone}</p>}
          </div>
          <button onClick={handleUpdate}>Update</button>
          <button onClick={() => setEditData(null)}>Cancel</button>
        </div>
      ) : (
        <>
          <table
            border="1"
            cellPadding="5"
            style={{ width: "100%", textAlign: "left" }}
          >
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Registration Date</th>
                <th>Loyalty Points</th>
                {/* <th>Purchase History</th> */}
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.map((customer) => (
                <tr key={customer._id}>
                  <td>{customer.name}</td>
                  <td>{customer.email}</td>
                  <td>{customer.phone}</td>
                  <td>
                    {new Date(customer.registrationDate).toLocaleDateString()}
                  </td>
                  <td>{customer.loyaltyPoints}</td>
                  {/* <td>
                    {customer.purchaseHistory?.length > 0 ? (
                      customer.purchaseHistory.map((purchase, index) => (
                        <div key={index}>
                          <strong>Product:</strong> {purchase.productName}{" "}
                          <br />
                          <strong>Amount:</strong> Rs{purchase.amount} <br />
                          <strong>Purchase Date:</strong>{" "}
                          {new Date(purchase.purchaseDate).toLocaleDateString()}
                        </div>
                      ))
                    ) : (
                      <span>No purchases</span>
                    )}
                  </td> */}
                  <td>
                    <button onClick={() => handleEdit(customer)}>Edit</button>

                    <button onClick={() => handleDelete(customer._id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}

export default CustomerList;
