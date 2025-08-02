function switchTab(event) {
  document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
  event.target.classList.add('active');

  const tabName = event.target.getAttribute('data-tab');
  document.querySelectorAll('section').forEach(sec => sec.style.display = 'none');
  document.getElementById(tabName).style.display = 'block';
}

function showCustomerAuth(mode) {
  document.getElementById('customerLoginForm').style.display = mode === 'login' ? 'block' : 'none';
  document.getElementById('customerRegisterForm').style.display = mode === 'register' ? 'block' : 'none';
}

let customerToken = null;
let adminToken = null;
let currentCustomer = null;
let currentAdmin = null;
let impersonationToken = null;

function getAuthHeaders(token) {
  return {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + token
  };
}

async function loginCustomer(email, password) {
  try {
    const response = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    if (!response.ok) {
      alert(data.message || 'Login failed');
      return null;
    }
    customerToken = data.token;
    localStorage.setItem('customerToken', customerToken);
    return data;
  } catch (error) {
    alert('Error connecting to server');
    return null;
  }
}

async function registerCustomer(firstName, lastName, email, password) {
  try {
    const response = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ firstName, lastName, email, password }),
    });
    const data = await response.json();
    if (!response.ok) {
      alert(data.message || 'Registration failed');
      return null;
    }
    customerToken = data.token;
    localStorage.setItem('customerToken', customerToken);
    return data;
  } catch (error) {
    alert('Error connecting to server');
    return null;
  }
}

async function loginAdmin(email, password) {
  try {
    const response = await fetch('http://localhost:5000/api/auth/admin-login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    if (!response.ok) {
      alert(data.message || 'Admin login failed');
      return null;
    }
    adminToken = data.token;
    localStorage.setItem('adminToken', adminToken);
    return data;
  } catch (error) {
    alert('Error connecting to server');
    return null;
  }
}

document.getElementById('customerLoginForm').addEventListener('submit', async function(e) {
  e.preventDefault();
  const email = document.getElementById('custLoginEmail').value;
  const password = document.getElementById('custLoginPassword').value;
  const result = await loginCustomer(email, password);
  if (result) {
    currentCustomer = result.user;
    document.getElementById('custWelcomeName').textContent = currentCustomer.firstName || currentCustomer.email.split('@')[0];
    document.getElementById('customerAuthForms').style.display = 'none';
    document.getElementById('customerDashboard').style.display = 'block';
    loadCustomerProducts();
    loadCustomerOrders();
    loadCustomerProfile();
  }
});

document.getElementById('customerRegisterForm').addEventListener('submit', async function(e) {
  e.preventDefault();
  const firstName = document.getElementById('custRegFirstName').value;
  const lastName = document.getElementById('custRegLastName').value;
  const email = document.getElementById('custRegEmail').value;
  const password = document.getElementById('custRegPassword').value;
  const result = await registerCustomer(firstName, lastName, email, password);
  if (result) {
    currentCustomer = result.user;
    document.getElementById('custWelcomeName').textContent = currentCustomer.firstName;
    document.getElementById('customerAuthForms').style.display = 'none';
    document.getElementById('customerDashboard').style.display = 'block';
    loadCustomerProducts();
    loadCustomerOrders();
    loadCustomerProfile();
  }
});

let custProductPage = 1;
let custProductLimit = 20;
let custProductSearch = '';
let custProductSortBy = 'name';
let custProductOrder = 'asc';

async function loadCustomerProducts() {
  if (!customerToken) return;
  const params = new URLSearchParams({
    page: custProductPage,
    limit: custProductLimit,
    search: custProductSearch,
    sortBy: custProductSortBy,
    order: custProductOrder
  });
  try {
    const response = await fetch('http://localhost:5000/api/products?' + params.toString(), {
      headers: getAuthHeaders(customerToken)
    });
    const data = await response.json();
    if (!response.ok) {
      alert(data.message || 'Failed to load products');
      return;
    }
    renderCustomerProducts(data.products);
  } catch (error) {
    alert('Error loading products');
  }
}

function renderCustomerProducts(products) {
  const tbody = document.querySelector('#custProductsTable tbody');
  tbody.innerHTML = '';
  products.forEach(product => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${product.name}</td>
      <td>${product.description || ''}</td>
      <td>$${product.price.toFixed(2)}</td>
      <td>${product.stock}</td>
      <td>
        ${product.stock > 0 ? `<button onclick="addToCart('${product._id}')">Add to Cart</button>` : 'Out of Stock'}
      </td>
    `;
    tbody.appendChild(tr);
  });
}

let cart = {};

function addToCart(productId) {
  if (!cart[productId]) {
    cart[productId] = 1;
  } else {
    cart[productId]++;
  }
  alert('Added to cart');
  renderCart();
}

function renderCart() {
  const cartContainer = document.getElementById('cartContainer');
  if (!cartContainer) return;
  cartContainer.innerHTML = '';
  const productIds = Object.keys(cart);
  if (productIds.length === 0) {
    cartContainer.innerHTML = '<p>Your cart is empty.</p>';
    return;
  }
  const ul = document.createElement('ul');
  let total = 0;
  productIds.forEach(async (productId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/products/${productId}`, {
        headers: getAuthHeaders(customerToken)
      });
      const product = await response.json();
      const li = document.createElement('li');
      const qty = cart[productId];
      const subtotal = product.price * qty;
      total += subtotal;
      li.textContent = `${product.name} - Qty: ${qty} - $${subtotal.toFixed(2)}`;
      ul.appendChild(li);
    } catch (error) {
      console.error('Error loading product for cart:', error);
    }
  });
  cartContainer.appendChild(ul);
  const totalDiv = document.createElement('div');
  totalDiv.textContent = `Total: $${total.toFixed(2)}`;
  cartContainer.appendChild(totalDiv);

  const checkoutBtn = document.createElement('button');
  checkoutBtn.textContent = 'Checkout';
  checkoutBtn.onclick = showCheckoutForm;
  cartContainer.appendChild(checkoutBtn);
}

function showCheckoutForm() {
  const checkoutSection = document.getElementById('checkoutSection');
  if (checkoutSection) {
    checkoutSection.style.display = 'block';
  }
}

document.getElementById('checkoutForm').addEventListener('submit', async function(e) {
  e.preventDefault();
  if (!customerToken) return;
  const shippingAddress = document.getElementById('shippingAddress').value;
  const billingAddress = document.getElementById('billingAddress').value;
  try {
    for (const productId in cart) {
      const quantity = cart[productId];
      const response = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: getAuthHeaders(customerToken),
        body: JSON.stringify({ productId, quantity, shippingAddress, billingAddress })
      });
      const data = await response.json();
      if (!response.ok) {
        alert(data.message || 'Failed to place order');
        return;
      }
    }
    alert('Order placed successfully');
    cart = {};
    renderCart();
    loadCustomerOrders();
    document.getElementById('checkoutSection').style.display = 'none';
  } catch (error) {
    alert('Error placing order');
  }
});

async function loadCustomerOrders() {
  if (!customerToken) return;
  try {
    const response = await fetch('http://localhost:5000/api/orders/mine', {
      headers: getAuthHeaders(customerToken)
    });
    const data = await response.json();
    if (!response.ok) {
      alert(data.message || 'Failed to load orders');
      return;
    }
    renderCustomerOrders(data);
  } catch (error) {
    alert('Error loading orders');
  }
}

function renderCustomerOrders(orders) {
  const tbody = document.querySelector('#custOrdersTable tbody');
  tbody.innerHTML = '';
  orders.forEach(order => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${order._id}</td>
      <td>${order.productId ? order.productId.name : ''}</td>
      <td>${order.quantity}</td>
      <td>${order.status}</td>
      <td><button onclick="viewOrderDetails('${order._id}')">View</button></td>
    `;
    tbody.appendChild(tr);
  });
}

async function loadCustomerProfile() {
  if (!customerToken || !currentCustomer) return;
  document.getElementById('profileFirstName').value = currentCustomer.firstName || '';
  document.getElementById('profileLastName').value = currentCustomer.lastName || '';
  document.getElementById('profileEmail').value = currentCustomer.email || '';
}

document.getElementById('custProfileForm').addEventListener('submit', async function(e) {
  e.preventDefault();
  if (!customerToken || !currentCustomer) return;
  const firstName = document.getElementById('profileFirstName').value;
  const lastName = document.getElementById('profileLastName').value;
  try {
    const response = await fetch(`http://localhost:5000/api/customers/${currentCustomer._id}`, {
      method: 'PUT',
      headers: getAuthHeaders(customerToken),
      body: JSON.stringify({ firstName, lastName })
    });
    const data = await response.json();
    if (!response.ok) {
      alert(data.message || 'Failed to update profile');
      return;
    }
    alert('Profile updated successfully');
    currentCustomer.firstName = firstName;
    currentCustomer.lastName = lastName;
    loadCustomerProfile();
  } catch (error) {
    alert('Error updating profile');
  }
});

function logoutCustomer() {
  customerToken = null;
  currentCustomer = null;
  localStorage.removeItem('customerToken');
  document.getElementById('customerDashboard').style.display = 'none';
  document.getElementById('customerAuthForms').style.display = 'block';
}

let adminDashboardStats = null;
let adminProductPage = 1;
let adminProductLimit = 20;
let adminProductSearch = '';
let adminProductSortBy = 'name';
let adminProductOrder = 'asc';

let adminCustomerPage = 1;
let adminCustomerLimit = 20;
let adminCustomerSearch = '';
let adminCustomerStatusFilter = 'all';

let adminOrderPage = 1;
let adminOrderLimit = 20;
let adminOrderStatusFilter = '';
let adminOrderCustomerFilter = '';
let adminOrderProductFilter = '';

document.getElementById('adminLoginForm').addEventListener('submit', async function(e) {
  e.preventDefault();
  const email = document.getElementById('adminLoginEmail').value;
  const password = document.getElementById('adminLoginPassword').value;
  const result = await loginAdmin(email, password);
  if (result) {
    currentAdmin = result.user;
    document.getElementById('adminAuthForms').style.display = 'none';
    document.getElementById('adminDashboard').style.display = 'block';
    loadAdminDashboard();
    loadAdminProducts();
    loadAdminCustomers();
    loadAdminOrders();
  }
});

async function loadAdminDashboard() {
  if (!adminToken) return;
  try {
    const response = await fetch('http://localhost:5000/api/settings/admin-dashboard', {
      headers: getAuthHeaders(adminToken)
    });
    const data = await response.json();
    if (!response.ok) {
      alert(data.message || 'Failed to load dashboard stats');
      return;
    }
    adminDashboardStats = data;
    renderAdminDashboard();
  } catch (error) {
    alert('Error loading dashboard stats');
  }
}

function renderAdminDashboard() {
  const statsDiv = document.getElementById('adminDashboardStats');
  if (!adminDashboardStats) return;
  statsDiv.innerHTML = `
    <div>Total Products: ${adminDashboardStats.totalProducts}</div>
    <div>Total Customers: ${adminDashboardStats.totalCustomers}</div>
    <div>Orders: 
      Pending (${adminDashboardStats.ordersByStatus?.Pending || 0}) | 
      Processing (${adminDashboardStats.ordersByStatus?.Processing || 0}) | 
      Shipped (${adminDashboardStats.ordersByStatus?.Shipped || 0})
    </div>
  `;
}

async function loadAdminProducts() {
  if (!adminToken) return;
  const params = new URLSearchParams({
    page: adminProductPage,
    limit: adminProductLimit,
    search: adminProductSearch,
    sortBy: adminProductSortBy,
    order: adminProductOrder
  });
  try {
    const response = await fetch('http://localhost:5000/api/products?' + params.toString(), {
      headers: getAuthHeaders(adminToken)
    });
    const data = await response.json();
    if (!response.ok) {
      alert(data.message || 'Failed to load products');
      return;
    }
    renderAdminProducts(data.products);
  } catch (error) {
    alert('Error loading products');
  }
}

function renderAdminProducts(products) {
  const tbody = document.querySelector('#adminProductsTable tbody');
  tbody.innerHTML = '';
  products.forEach(product => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${product.name}</td>
      <td>${product.price.toFixed(2)}</td>
      <td>${product.stock}</td>
      <td class="actions">
        <button onclick="editAdminProduct('${product._id}')">Edit</button>
        <button onclick="deleteAdminProduct('${product._id}')">Delete</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

async function loadAdminCustomers() {
  if (!adminToken) return;
  const params = new URLSearchParams({
    page: adminCustomerPage,
    limit: adminCustomerLimit,
    search: adminCustomerSearch,
    status: adminCustomerStatusFilter === 'all' ? '' : adminCustomerStatusFilter
  });
  try {
    const response = await fetch('http://localhost:5000/api/customers?' + params.toString(), {
      headers: getAuthHeaders(adminToken)
    });
    const data = await response.json();
    if (!response.ok) {
      alert(data.message || 'Failed to load customers');
      return;
    }
    renderAdminCustomers(data.customers);
  } catch (error) {
    alert('Error loading customers');
  }
}

function renderAdminCustomers(customers) {
  const tbody = document.querySelector('#adminCustomersTable tbody');
  tbody.innerHTML = '';
  customers.forEach(customer => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${customer.firstName} ${customer.lastName}</td>
      <td>${customer.email}</td>
      <td>${customer.isBlocked ? 'Blocked' : 'Active'}</td>
      <td class="actions">
        <button onclick="viewAdminCustomer('${customer._id}')">View</button>
        <button onclick="toggleBlockCustomer('${customer._id}', ${customer.isBlocked})">${customer.isBlocked ? 'Unblock' : 'Block'}</button>
        <button onclick="impersonateCustomer('${customer._id}', '${customer.firstName} ${customer.lastName}')">Impersonate</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

async function loadAdminOrders() {
  if (!adminToken) return;
  const params = new URLSearchParams({
    page: adminOrderPage,
    limit: adminOrderLimit,
    status: adminOrderStatusFilter,
    customerId: adminOrderCustomerFilter,
    productId: adminOrderProductFilter
  });
  try {
    const response = await fetch('http://localhost:5000/api/orders?' + params.toString(), {
      headers: getAuthHeaders(adminToken)
    });
    const data = await response.json();
    if (!response.ok) {
      alert(data.message || 'Failed to load orders');
      return;
    }
    renderAdminOrders(data.orders);
  } catch (error) {
    alert('Error loading orders');
  }
}

function renderAdminOrders(orders) {
  const tbody = document.querySelector('#adminOrdersTable tbody');
  tbody.innerHTML = '';
  orders.forEach(order => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${order._id}</td>
      <td>${order.userId ? order.userId.firstName : ''}</td>
      <td>${order.status}</td>
      <td>${order.productId ? order.productId.name : ''}</td>
      <td class="actions">
        <button onclick="viewAdminOrder('${order._id}')">View</button>
        <button onclick="updateAdminOrder('${order._id}')">Update</button>
        <button onclick="deleteAdminOrder('${order._id}')">Delete</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

async function impersonateCustomer(customerId, customerName) {
  if (!adminToken) return;
  try {
    const response = await fetch(`http://localhost:5000/api/auth/impersonate/${customerId}`, {
      method: 'POST',
      headers: getAuthHeaders(adminToken)
    });
    const data = await response.json();
    if (!response.ok) {
      alert(data.message || 'Failed to impersonate customer');
      return;
    }
    impersonationToken = data.token;
    localStorage.setItem('impersonationToken', impersonationToken);
    document.getElementById('impersonationBanner').style.display = 'block';
    document.getElementById('impersonatedName').textContent = customerName;
    switchTab({ target: document.querySelector('.tab[data-tab="customerPortal"]') });
    customerToken = impersonationToken;
    currentCustomer = data.user;
    document.getElementById('customerAuthForms').style.display = 'none';
    document.getElementById('customerDashboard').style.display = 'block';
    loadCustomerProducts();
    loadCustomerOrders();
    loadCustomerProfile();
  } catch (error) {
    alert('Error during impersonation');
  }
}

function stopImpersonation() {
  impersonationToken = null;
  localStorage.removeItem('impersonationToken');
  document.getElementById('impersonationBanner').style.display = 'none';
  location.reload();
}

function showModal(contentHtml) {
  const modalOverlay = document.getElementById('modalOverlay');
  const modalBody = document.getElementById('modalBody');
  modalBody.innerHTML = contentHtml;
  modalOverlay.classList.add('active');
}

function closeModal() {
  const modalOverlay = document.getElementById('modalOverlay');
  modalOverlay.classList.remove('active');
}

function showAddProductModal() {
  const content = `
    <h3>Add New Product</h3>
    <form id="addProductForm">
      <label for="productName">Name</label>
      <input type="text" id="productName" required />
      <label for="productDescription">Description</label>
      <textarea id="productDescription"></textarea>
      <label for="productPrice">Price</label>
      <input type="number" id="productPrice" min="0.01" step="0.01" required />
      <label for="productStock">Stock Quantity</label>
      <input type="number" id="productStock" min="0" step="1" required />
      <button type="submit">Add Product</button>
    </form>
  `;
  showModal(content);
  document.getElementById('addProductForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    if (!adminToken) return;
    const name = document.getElementById('productName').value;
    const description = document.getElementById('productDescription').value;
    const price = parseFloat(document.getElementById('productPrice').value);
    const stock = parseInt(document.getElementById('productStock').value);
    try {
      const response = await fetch('http://localhost:5000/api/products', {
        method: 'POST',
        headers: getAuthHeaders(adminToken),
        body: JSON.stringify({ name, description, price, stock })
      });
      const data = await response.json();
      if (!response.ok) {
        alert(data.message || 'Failed to add product');
        return;
      }
      alert('Product added successfully');
      closeModal();
      loadAdminProducts();
    } catch (error) {
      alert('Error adding product');
    }
  });
}

async function editAdminProduct(productId) {
  if (!adminToken) return;
  try {
    const response = await fetch(`http://localhost:5000/api/products/${productId}`, {
      headers: getAuthHeaders(adminToken)
    });
    const product = await response.json();
    if (!response.ok) {
      alert(product.message || 'Failed to load product');
      return;
    }
    const content = `
      <h3>Edit Product</h3>
      <form id="editProductForm">
        <label for="editProductName">Name</label>
        <input type="text" id="editProductName" value="${product.name}" required />
        <label for="editProductDescription">Description</label>
        <textarea id="editProductDescription">${product.description || ''}</textarea>
        <label for="editProductPrice">Price</label>
        <input type="number" id="editProductPrice" min="0.01" step="0.01" value="${product.price}" required />
        <label for="editProductStock">Stock Quantity</label>
        <input type="number" id="editProductStock" min="0" step="1" value="${product.stock}" required />
        <button type="submit">Save Changes</button>
      </form>
    `;
    showModal(content);
    document.getElementById('editProductForm').addEventListener('submit', async function(e) {
      e.preventDefault();
      const name = document.getElementById('editProductName').value;
      const description = document.getElementById('editProductDescription').value;
      const price = parseFloat(document.getElementById('editProductPrice').value);
      const stock = parseInt(document.getElementById('editProductStock').value);
      try {
        const res = await fetch(`http://localhost:5000/api/products/${productId}`, {
          method: 'PUT',
          headers: getAuthHeaders(adminToken),
          body: JSON.stringify({ name, description, price, stock })
        });
        const data = await res.json();
        if (!res.ok) {
          alert(data.message || 'Failed to update product');
          return;
        }
        alert('Product updated successfully');
        closeModal();
        loadAdminProducts();
      } catch (error) {
        alert('Error updating product');
      }
    });
  } catch (error) {
    alert('Error loading product');
  }
}

async function deleteAdminProduct(productId) {
  if (!adminToken) return;
  if (!confirm('Are you sure you want to delete this product?')) return;
  try {
    const response = await fetch(`http://localhost:5000/api/products/${productId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(adminToken)
    });
    const data = await response.json();
    if (!response.ok) {
      alert(data.message || 'Failed to delete product');
      return;
    }
    alert('Product deleted successfully');
    loadAdminProducts();
  } catch (error) {
    alert('Error deleting product');
  }
}
