const mongoose = require('mongoose');

// Модель для курсов
const CourseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  lectures: [{
    title: String,
    content: String,
    files: [String]
  }],
  practices: [{
    title: String,
    content: String,
    files: [String]
  }],
  duration: {
    type: String, // или тип данных, который соответствует вашим требованиям (Number, Date и т.д.)
    required: true
  },
  category: {
    type: String,
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  }
});

module.exports = mongoose.model('Course', CourseSchema);
