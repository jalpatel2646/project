const mongoose = require('mongoose');

const maintenanceSchema = new mongoose.Schema({
    vehicle: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle', required: true },
    serviceType: {
        type: String,
        enum: ['Oil Change', 'Brake Service', 'Tire Rotation', 'Engine Repair', 'Transmission', 'Battery', 'AC Service', 'General Inspection'],
        required: true
    },
    description: { type: String, required: true },
    date: { type: Date, required: true, default: Date.now },
    cost: { type: Number, required: true },
    status: {
        type: String,
        enum: ['Scheduled', 'In Progress', 'Completed'],
        default: 'Completed'
    }
}, { timestamps: true });

module.exports = mongoose.model('Maintenance', maintenanceSchema);
