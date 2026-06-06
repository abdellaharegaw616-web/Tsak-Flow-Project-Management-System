const TimeEntry = require('../models/TimeEntry');

const createTimeEntry = async (req, res) => {
  try {
    const { task, duration, date, project, description } = req.body;

    const timeEntry = await TimeEntry.create({
      task,
      duration,
      date: date || new Date(),
      project: project || '',
      description: description || '',
      user: req.user._id
    });

    const populatedEntry = await TimeEntry.findById(timeEntry._id)
      .populate('user', 'name email');

    res.status(201).json(populatedEntry);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getTimeEntries = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const filter = { user: req.user._id };

    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }

    const timeEntries = await TimeEntry.find(filter)
      .populate('user', 'name email')
      .sort('-createdAt');

    res.json(timeEntries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteTimeEntry = async (req, res) => {
  try {
    const timeEntry = await TimeEntry.findById(req.params.id);

    if (!timeEntry) {
      return res.status(404).json({ message: 'Time entry not found' });
    }

    if (timeEntry.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this entry' });
    }

    await timeEntry.deleteOne();
    res.json({ message: 'Time entry deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateTimeEntry = async (req, res) => {
  try {
    const timeEntry = await TimeEntry.findById(req.params.id);

    if (!timeEntry) {
      return res.status(404).json({ message: 'Time entry not found' });
    }

    if (timeEntry.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this entry' });
    }

    const updated = await TimeEntry.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).populate('user', 'name email');

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createTimeEntry,
  getTimeEntries,
  deleteTimeEntry,
  updateTimeEntry
};
