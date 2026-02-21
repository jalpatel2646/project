const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
    vehicle: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle', required: true },
    type: {
        type: String,
        enum: ['Fuel', 'Maintenance'],
        required: true
    },
    amount: { type: Number, required: true },
    date: { type: Date, default: Date.now },
    details: {
        liters: { type: Number }, // For Fuel
        serviceType: { type: String }, // For Maintenance
        description: { type: String }
    }
}, { timestamps: true });

module.exports = mongoose.model('Expense', expenseSchema);
