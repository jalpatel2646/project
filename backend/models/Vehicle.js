const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
    licensePlate: { type: String, required: true, unique: true },
    model: { type: String, required: true },
    transportType: { type: String, enum: ['Road (Diesel)', 'Electric', 'Anti-Gravity (Experimental)'], default: 'Road (Diesel)' },
    type: { type: String, enum: ['Truck', 'Van', 'Sedan', 'SUV', 'Bus', 'Trailer', 'Pickup', 'Mini Van'], required: true },
    maxLoadCapacity: { type: Number, required: true }, // in kg
    odometer: { type: Number, required: true, default: 0 },
    status: {
        type: String,
        enum: ['Available', 'On Trip', 'In Shop', 'Out of Service', 'Retired'],
        default: 'Available'
    },
    region: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Vehicle', vehicleSchema);
