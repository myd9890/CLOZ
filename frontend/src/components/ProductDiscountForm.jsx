import React, { useState } from 'react';
import axios from 'axios';

const ProductDiscountForm = ({ product, onSuccess }) => {
  const [formData, setFormData] = useState({
    discountPercentage: '',
    discountPrice: '',
    startDate: '',
    endDate: ''
  });

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    try {
      await axios.put(
        `http://localhost:8070/api/discounts/apply/${product.productId}`,
        formData
      );
      setMessage('Discount applied successfully!');
      onSuccess(); // ✅ This will close the modal and refresh product list
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to apply discount');
    }
  };

  return (
    <div className="discount-form">
      <h3>Apply Discount</h3>
      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Discount Percentage</label>
          <input
            type="number"
            name="discountPercentage"
            min="0"
            max="100"
            value={formData.discountPercentage}
            onChange={handleChange}
            placeholder="e.g., 20 for 20% off"
          />
        </div>

        <div className="form-group">
          <label>OR Fixed Discount Price</label>
          <input
            type="number"
            name="discountPrice"
            min="0"
            step="0.01"
            value={formData.discountPrice}
            onChange={handleChange}
            placeholder="e.g., 49.99"
          />
        </div>

        <div className="form-group">
          <label>Start Date (optional)</label>
          <input
            type="date"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>End Date (optional)</label>
          <input
            type="date"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
          />
        </div>

        <button type="submit" className="btn btn-primary">
          Apply Discount
        </button>
      </form>
    </div>
  );
};

export default ProductDiscountForm;
