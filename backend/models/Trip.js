const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema({
    tripId: { type: String, required: true, unique: true },
    vehicle: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle', required: true },
    driver: { type: mongoose.Schema.Types.ObjectId, ref: 'Driver', required: true },
    origin: { type: String, required: true },
    destination: { type: String, required: true },
    cargoWeight: { type: Number, required: true },
    status: {
        type: String,
        enum: ['Draft', 'Dispatched', 'Completed', 'Cancelled'],
        default: 'Draft'
    },
    dispatchDate: { type: Date },
    completionDate: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('Trip', tripSchema);
