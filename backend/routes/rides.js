const express = require('express');
const router = express.Router();
const {
  createRide,
  getAllRides,
  getRideById,
  findMatches,
  joinRide,
  updatePassengerStatus,
  getMyRides,
  cancelRide,
  completeRide
} = require('../controllers/rideController');
const { protect } = require('../middleware/auth');

// All routes are protected
router.use(protect);

// Ride CRUD operations
router.post('/', createRide);
router.get('/', getAllRides);
router.get('/my-rides', getMyRides);
// router.post('/find-matches', findMatches);
router.get('/:id', getRideById);
router.delete('/:id', cancelRide);
router.put('/:id/complete', completeRide);

// Passenger operations
router.post('/:id/join', joinRide);
router.put('/:id/passenger/:passengerId', updatePassengerStatus);

module.exports = router;


