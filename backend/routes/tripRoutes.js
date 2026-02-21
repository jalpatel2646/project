const express = require('express');
const router = express.Router();
const tripController = require('../controllers/tripController');
const { auth, authorize } = require('../middleware/auth');

router.get('/', auth, tripController.getTrips);
router.post('/', auth, tripController.createTrip);
router.patch('/:id/complete', auth, tripController.completeTrip);
router.delete('/:id', auth, tripController.deleteTrip);

module.exports = router;
