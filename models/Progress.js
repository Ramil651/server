const mongoose = require('mongoose');

const ProgressSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true },
  courseId: { type: mongoose.Schema.Types.ObjectId, required: true },
  completedMaterials: [{ type: mongoose.Schema.Types.ObjectId }]
});

module.exports = mongoose.model('Progress', ProgressSchema);
