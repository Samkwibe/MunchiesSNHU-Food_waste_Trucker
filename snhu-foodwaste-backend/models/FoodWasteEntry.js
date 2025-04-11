const mongoose = require('mongoose');

const FoodWasteEntrySchema = new mongoose.Schema({
  submittedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  foodType: String,
  weight: Number,
  date: Date,
  location: String,
  notes: String,
  temperature: Number,
  humidity: Number,
  pH: Number,
  gas: Number,
  binFullness: Number,
  compostWeight: Number,
  published: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('FoodWasteEntry', FoodWasteEntrySchema);
