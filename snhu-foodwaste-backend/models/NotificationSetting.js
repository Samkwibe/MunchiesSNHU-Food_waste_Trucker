const mongoose = require('mongoose');

const NotificationSettingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  emailNotifications: Boolean,
  smsNotifications: Boolean,
  highPriorityAlerts: Boolean
});

module.exports = mongoose.model('NotificationSetting', NotificationSettingSchema);
