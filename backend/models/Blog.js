const mongoose = require('mongoose');

// Define the schema first
const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true
  },
  content: {
    type: String,
    required: [true, 'Content is required']
  },
  author: {
    type: String,
    required: [true, 'Author is required'],
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Then create and export the model
module.exports = mongoose.model('Blog', blogSchema);