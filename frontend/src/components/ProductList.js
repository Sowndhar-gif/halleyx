import React, { useState, useEffect, useCallback } from 'react'; // Import useCallback
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';

const ProductList = () => {
  const { customerToken, getAuthHeaders } = useAuth();
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name-asc');

  // Memoize loadProducts using useCallback
  const loadProducts = useCallback(async () => {
    if (!customerToken) {
      setProducts([]); // Clear products if no token
      setLoading(false); // Stop loading if no token
      return;
    }

    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: 1,
        limit: 20,
        search: searchTerm,
        sortBy: sortBy.split('-')[0],
        order: sortBy.split('-')[1]
      });

      const response = await fetch(`/api/products?${params.toString()}`, {
        headers: getAuthHeaders(customerToken)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to load products');
      }
      
      setProducts(data.products || []);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, [customerToken, searchTerm, sortBy, getAuthHeaders]); // Dependencies for useCallback

  useEffect(() => {
    loadProducts();
  }, [loadProducts]); // Now loadProducts is a stable dependency

  const handleSearch = () => {
    // This will simply trigger a re-render with the new searchTerm,
    // and the useEffect will then call loadProducts due to the change in searchTerm (via loadProducts's memoization).
    // No explicit call to loadProducts needed here.
  };

  const handleSort = () => {
    // Similar to handleSearch, updating sortBy will cause useEffect to re-run loadProducts.
    // No explicit call to loadProducts needed here.
  };

  const handleAddToCart = (productId) => {
    addToCart(productId);
    alert('Added to cart!');
  };

  if (loading) {
    return <div>Loading products...</div>;
  }

  if (error) {
    return <div style={{ color: 'var(--secondary)' }}>Error: {error}</div>;
  }

  return (
    <div>
      {/* Search and Sort Controls */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
        />
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} onBlur={handleSort}>
          <option value="name-asc">Sort by Name ↑</option>
          <option value="name-desc">Sort by Name ↓</option>
          <option value="price-asc">Sort by Price ↑</option>
          <option value="price-desc">Sort by Price ↓</option>
          <option value="stock-asc">Sort by Stock ↑</option>
          <option value="stock-desc">Sort by Stock ↓</option>
        </select>
        <button onClick={handleSearch}>Search</button>
      </div>

      {/* Products Table */}
      <table>
        <thead>
          <tr>
            <th>Image</th>
            <th>Name</th>
            <th>Description</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map(product => (
            <tr key={product._id}>
              <td>
                {product.imageUrl ? (
                  <img src={product.imageUrl} alt={product.name} style={{ width: '50px', height: '50px', objectFit: 'cover' }} />
                ) : (
                  <span>No Image</span>
                )}
              </td>
              <td>{product.name}</td>
              <td>{product.description || ''}</td>
              <td>${product.price?.toFixed(2) || '0.00'}</td>
              <td>{product.stock || 0}</td>
              <td className="actions">
                {product.stock > 0 ? (
                  <button onClick={() => handleAddToCart(product._id)}>
                    Add to Cart
                  </button>
                ) : (
                  <span style={{ color: 'var(--secondary)' }}>Out of Stock</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {products.length === 0 && (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          No products found.
        </div>
      )}
    </div>
  );
};

export default ProductList;