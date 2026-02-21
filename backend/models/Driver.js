const mongoose = require('mongoose');

const driverSchema = new mongoose.Schema({
    name: { type: String, required: true },
    licenseNumber: { type: String, required: true, unique: true },
    licenseExpiryDate: { type: Date, required: true },
    status: {
        type: String,
        enum: ['On Duty', 'Off Duty', 'Suspended'],
        default: 'Off Duty'
    },
    safetyScore: { type: Number, default: 100 },
    tripCompletionRate: { type: Number, default: 0 },
    phone: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Driver', driverSchema);
