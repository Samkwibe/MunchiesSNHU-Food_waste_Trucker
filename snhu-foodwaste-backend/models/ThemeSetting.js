const mongoose = require('mongoose');

const ThemeSettingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  theme: { type: String, enum: ['light', 'dark'], default: 'light' }
}, { timestamps: true });

module.exports = mongoose.model('ThemeSetting', ThemeSettingSchema);
