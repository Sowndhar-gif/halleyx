const fetch = require('node-fetch');

async function login() {
  console.log('Starting login test...');
  const response = await fetch('http://localhost:3000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'testuser@example.com', password: 'TestPass123' }),
  });
  console.log('Request sent, awaiting response...');
  const data = await response.json();
  console.log('Login response:', data);
  if (data.token) {
    console.log('Token:', data.token);
  } else {
    console.error('Login failed');
  }
}

login();
