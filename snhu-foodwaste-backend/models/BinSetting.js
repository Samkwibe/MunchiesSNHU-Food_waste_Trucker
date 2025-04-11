const mongoose = require('mongoose');

const BinSettingSchema = new mongoose.Schema({
  binId: String,
  threshold: Number,
  notes: String,
  managedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('BinSetting', BinSettingSchema);
