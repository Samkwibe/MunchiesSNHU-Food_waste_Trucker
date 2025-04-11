const mongoose = require('mongoose');

const FeedbackSchema = new mongoose.Schema({
  submittedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: String,
  rating: Number
}, { timestamps: true });

module.exports = mongoose.model('Feedback', FeedbackSchema);
