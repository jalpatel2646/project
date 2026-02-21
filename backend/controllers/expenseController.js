const Expense = require('../models/Expense');
const Vehicle = require('../models/Vehicle');

exports.addExpense = async (req, res) => {
    try {
        const expense = new Expense(req.body);
        await expense.save();

        // If it's a maintenance record, set vehicle to 'In Shop'
        if (expense.type === 'Maintenance') {
            await Vehicle.findByIdAndUpdate(req.body.vehicle, { status: 'In Shop' });
        }

        res.status(201).send(expense);
    } catch (error) {
        res.status(400).send(error);
    }
};

exports.getExpenses = async (req, res) => {
    try {
        const expenses = await Expense.find(req.query).populate('vehicle');
        res.send(expenses);
    } catch (error) {
        res.status(500).send(error);
    }
};

exports.deleteExpense = async (req, res) => {
    try {
        const expense = await Expense.findByIdAndDelete(req.params.id);
        if (!expense) return res.status(404).json({ error: 'Expense not found' });
        res.json({ message: 'Deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getAnalytics = async (req, res) => {
    try {
        const expenses = await Expense.find().populate('vehicle');
        const trips = await Trip.find().populate('vehicle');

        // Simple ROI and Fuel Efficiency Calculation logic here
        // In a real app, this would be more complex aggregations
        res.send({ expenses, trips });
    } catch (error) {
        res.status(500).send(error);
    }
};
