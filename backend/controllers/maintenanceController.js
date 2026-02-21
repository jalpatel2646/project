const Maintenance = require('../models/Maintenance');

exports.getAll = async (req, res) => {
    try {
        const records = await Maintenance.find().populate('vehicle', 'licensePlate model').sort({ date: -1 });
        res.json(records);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.create = async (req, res) => {
    try {
        const record = new Maintenance(req.body);
        await record.save();
        const populated = await record.populate('vehicle', 'licensePlate model');
        res.status(201).json(populated);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.remove = async (req, res) => {
    try {
        await Maintenance.findByIdAndDelete(req.params.id);
        res.json({ message: 'Record deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
