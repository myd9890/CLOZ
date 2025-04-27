import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductDiscountForm from './ProductDiscountForm';
import '../css/ProductListWithDiscounts.css'; 

const ProductListWithDiscounts = () => {
  // State for products and UI control
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showDiscountForm, setShowDiscountForm] = useState(false);

  // Fetch products on component mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:8070/products/');
        setProducts(response.data);
      } catch (err) {
        setError('Failed to load products');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Handle discount application success
  const handleDiscountSuccess = () => {
    setShowDiscountForm(false);
    setSelectedProduct(null);
    // Refresh product list to show updated discounts
    axios.get('http://localhost:8070/products/')
      .then(res => setProducts(res.data))
      .catch(err => console.error('Error refreshing products:', err));
  };

  // Format price display
  const formatPrice = (price, discountPrice) => {
    if (discountPrice && discountPrice > 0) {
      return (
        <>
          <span style={{ textDecoration: 'line-through' }}>LKR {price.toFixed(2)}</span>
          <span style={{ color: 'red', marginLeft: '8px' }}>
            LKR {price-discountPrice.toFixed(2)}
          </span>
        </>
      );
    }
    return `LKR ${price.toFixed(2)}`;
  };

  if (loading) return <div>Loading products...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="product-management-container">
      <h1>Product Discount Management</h1>
      
      {/* Product List Table */}
      <table className="product-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Category</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.productId}>
              <td>{product.productId}</td>
              <td>{product.name}</td>
              <td>{product.category}</td>
              <td>
                {formatPrice(product.price, product.discountPrice)}
                {product.discountPrice > 0 && (
                  <span className="discount-badge">SALE</span>
                )}
              </td>
              <td>{product.quantityInStock}</td>
              <td>
                <button
                  className="btn-discount"
                  onClick={() => {
                    setSelectedProduct(product);
                    setShowDiscountForm(true);
                  }}
                >
                  {product.discountPrice > 0 ? 'Edit Discount' : 'Add Discount'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Discount Form Modal */}
      {showDiscountForm && selectedProduct && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button 
              className="close-button"
              onClick={() => {
                setShowDiscountForm(false);
                setSelectedProduct(null);
              }}
            >
              ×
            </button>
            <ProductDiscountForm
              product={selectedProduct}
              onSuccess={handleDiscountSuccess}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductListWithDiscounts;