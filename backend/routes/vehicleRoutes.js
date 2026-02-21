const express = require('express');
const router = express.Router();
const vehicleController = require('../controllers/vehicleController');
const { auth, authorize } = require('../middleware/auth');

router.get('/', auth, vehicleController.getVehicles);
router.post('/', auth, vehicleController.createVehicle);
router.patch('/:id', auth, vehicleController.updateVehicle);
router.delete('/:id', auth, vehicleController.deleteVehicle);

module.exports = router;
