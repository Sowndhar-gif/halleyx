const fetch = require('node-fetch');

async function testProducts() {
  // Test fetching product list
  let response = await fetch('http://localhost:5000/api/products', {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });
  let data = await response.json();
  console.log('GET /api/products response:', data);

  // Test creating a new product (assuming auth token required)
  // Replace with a valid token if needed
  const token = 'your-auth-token-here';

  response = await fetch('http://localhost:5000/api/products', {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      name: 'Test Product',
      description: 'This is a test product',
      price: 9.99,
      countInStock: 10
    }),
  });
  data = await response.json();
  console.log('POST /api/products response:', data);
}

testProducts();
