const express = require('express');
const router = express.Router();
const vehicleRoutes = require('./vehicleRoutes');
const driverRoutes = require('./driverRoutes');
const tripRoutes = require('./tripRoutes');
const expenseRoutes = require('./expenseRoutes');
const maintenanceRoutes = require('./maintenanceRoutes');
const authRoutes = require('./authRoutes');

router.use('/auth', authRoutes);
router.use('/vehicles', vehicleRoutes);
router.use('/drivers', driverRoutes);
router.use('/trips', tripRoutes);
router.use('/expenses', expenseRoutes);
router.use('/maintenance', maintenanceRoutes);

module.exports = router;
