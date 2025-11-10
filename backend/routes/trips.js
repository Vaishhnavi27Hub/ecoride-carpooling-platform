

const express = require('express');
const router = express.Router();
const {
  createTrip,
  getAllTrips,
  getTripById,
  joinTrip,
  leaveTrip,
  updateParticipantStatus,
  getMyTrips,
  updateTrip,
  cancelTrip,
  addReview
} = require('../controllers/tripController');
const { protect } = require('../middleware/auth');

// All routes are protected
router.use(protect);

// Trip CRUD operations
router.post('/', createTrip);
router.get('/', getAllTrips);
router.get('/my-trips', getMyTrips);
router.get('/:id', getTripById);
router.put('/:id', updateTrip);
router.delete('/:id', cancelTrip);

// Participant operations
router.post('/:id/join', joinTrip);
router.delete('/:id/leave', leaveTrip);
router.put('/:id/participant/:participantId', updateParticipantStatus);

// Review operations
router.post('/:id/review', addReview);

module.exports = router;