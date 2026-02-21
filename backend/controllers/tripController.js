const Trip = require('../models/Trip');
const Vehicle = require('../models/Vehicle');
const Driver = require('../models/Driver');

exports.createTrip = async (req, res) => {
    try {
        const { vehicle: vehicleId, driver: driverId, tripId } = req.body;

        const vehicle = await Vehicle.findById(vehicleId);
        if (!vehicle) return res.status(404).json({ error: 'Vehicle not found' });

        const driver = await Driver.findById(driverId);
        if (!driver) return res.status(404).json({ error: 'Driver not found' });

        const finalTripId = tripId || `TRIP-${Date.now()}`;

        // Check for duplicate tripId
        const existing = await Trip.findOne({ tripId: finalTripId });
        if (existing) return res.status(400).json({ error: `Trip ID "${finalTripId}" already exists` });

        const trip = new Trip({
            ...req.body,
            tripId: finalTripId,
            dispatchDate: req.body.dispatchDate || new Date()
        });
        await trip.save();

        // Update vehicle & driver statuses
        vehicle.status = 'On Trip';
        await vehicle.save();
        driver.status = 'On Duty';
        await driver.save();

        const populated = await trip.populate('vehicle driver');
        res.status(201).json(populated);
    } catch (error) {
        res.status(400).json({ error: error.message || 'Failed to create trip' });
    }
};


exports.completeTrip = async (req, res) => {
    try {
        const trip = await Trip.findById(req.params.id);
        if (!trip) return res.status(404).send();

        trip.status = 'Completed';
        trip.completionDate = new Date();
        await trip.save();

        // Update vehicle and driver status back to Available/Off Duty
        await Vehicle.findByIdAndUpdate(trip.vehicle, { status: 'Available' });
        await Driver.findByIdAndUpdate(trip.driver, { status: 'Off Duty' });

        res.send(trip);
    } catch (error) {
        res.status(400).send(error);
    }
};

exports.getTrips = async (req, res) => {
    try {
        const trips = await Trip.find(req.query).populate('vehicle driver');
        res.send(trips);
    } catch (error) {
        res.status(500).send(error);
    }
};

exports.deleteTrip = async (req, res) => {
    try {
        const trip = await Trip.findByIdAndDelete(req.params.id);
        if (!trip) return res.status(404).json({ error: 'Trip not found' });
        // Reset vehicle and driver status
        if (trip.status !== 'Completed') {
            await Vehicle.findByIdAndUpdate(trip.vehicle, { status: 'Available' });
            await Driver.findByIdAndUpdate(trip.driver, { status: 'Off Duty' });
        }
        res.json({ message: 'Trip deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
