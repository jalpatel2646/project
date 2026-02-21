const Driver = require('../models/Driver');

exports.getDrivers = async (req, res) => {
    try {
        const drivers = await Driver.find(req.query);
        res.send(drivers);
    } catch (error) {
        res.status(500).send(error);
    }
};

exports.createDriver = async (req, res) => {
    try {
        const driver = new Driver(req.body);
        await driver.save();
        res.status(201).send(driver);
    } catch (error) {
        res.status(400).send(error);
    }
};

exports.updateDriver = async (req, res) => {
    try {
        const driver = await Driver.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!driver) return res.status(404).send();
        res.send(driver);
    } catch (error) {
        res.status(400).send(error);
    }
};

exports.deleteDriver = async (req, res) => {
    try {
        const driver = await Driver.findByIdAndDelete(req.params.id);
        if (!driver) return res.status(404).send();
        res.send(driver);
    } catch (error) {
        res.status(500).send(error);
    }
};
