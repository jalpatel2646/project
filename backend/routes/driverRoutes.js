const express = require('express');
const router = express.Router();
const driverController = require('../controllers/driverController');
const { auth, authorize } = require('../middleware/auth');

router.get('/', auth, driverController.getDrivers);
router.post('/', auth, driverController.createDriver);
router.patch('/:id', auth, driverController.updateDriver);
router.delete('/:id', auth, driverController.deleteDriver);

module.exports = router;
