const Vehicle = require('../models/Vehicle');

exports.getVehicles = async (req, res) => {
    try {
        const filters = {};
        if (req.query.status) filters.status = req.query.status;
        if (req.query.type) filters.type = req.query.type;
        if (req.query.region) filters.region = req.query.region;

        const vehicles = await Vehicle.find(filters);
        res.send(vehicles);
    } catch (error) {
        res.status(500).send(error);
    }
};

exports.createVehicle = async (req, res) => {
    try {
        const vehicle = new Vehicle(req.body);
        await vehicle.save();
        res.status(201).send(vehicle);
    } catch (error) {
        res.status(400).send(error);
    }
};

exports.updateVehicle = async (req, res) => {
    try {
        const vehicle = await Vehicle.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!vehicle) return res.status(404).send();
        res.send(vehicle);
    } catch (error) {
        res.status(400).send(error);
    }
};

exports.deleteVehicle = async (req, res) => {
    try {
        const vehicle = await Vehicle.findByIdAndDelete(req.params.id);
        if (!vehicle) return res.status(404).send();
        res.send(vehicle);
    } catch (error) {
        res.status(500).send(error);
    }
};
