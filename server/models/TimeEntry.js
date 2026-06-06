const mongoose = require('mongoose');

const timeEntrySchema = new mongoose.Schema({
  task: {
    type: String,
    required: true
  },
  project: {
    type: String,
    default: ''
  },
  duration: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  startTime: {
    type: Date,
    default: null
  },
  endTime: {
    type: Date,
    default: null
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  description: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('TimeEntry', timeEntrySchema);
