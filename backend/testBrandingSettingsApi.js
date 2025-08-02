const http = require('http');

const AUTH_TOKEN = 'Bearer dummy-token-for-testing'; // Replace with a valid token if available

function makeRequest(options, data) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => {
        body += chunk;
      });
      res.on('end', () => {
        resolve({ statusCode: res.statusCode, body });
      });
    });
    req.on('error', (e) => {
      reject(e);
    });
    if (data) {
      req.write(data);
    }
    req.end();
  });
}

async function testBrandingSettingsApi() {
  try {
    // GET current branding settings
    let options = {
      hostname: 'localhost',
      port: 5000,
      path: '/api/settings/branding',
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': AUTH_TOKEN
      }
    };
    let response = await makeRequest(options);
    console.log('GET branding settings response:', response.body);

    // PUT update branding settings
    options.method = 'PUT';
    const postData = JSON.stringify({
      primaryColor: '#123456',
      secondaryColor: '#654321',
      fontFamily: 'Arial',
      customHtml: '<p>Test</p>'
    });
    response = await makeRequest(options, postData);
    console.log('PUT update branding settings response:', response.body);

    // GET branding settings again to verify persistence
    options.method = 'GET';
    response = await makeRequest(options);
    console.log('GET branding settings after update response:', response.body);

  } catch (error) {
    console.error('Error testing branding settings API:', error);
  }
}

testBrandingSettingsApi();
