import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const ReturnForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [sale, setSale] = useState(null);
  const [loading, setLoading] = useState(true);
  const [returnItems, setReturnItems] = useState([]);

  useEffect(() => {
    const fetchSale = async () => {
      try {
        console.log(id);
        const response = await axios.get(`http://localhost:8070/sale/return/${id}`);
        console.log(response.data);
        
        setSale(response.data);
        
        // Initialize return items
        setReturnItems(response.data.products.map(product => ({
          productId: product.product._id,
          name: product.product.name,
          maxQuantity: product.quantity,
          quantity: 0,
          reason: ''
        })));
      } catch (error) {
        toast.error('Failed to load sale details');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchSale();
  }, [id]);

  const handleQuantityChange = (index, value) => {
    const newItems = [...returnItems];
    const numericValue = Math.min(Math.max(0, parseInt(value) || 0), newItems[index].maxQuantity);
    newItems[index].quantity = numericValue;
    setReturnItems(newItems);
  };

  const handleReasonChange = (index, value) => {
    const newItems = [...returnItems];
    newItems[index].reason = value;
    setReturnItems(newItems);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const itemsToReturn = returnItems.filter(item => item.quantity > 0);
      console.log("items to return",itemsToReturn);
      if (itemsToReturn.length === 0) {
        toast.warning('Please select at least one item to return');
        return;
      }
      
      await axios.post(`http://localhost:8070/sale/return/${id}`, {
        returnedItems: itemsToReturn
      });
      
      toast.success('Return processed successfully');
      navigate('/salesDashboard/sales');
    } catch (error) {
      toast.error('Failed to process return');
      console.error(error);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!sale) return <div>Sale not found</div>;

  return (
    <div className="container mt-4">
      <h2>Process Return for Sale </h2>
      <p>Date: {new Date(sale.date).toLocaleDateString()}</p>
      <p>Customer: {sale.customer?.name || 'Walk-in Customer'}</p>
      <form onSubmit={handleSubmit}>
        <table className="table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Sold Qty</th>
              <th>Return Qty</th>
              <th>Reason</th>
            </tr>
          </thead>
          <tbody>
            {returnItems.map((item, index) => (
              <tr key={item.productId}>
                <td>{item.name}</td>
                <td>{item.maxQuantity}</td>
                <td>
                  <input
                    type="number"
                    min="0"
                    max={item.maxQuantity}
                    value={item.quantity}
                    onChange={(e) => handleQuantityChange(index, e.target.value)}
                    className="form-control"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={item.reason}
                    onChange={(e) => handleReasonChange(index, e.target.value)}
                    className="form-control"
                    placeholder="Reason for return"
                    disabled={item.quantity === 0}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        <div className="mt-3">
          <button type="submit" className="btn btn-primary">
            Process Return
          </button>
          <button
            type="button"
            className="btn btn-secondary ms-2"
            onClick={() => navigate('/salesDashboard/sales')}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReturnForm;