import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

const AdminProductManagement = () => {
  const { adminToken, getAuthHeaders } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name-asc');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [refreshFlag, setRefreshFlag] = useState(false);

  useEffect(() => {
    // Moved the logic of loadProducts directly into useEffect
    const loadProducts = async () => {
      if (!adminToken) return;

      try {
        setLoading(true);
        const params = new URLSearchParams({
          page: 1,
          limit: 20,
          search: searchTerm,
          sortBy: sortBy.split('-')[0],
          order: sortBy.split('-')[1]
        });

        // getAuthHeaders is now correctly passed to the headers
        const response = await fetch(`/api/products?${params.toString()}`, {
          headers: getAuthHeaders(adminToken)
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
    };

    loadProducts();
  }, [adminToken, searchTerm, sortBy, refreshFlag, getAuthHeaders]); // Corrected: getAuthHeaders is added to the dependency array

  const handleSearch = () => {
    // When a user clicks the search button, the searchTerm state will update,
    // which will trigger the useEffect hook to re-run.
  };

  const handleSort = () => {
    // When a user changes the sort option, the sortBy state will update,
    // which will trigger the useEffect hook to re-run.
  };

  const handleAddProduct = async (productData) => {
    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          ...getAuthHeaders(adminToken),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(productData)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to add product');
      }
      
      alert('Product added successfully');
      setShowAddModal(false);
      setRefreshFlag(prev => !prev); // Trigger refresh
    } catch (error) {
      alert(error.message);
    }
  };

  const handleEditProduct = async (productId, productData) => {
    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: 'PUT',
        headers: {
          ...getAuthHeaders(adminToken),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(productData)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to update product');
      }
      
      alert('Product updated successfully');
      setEditingProduct(null);
      setRefreshFlag(prev => !prev); // Trigger refresh
    } catch (error) {
      alert(error.message);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(adminToken)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to delete product');
      }
      
      alert('Product deleted successfully');
      // After deleting, we update the state to remove the product without re-fetching everything.
      setProducts(products.filter(product => product._id !== productId));
    } catch (error) {
      alert(error.message);
    }
  };

  if (loading) {
    return <div>Loading products...</div>;
  }

  if (error) {
    return <div style={{ color: 'var(--secondary)' }}>Error: {error}</div>;
  }

  return (
    <div>
      {/* Search and Controls */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
        <select value={sortBy} onChange={(e) => { setSortBy(e.target.value); handleSort(); }}>
          <option value="name-asc">Sort by Name ↑</option>
          <option value="name-desc">Sort by Name ↓</option>
          <option value="price-asc">Sort by Price ↑</option>
          <option value="price-desc">Sort by Price ↓</option>
          <option value="stock-asc">Sort by Stock ↑</option>
          <option value="stock-desc">Sort by Stock ↓</option>
        </select>
        <button onClick={handleSearch}>Search</button>
        <button onClick={() => setShowAddModal(true)}>+ Add New Product</button>
      </div>

      {/* Products Table */}
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map(product => (
            <tr key={product._id}>
              <td>{product.name}</td>
              <td>${(typeof product.price === 'number' ? product.price.toFixed(2) : '0.00')}</td>
              <td>{product.stock ?? 0}</td>
              <td className="actions">
                <button onClick={() => setEditingProduct(product)}>Edit</button>
                <button onClick={() => handleDeleteProduct(product._id)}>Delete</button>
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

      {/* Add Product Modal */}
      {showAddModal && (
        <ProductModal
          onClose={() => setShowAddModal(false)}
          onSubmit={handleAddProduct}
          title="Add New Product"
        />
      )}

      {/* Edit Product Modal */}
      {editingProduct && (
        <ProductModal
          onClose={() => setEditingProduct(null)}
          onSubmit={(data) => handleEditProduct(editingProduct._id, data)}
          title="Edit Product"
          product={editingProduct}
        />
      )}
    </div>
  );
};

// Product Modal Component
const ProductModal = ({ onClose, onSubmit, title, product = null }) => {
  const [formData, setFormData] = useState({
    name: product?.name || '',
    description: product?.description || '',
    price: product?.price || '',
    stock: product?.stock || ''
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock)
    });
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.85)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        padding: '1.5rem',
        width: '400px',
        maxWidth: '90%',
        boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
        position: 'relative'
      }}>
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            background: 'transparent',
            border: 'none',
            fontSize: '1.5rem',
            cursor: 'pointer',
            color: '#333'
          }}
          aria-label="Close modal"
        >
          ×
        </button>
        <h3>{title}</h3>
        <form onSubmit={handleSubmit}>
          <label htmlFor="productName">Name</label>
          <input
            type="text"
            id="productName"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
          <label htmlFor="productDescription">Description</label>
          <textarea
            id="productDescription"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows="3"
          />
          <label htmlFor="productPrice">Price</label>
          <input
            type="number"
            id="productPrice"
            name="price"
            min="0.01"
            step="0.01"
            value={formData.price}
            onChange={handleInputChange}
            required
          />
          <label htmlFor="productStock">Stock Quantity</label>
          <input
            type="number"
            id="productStock"
            name="stock"
            min="0"
            step="1"
            value={formData.stock}
            onChange={handleInputChange}
            required
          />
          <button type="submit">
            {product ? 'Save Changes' : 'Add Product'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminProductManagement;