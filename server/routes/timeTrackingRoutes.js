const express = require('express');
const {
  createTimeEntry,
  getTimeEntries,
  deleteTimeEntry,
  updateTimeEntry
} = require('../controllers/timeTrackingController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.route('/')
  .get(protect, getTimeEntries)
  .post(protect, createTimeEntry);

router.route('/:id')
  .put(protect, updateTimeEntry)
  .delete(protect, deleteTimeEntry);

module.exports = router;
