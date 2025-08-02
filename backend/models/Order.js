const mongoose = require('mongoose');
const OrderSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  productId: mongoose.Schema.Types.ObjectId,
  quantity: Number,
  status: { type: String, default: 'Processing' }
});
module.exports = mongoose.model('Order', OrderSchema);
