document.getElementById('adminLoginForm').addEventListener('submit', e => {
  e.preventDefault();
  const email = document.getElementById('adminLoginEmail').value.trim();
  const password = document.getElementById('adminLoginPassword').value.trim();
  const admins = [
    { email: 'admin@example.com', password: 'admin123' },
    { email: 'superadmin@example.com', password: 'supersecret' }
  ];
  const user = admins.find(a => a.email.toLowerCase() === email.toLowerCase() && a.password === password);
  if (user) {
    window.currentAdmin = user;
    showAdminDashboard();
  } else {
    alert('Invalid email or password');
  }
});

function showAdminDashboard() {
  document.getElementById('adminAuthForms').style.display = 'none';
  document.getElementById('adminDashboard').style.display = 'block';
  // Additional dashboard loading logic can be added here
  console.log('Admin dashboard shown');
}
