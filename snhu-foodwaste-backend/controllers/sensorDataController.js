/**
 * sensorDataController.js
 * Placeholder controller for smart-bin sensor data.
 *
 * Current status: Sensor readings (temperature, humidity, pH, gas, bin fullness)
 * are entered manually through the food waste entry form and stored directly
 * on each FoodWasteEntry document.  When IoT bins are deployed in a future
 * phase, this controller will receive automated readings and persist them
 * in a dedicated SensorData collection for real-time trend analysis.
 *
 * All endpoints return HTTP 501 (Not Implemented) with a descriptive message
 * so the frontend can display a clear explanation to staff users.
 */

/**
 * @desc    Record a new sensor reading from a smart bin
 * @route   POST /api/sensors
 * @access  Private (staff, admin, or IoT device token)
 */
const recordReading = async (req, res) => {
  res.status(501).json({
    success: false,
    message: 'Automated sensor recording is planned for a future release. '
           + 'Sensor data is currently entered manually via the food waste form.'
  });
};

/**
 * @desc    Get historical sensor readings for charting
 * @route   GET /api/sensors/history
 * @access  Private (staff, admin)
 */
const getHistory = async (req, res) => {
  res.status(501).json({
    success: false,
    message: 'Sensor history retrieval is planned for a future release. '
           + 'Historical readings are available through the waste reports summary endpoint.'
  });
};

module.exports = {
  recordReading,
  getHistory
};
