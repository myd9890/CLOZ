import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

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

  // State to track if filters have been applied
  const [filtersApplied, setFiltersApplied] = useState(false);

  // Function to handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  // Function to fetch filtered products
  const fetchProducts = async () => {
    try {
      // Price validation
      if (filters.minPrice && filters.maxPrice && parseFloat(filters.minPrice) > parseFloat(filters.maxPrice)) {
        toast.error("Minimum price cannot be greater than maximum price.");
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
        setProducts([]); // Clear the products list
        setFiltersApplied(false); // Reset filtersApplied
        return;
      }

      // Mark filters as applied
      setFiltersApplied(true);

      // Make API call only if filters are applied
      const response = await axios.get("http://localhost:8070/products/", {
        params,
      });

      setProducts(response.data);
    } catch (error) {
      console.error("Failed to fetch products:", error);
      toast.error("Failed to fetch products. Please try again.");
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Product Filter</h1>

      {/* Filter Form */}
      <div className="card mb-4">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-2">
              <input
                type="text"
                name="name"
                placeholder="Product Name"
                value={filters.name}
                onChange={handleInputChange}
                className="form-control"
              />
            </div>
            <div className="col-md-2">
              <input
                type="text"
                name="category"
                placeholder="Category"
                value={filters.category}
                onChange={handleInputChange}
                className="form-control"
              />
            </div>
            <div className="col-md-2">
              <input
                type="text"
                name="brand"
                placeholder="Brand"
                value={filters.brand}
                onChange={handleInputChange}
                className="form-control"
              />
            </div>
            <div className="col-md-2">
              <input
                type="number"
                name="minPrice"
                placeholder="Min Price"
                value={filters.minPrice}
                onChange={handleInputChange}
                className="form-control"
                min="0"
              />
            </div>
            <div className="col-md-2">
              <input
                type="number"
                name="maxPrice"
                placeholder="Max Price"
                value={filters.maxPrice}
                onChange={handleInputChange}
                className="form-control"
                min="0"
              />
            </div>
            <div className="col-md-2">
            <select
            name="size"
            value={filters.size}
            onChange={handleInputChange}
            className="form-control"
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
            <div className="col-md-12">
              <button
                onClick={fetchProducts}
                className="btn btn-primary w-100"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      </div>


      {/* Display Filtered Products */}
      
          {filtersApplied ? (
            <div className="card">
            <div className="card-body">
              <h2 className="mb-4">Filtered Products</h2>
              {products.length > 0 ? (
                <div className="row row-cols-1 row-cols-md-3 g-4">
                  {products.map((product) => (
                    <div key={product.productId} className="col">
                      <div className="card h-100">
                        <div className="card-body">
                          <h5 className="card-title">{product.name}</h5>
                          <p className="card-text">
                            <strong>Category:</strong> {product.category}
                          </p>
                          <p className="card-text">
                            <strong>Brand:</strong> {product.brand}
                          </p>
                          <p className="card-text">
                            <strong>Price:</strong> Rs.{product.price}
                          </p>
                          <p className="card-text">
                            <strong>Size:</strong> {product.size}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted">No products found.</p>
              )}
            </div>
            </div>
          ) : (
            <p></p>
          )} 
      
    </div>
  );
};

export default ProductFilter;