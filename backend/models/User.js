const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ['customer', 'admin'], default: 'customer' }
});
module.exports = mongoose.model('User', UserSchema);
