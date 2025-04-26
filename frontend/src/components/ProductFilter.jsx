import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "../css/ProductFilter.css"; // Import the CSS file

const ProductFilter = () => {
  // State for filter inputs
  const [filters, setFilters] = useState({
    name: "",
    category: "",
    brand: "",
    minPrice: "",
    maxPrice: "",
    size: "",
  });

  // State for filtered products
  const [products, setProducts] = useState([]);
  console.log("filter",products);

  // State to track if filters have been applied
  const [filtersApplied, setFiltersApplied] = useState(false);

  // State to track loading state
  const [isLoading, setIsLoading] = useState(false);

  // Function to handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  // Function to reset all filters
  const resetFilters = () => {
    setFilters({
      name: "",
      category: "",
      brand: "",
      minPrice: "",
      maxPrice: "",
      size: "",
    });
    setProducts([]);
    setFiltersApplied(false);
  };

  // Function to fetch filtered products
  const fetchProducts = async () => {
    try {
      setIsLoading(true);

      // Price validation
      if (filters.minPrice && filters.maxPrice && parseFloat(filters.minPrice) > parseFloat(filters.maxPrice)) {
        toast.error("Minimum price cannot be greater than maximum price.");
        setIsLoading(false);
        return;
      }

      // Convert empty strings to undefined to avoid sending empty query params
      const params = {};
      for (const key in filters) {
        if (filters[key]) {
          params[key] = filters[key];
        }
      }

      // Check if any filters are applied
      if (Object.keys(params).length === 0) {
        toast.info("Please apply at least one filter.");
        setProducts([]);
        setFiltersApplied(false);
        setIsLoading(false);
        return;
      }

      // Mark filters as applied
      setFiltersApplied(true);

      // Make API call
      const response = await axios.get("http://localhost:8070/products/", {
        params,
      });
      console.log("response",response.data);

      setProducts(response.data);
    } catch (error) {
      console.error("Failed to fetch products:", error);
      toast.error("Failed to fetch products. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="product-filter-container">
      <p className="text-start ms-2 mt-4 fw-bold">Product Filter</p>


      {/* Filter Form */}
      <div className="filter-form">
        <div className="filter-row">
          <input
            type="text"
            name="name"
            placeholder="Product Name"
            value={filters.name}
            onChange={handleInputChange}
            className="filter-input"
          />
          <input
            type="text"
            name="category"
            placeholder="Category"
            value={filters.category}
            onChange={handleInputChange}
            className="filter-input"
          />
          <input
            type="text"
            name="brand"
            placeholder="Brand"
            value={filters.brand}
            onChange={handleInputChange}
            className="filter-input"
          />
          <input
            type="number"
            name="minPrice"
            placeholder="Min Price"
            value={filters.minPrice}
            onChange={handleInputChange}
            className="filter-input"
            min="0"
          />
          <input
            type="number"
            name="maxPrice"
            placeholder="Max Price"
            value={filters.maxPrice}
            onChange={handleInputChange}
            className="filter-input"
            min="0"
          />
          <select
            name="size"
            value={filters.size}
            onChange={handleInputChange}
            className="filter-select"
          >
            <option value="">Select Size</option>
            <option value="XS">XS</option>
            <option value="S">S</option>
            <option value="M">M</option>
            <option value="L">L</option>
            <option value="XL">XL</option>
            <option value="XXL">XXL</option>
            <option value="XXXL">XXXL</option>
          </select>
        </div>
        <div className="filter-actions">
          <button 
            onClick={fetchProducts} 
            className="filter-button apply-button"
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : "Apply Filters"}
          </button>
          <button 
            onClick={resetFilters} 
            className="filter-button reset-button"
          >
            Reset Filters
          </button>
        </div>
      </div>

      {/* Display Filtered Products */}
      {filtersApplied && (
        <div className="filtered-products">
          <h3>Filtered Products ({products.length})</h3>
          {products.length > 0 ? (
            <div className="product-grid">
              {products.map((product) => (
                <div key={product.productId} className="product-card">
                  <h5>{product.name}</h5>
                  <p><strong>Category:</strong> {product.category}</p>
                  <p><strong>Brand:</strong> {product.supplier?.brand}</p>
                  <p><strong>Price:</strong> Rs.{product.price}</p>
                  <p><strong>Size:</strong> {product.size}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-products">No products found matching your criteria.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductFilter;