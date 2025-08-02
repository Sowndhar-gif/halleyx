const fetch = require('node-fetch');

async function testOrders() {
  console.log('Starting orders API test...');
  const response = await fetch('http://localhost:3000/api/orders', {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });
  const data = await response.json();
  console.log('Orders response:', data);
}

async function testCustomers() {
  console.log('Starting customers API test...');
  const response = await fetch('http://localhost:3000/api/customers', {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });
  const data = await response.json();
  console.log('Customers response:', data);
}

async function testSettings() {
  console.log('Starting settings API test...');
  const response = await fetch('http://localhost:3000/api/settings', {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });
  const data = await response.json();
  console.log('Settings response:', data);
}

async function runTests() {
  await testOrders();
  await testCustomers();
  await testSettings();
}

runTests();
